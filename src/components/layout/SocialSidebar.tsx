import React from 'react';
import { Mail, Facebook, Twitter, Linkedin, MessageCircle, Send } from 'lucide-react';

interface SocialSidebarProps {
  title: string;
  url: string;
}

export function SocialSidebar({ title, url }: SocialSidebarProps) {
  return (
    <div className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col gap-4 z-50">
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"><Mail className="w-5 h-5" /></a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors"><Facebook className="w-5 h-5" /></a>
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"><Twitter className="w-5 h-5" /></a>
      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"><Linkedin className="w-5 h-5" /></a>
      <a href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"><MessageCircle className="w-5 h-5" /></a>
      <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"><Send className="w-5 h-5" /></a>
    </div>
  );
}
