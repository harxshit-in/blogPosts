import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { collection, query, where, getDocs, doc, deleteDoc, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BlogPost } from '../types';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { SocialSidebar } from '../components/layout/SocialSidebar';

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'blogs'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setLoading(false);
          return;
        }
        const postData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BlogPost;
        setPost(postData);

        const recsSnap = await getDocs(query(collection(db, 'recommendations')));
        setRecommendations(recsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const latestQ = query(collection(db, 'blogs'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(3));
        const latestSnap = await getDocs(latestQ);
        setRelatedPosts(latestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)).filter(p => p.id !== postData.id));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchAll();
  }, [slug]);

  const handleDelete = async () => {
    if (!post || !profile) return;
    if (post.authorId !== profile.uid && profile.role !== 'admin') return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'blogs', post.id));
        toast.success('Post deleted');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  if (!post) return <div className="min-h-[60vh] flex flex-col items-center justify-center">Post not found</div>;

  const isAuthorOrAdmin = profile && (profile.uid === post.authorId || profile.role === 'admin');

  return (
    <div className="relative min-h-screen bg-white">
      <SocialSidebar title={post.title} url={window.location.href} />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Helmet>
          <title>{post.title} - Blog.BattleArenaSSC</title>
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt} />
          <meta property="og:image" content={post.coverImage} />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="article" />
        </Helmet>

        <header className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="font-bold text-blue-800">{post.authorName.toUpperCase()}</span>
            <span>|</span>
            <span>{format(post.createdAt, 'MMMM d, yyyy')}</span>
            {isAuthorOrAdmin && (
              <button onClick={handleDelete} className="text-red-600 hover:text-red-700 ml-auto">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {post.coverImage && (
          <figure className="mb-8">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto" referrerPolicy="no-referrer" />
          </figure>
        )}

        <article className="prose prose-lg max-w-none prose-p:text-gray-800 prose-headings:text-gray-900">
          {post.blocks.map((block) => {
            switch (block.type) {
              case 'p': return <p key={block.id} className="mb-4 whitespace-pre-wrap p-1" style={{ backgroundColor: block.highlightColor }}>{block.content}</p>;
              case 'h2': return <h2 key={block.id} className="text-3xl font-bold mt-6 mb-2">{block.content}</h2>;
              case 'image': return block.content ? <figure key={block.id} className="my-12"><img src={block.content} alt="" className="rounded-xl" style={{ width: block.imageSize || '100%' }} /></figure> : null;
              case 'youtube': return block.content ? <div key={block.id} className="my-8 aspect-video"><iframe src={block.content.replace('watch?v=', 'embed/')} className="w-full h-full rounded-xl" /></div> : null;
              case 'cta':
                const [text, url] = block.content.split('|');
                return text && url ? <a key={block.id} href={url} target="_blank" rel="noopener noreferrer" className="my-8 inline-block bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors">{text}</a> : null;
              case 'banner':
                const [bImg, bUrl] = block.content.split('|');
                return bImg && bUrl ? <a key={block.id} href={bUrl} target="_blank" rel="noopener noreferrer" className="my-8 block"><img src={bImg} alt="Banner" className="w-full rounded-xl" /></a> : null;
              default: return null;
            }
          })}
        </article>

        <section className="mt-16 pt-16 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Recent Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(p => (
              <Link key={p.id} to={`/post/${p.slug}`} className="block group">
                {p.coverImage && <img src={p.coverImage} alt="" className="w-full h-40 object-cover rounded-xl mb-4" referrerPolicy="no-referrer" />}
                <h4 className="font-bold text-gray-900 group-hover:text-blue-600">{p.title}</h4>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 pt-16 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map(rec => (
              <a key={rec.id} href={rec.url} target="_blank" rel="noopener noreferrer" className="block group">
                {rec.imageUrl && <img src={rec.imageUrl} alt={rec.title} className="w-full h-40 object-cover rounded-xl mb-4" referrerPolicy="no-referrer" />}
                <h4 className="font-bold text-gray-900 group-hover:text-blue-600">{rec.title}</h4>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
