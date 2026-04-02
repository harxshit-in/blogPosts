import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PenSquare, LogOut, User as UserIcon, LayoutDashboard, Shield } from 'lucide-react';

export function Navbar() {
  const { user, profile, logout, setShowAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleWriteClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (profile?.role === 'reader' && !profile?.isVerified) {
      navigate('/dashboard'); // Dashboard will show "become a writer" prompt
      return;
    }
    navigate('/editor');
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://i.ibb.co/mC6n2hV7/favicon.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tight">Blog.BattleArenaSSC</span>
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleWriteClick}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium px-3 py-2 rounded-md hover:bg-gray-50"
            >
              <PenSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Write</span>
            </button>

            {user ? (
              <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-200">
                <div className="group relative">
                  <button className="flex items-center gap-2 focus:outline-none">
                    {profile?.profileImage ? (
                      <img 
                        src={profile.profileImage} 
                        alt={profile.name} 
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                        <UserIcon className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{profile?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                    </div>
                    
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    
                    {(profile?.role === 'admin' || user?.uid === 'xWpu2sdoN8SbBWtRTIBMUOOY0Ud2') && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
                >
                  Sign in
                </button>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 transition-colors"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
