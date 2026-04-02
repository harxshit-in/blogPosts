import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BlogPost } from '../types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsQuery = query(
          collection(db, 'blogs'),
          where('published', '==', true),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const fetchedPosts = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BlogPost[];
        setPosts(fetchedPosts);

        const bannersSnapshot = await getDocs(collection(db, 'banners'));
        setBanners(bannersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <Helmet>
        <title>BlogSpace - Discover amazing stories</title>
        <meta name="description" content="Read and write amazing stories on BlogSpace." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none text-lg shadow-sm transition-all"
            />
          </div>

          {banners.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map(banner => (
                <a key={banner.id} href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/post/${post.slug}`} className="group flex flex-col">
                <div className="relative h-48 mb-4 overflow-hidden rounded-xl bg-gray-100">
                  {post.coverImage ? (
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {post.authorImage ? (
                    <img src={post.authorImage} alt={post.authorName} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{post.authorName}</span>
                  <span className="text-sm text-gray-400">&middot;</span>
                  <span className="text-sm text-gray-500">{format(post.createdAt, 'MMM d, yyyy')}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4 flex-1">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500">Check back later for new content.</p>
          </div>
        )}
      </section>
    </div>
  );
}
