import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';
import { Shield, PenSquare, Clock, CheckCircle } from 'lucide-react';

export function Dashboard() {
  const { profile } = useAuth();
  const [requesting, setRequesting] = useState(false);

  const handleRequestWriter = async () => {
    if (!profile) return;
    setRequesting(true);
    try {
      // In a real app, you might have a separate "requests" collection.
      // Here we just update a flag on the user profile that admin can see.
      await updateDoc(doc(db, 'users', profile.uid), {
        writerRequestPending: true
      });
      toast.success('Request sent! An admin will review it shortly.');
    } catch (error: any) {
      toast.error('Failed to send request: ' + error.message);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <Helmet>
        <title>Dashboard - BlogSpace</title>
      </Helmet>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-4 mb-6">
            {profile?.profileImage ? (
              <img src={profile.profileImage} alt={profile.name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-2xl font-bold text-gray-500">
                {profile?.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
              <p className="text-gray-500">{profile?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium capitalize flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Role: {profile?.role}
            </span>
            {profile?.isVerified && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Verified Writer
              </span>
            )}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Account Status</h2>
          
          {profile?.role === 'admin' && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Administrator Account</h3>
              <p className="text-blue-700 text-sm mb-4">You have full access to manage users and content.</p>
              <a href="/admin" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Go to Admin Panel
              </a>
            </div>
          )}

          {profile?.role === 'writer' && profile?.isVerified && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-6">
              <h3 className="font-semibold text-green-900 mb-2">You are a Verified Writer</h3>
              <p className="text-green-700 text-sm mb-4">You can create, edit, and publish articles on BlogSpace.</p>
              <a href="/editor" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                <PenSquare className="w-4 h-4" />
                Write a new article
              </a>
            </div>
          )}

          {profile?.role === 'reader' && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
              <h3 className="font-semibold text-amber-900 mb-2">Want to write on BlogSpace?</h3>
              <p className="text-amber-700 text-sm mb-4">
                Currently, you have a reader account. Apply to become a writer to share your stories with our community.
              </p>
              
              {/* @ts-ignore - custom property for demo */}
              {profile?.writerRequestPending ? (
                <div className="inline-flex items-center gap-2 bg-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Request Pending Review
                </div>
              ) : (
                <button 
                  onClick={handleRequestWriter}
                  disabled={requesting}
                  className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-70"
                >
                  <PenSquare className="w-4 h-4" />
                  {requesting ? 'Sending Request...' : 'Apply to be a Writer'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
