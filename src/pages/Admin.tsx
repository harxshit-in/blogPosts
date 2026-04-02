import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, query, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';
import { Check, X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Admin() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRec, setNewRec] = useState({ title: '', url: '', imageUrl: '' });
  const [newBanner, setNewBanner] = useState({ title: '', linkUrl: '', imageUrl: '' });

  useEffect(() => {
    if (!authLoading && (!user || (profile?.role !== 'admin' && user.uid !== 'xWpu2sdoN8SbBWtRTIBMUOOY0Ud2'))) {
      navigate('/');
      return;
    }
    if (user) fetchData();
  }, [user, profile, authLoading, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(query(collection(db, 'users')));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const recsSnap = await getDocs(query(collection(db, 'recommendations')));
      setRecommendations(recsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const bannersSnap = await getDocs(query(collection(db, 'banners')));
      setBanners(bannersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = async () => {
    if (!newBanner.title || !newBanner.imageUrl) return;
    try {
      await addDoc(collection(db, 'banners'), newBanner);
      toast.success("Banner added");
      setNewBanner({ title: '', linkUrl: '', imageUrl: '' });
      fetchData();
    } catch (error) {
      toast.error("Failed to add banner");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'banners', id));
      toast.success("Banner deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const handleAddRecommendation = async () => {
    if (!newRec.title || !newRec.url) return;
    try {
      await addDoc(collection(db, 'recommendations'), newRec);
      toast.success("Recommendation added");
      setNewRec({ title: '', url: '', imageUrl: '' });
      fetchData();
    } catch (error) {
      toast.error("Failed to add recommendation");
    }
  };

  const handleDeleteRecommendation = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recommendations', id));
      toast.success("Recommendation deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete recommendation");
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'writer',
        isVerified: true,
        writerRequestPending: false
      });
      toast.success("User approved as writer");
      fetchData();
    } catch (error) {
      toast.error("Failed to approve user");
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        writerRequestPending: false
      });
      toast.success("Request rejected");
      fetchData();
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  const pendingRequests = users.filter(u => u.writerRequestPending);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <Helmet>
        <title>Admin Panel - BlogSpace</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Manage Recommendations</h2>
        </div>
        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <input placeholder="Title" value={newRec.title} onChange={e => setNewRec({...newRec, title: e.target.value})} className="border p-2 rounded flex-1" />
            <input placeholder="URL" value={newRec.url} onChange={e => setNewRec({...newRec, url: e.target.value})} className="border p-2 rounded flex-1" />
            <input placeholder="Image URL" value={newRec.imageUrl} onChange={e => setNewRec({...newRec, imageUrl: e.target.value})} className="border p-2 rounded flex-1" />
            <button onClick={handleAddRecommendation} className="bg-black text-white p-2 rounded"><Plus /></button>
          </div>
          <div className="space-y-2">
            {recommendations.map(rec => (
              <div key={rec.id} className="flex justify-between items-center p-2 border rounded">
                <span>{rec.title}</span>
                <button onClick={() => handleDeleteRecommendation(rec.id)} className="text-red-500"><Trash2 /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banners Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Manage Banners</h2>
        </div>
        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <input placeholder="Title" value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} className="border p-2 rounded flex-1" />
            <input placeholder="Link URL" value={newBanner.linkUrl} onChange={e => setNewBanner({...newBanner, linkUrl: e.target.value})} className="border p-2 rounded flex-1" />
            <input placeholder="Image URL" value={newBanner.imageUrl} onChange={e => setNewBanner({...newBanner, imageUrl: e.target.value})} className="border p-2 rounded flex-1" />
            <button onClick={handleAddBanner} className="bg-black text-white p-2 rounded"><Plus /></button>
          </div>
          <div className="space-y-2">
            {banners.map(banner => (
              <div key={banner.id} className="flex justify-between items-center p-2 border rounded">
                <span>{banner.title}</span>
                <button onClick={() => handleDeleteBanner(banner.id)} className="text-red-500"><Trash2 /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Pending Writer Requests</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : pendingRequests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {pendingRequests.map(user => (
              <div key={user.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleReject(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Reject"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleApprove(user.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Approve"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No pending requests.
          </div>
        )}
      </div>
    </div>
  );
}
