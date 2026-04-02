import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { EditorBlock, BlogPost } from '../types';
import { Plus, Image as ImageIcon, Type, Trash2, Save, Table, Youtube, Globe, MousePointerClick, Highlighter, LayoutTemplate } from 'lucide-react';

export function Editor() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: '1', type: 'p', content: '' }
  ]);
  const [saving, setSaving] = useState(false);

  const addBlock = (type: EditorBlock['type']) => {
    setBlocks([...blocks, { id: Date.now().toString(), type, content: '' }]);
  };

  const updateBlock = (id: string, content: string, extra?: Partial<EditorBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content, ...extra } : b));
  };

  const removeBlock = (id: string) => {
    if (blocks.length === 1) return;
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!profile) return;

    setSaving(true);
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const newPostRef = doc(collection(db, 'blogs'));
      
      const post: BlogPost = {
        id: newPostRef.id,
        title,
        excerpt: excerpt || title,
        coverImage: coverImage || null,
        blocks,
        authorId: profile.uid,
        authorName: profile.name,
        authorImage: profile.profileImage,
        published: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        slug: `${slug}-${Date.now().toString().slice(-4)}`
      };

      await setDoc(newPostRef, post);
      toast.success('Published successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error('Failed to publish: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <Helmet>
        <title>Write a Story - BlogSpace</title>
      </Helmet>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Draft</h1>
        <button
          onClick={handlePublish}
          disabled={saving}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      <div className="space-y-6">
        <input
          type="text"
          placeholder="Story Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-5xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none focus:ring-0 bg-transparent"
        />
        
        <input
          type="text"
          placeholder="Brief excerpt or subtitle..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full text-xl text-gray-500 placeholder-gray-300 border-none outline-none focus:ring-0 bg-transparent"
        />

        <div className="relative group">
          <input
            type="url"
            placeholder="Cover Image URL (optional)"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full text-sm text-gray-500 placeholder-gray-300 border-b border-gray-200 pb-2 outline-none focus:border-black bg-transparent transition-colors"
          />
          {coverImage && (
            <div className="mt-4 rounded-xl overflow-hidden h-64 bg-gray-100">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="mt-12 space-y-4">
          {blocks.map((block, index) => (
            <div key={block.id} className="group relative flex items-start gap-4">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-12 top-2 flex flex-col gap-1">
                <button onClick={() => removeBlock(block.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded bg-white shadow-sm border border-gray-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1">
                {block.type === 'p' && (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Tell your story..."
                      className="w-full text-lg text-gray-800 placeholder-gray-300 border-none outline-none focus:ring-0 bg-transparent resize-none min-h-[100px]"
                      style={{ height: 'auto', backgroundColor: block.highlightColor }}
                    />
                    <div className="flex gap-2">
                      {['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', 'transparent'].map(color => (
                        <button key={color} onClick={() => updateBlock(block.id, block.content, { highlightColor: color })} className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                )}
                {block.type === 'h2' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder="Heading"
                    className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none focus:ring-0 bg-transparent"
                  />
                )}
                {block.type === 'image' && (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                    <input
                      type="url"
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Paste image URL here..."
                      className="w-full text-sm text-gray-500 border-none outline-none bg-transparent mb-4"
                    />
                    <input
                      type="text"
                      value={block.imageSize || '100%'}
                      onChange={(e) => updateBlock(block.id, block.content, { imageSize: e.target.value })}
                      placeholder="Image size (e.g., 50%, 300px)"
                      className="w-full text-sm text-gray-700 border-b border-gray-300 outline-none bg-transparent mb-4 pb-1"
                    />
                    {block.content && <img src={block.content} alt="Block" className="rounded-lg" style={{ width: block.imageSize || '100%' }} />}
                  </div>
                )}
                {block.type === 'table' && (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder="Paste Table JSON..."
                    className="w-full text-sm font-mono text-gray-700 bg-gray-50 p-4 rounded-lg outline-none"
                  />
                )}
                {block.type === 'youtube' && (
                  <input
                    type="url"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder="YouTube Video URL..."
                    className="w-full text-sm text-gray-500 border-b border-gray-200 pb-2 outline-none focus:border-black bg-transparent"
                  />
                )}
                {block.type === 'webview' && (
                  <input
                    type="url"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder="WebView URL..."
                    className="w-full text-sm text-gray-500 border-b border-gray-200 pb-2 outline-none focus:border-black bg-transparent"
                  />
                )}
                {block.type === 'cta' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={block.content.split('|')[0] || ''}
                      onChange={(e) => updateBlock(block.id, `${e.target.value}|${block.content.split('|')[1] || ''}`)}
                      placeholder="Button Text"
                      className="flex-1 border-b border-gray-200 pb-2 outline-none"
                    />
                    <input
                      type="url"
                      value={block.content.split('|')[1] || ''}
                      onChange={(e) => updateBlock(block.id, `${block.content.split('|')[0] || ''}|${e.target.value}`)}
                      placeholder="Button URL"
                      className="flex-1 border-b border-gray-200 pb-2 outline-none"
                    />
                  </div>
                )}
                {block.type === 'banner' && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={block.content.split('|')[0] || ''}
                      onChange={(e) => updateBlock(block.id, `${e.target.value}|${block.content.split('|')[1] || ''}`)}
                      placeholder="Banner Image URL"
                      className="flex-1 border-b border-gray-200 pb-2 outline-none"
                    />
                    <input
                      type="url"
                      value={block.content.split('|')[1] || ''}
                      onChange={(e) => updateBlock(block.id, `${block.content.split('|')[0] || ''}|${e.target.value}`)}
                      placeholder="Banner URL"
                      className="flex-1 border-b border-gray-200 pb-2 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-8 border-t border-gray-100 mt-8 flex-wrap">
          <button onClick={() => addBlock('p')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <Type className="w-4 h-4" /> Text
          </button>
          <button onClick={() => addBlock('h2')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <Type className="w-4 h-4 font-bold" /> Heading
          </button>
          <button onClick={() => addBlock('image')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <ImageIcon className="w-4 h-4" /> Image
          </button>
          <button onClick={() => addBlock('table')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <Table className="w-4 h-4" /> Table
          </button>
          <button onClick={() => addBlock('youtube')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <Youtube className="w-4 h-4" /> YouTube
          </button>
          <button onClick={() => addBlock('webview')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <Globe className="w-4 h-4" /> WebView
          </button>
          <button onClick={() => addBlock('cta')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <MousePointerClick className="w-4 h-4" /> CTA Button
          </button>
          <button onClick={() => addBlock('banner')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <LayoutTemplate className="w-4 h-4" /> Banner
          </button>
        </div>
      </div>
    </div>
  );
}
