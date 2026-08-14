import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Loader2, Check } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Avatar Preset Options
const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1',
];

const ProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing data when modal opens
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setSelectedAvatar(user.avatar || AVATAR_OPTIONS[0]);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const userId = user?.id || user?._id;

      const updatePayload = {
        fullName,
        email,
        avatar: selectedAvatar,
      };

      if (password.trim() !== '') {
        updatePayload.password = password;
      }

      // API Call to Update Intern Profile
      await axios.put(`${API_BASE_URL}/api/v1/interns/${userId}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update LocalStorage Data
      const updatedUser = { 
        ...user, 
        fullName, 
        email, 
        avatar: selectedAvatar 
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (onUpdate) {
        onUpdate(updatedUser);
      }

      alert('Profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative border border-slate-100">
        <button 
          onClick={onClose} 
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full transition"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">Edit Profile</h2>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Avatar Selector */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-3">
              <img 
                src={selectedAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`} 
                alt="Profile Preview" 
                className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-500/20 object-cover shadow-md"
              />
            </div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Choose Avatar Profile Picture</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {AVATAR_OPTIONS.map((avatarUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(avatarUrl)}
                  className={`w-9 h-9 rounded-full border-2 overflow-hidden transition relative ${
                    selectedAvatar === avatarUrl ? 'border-blue-600 ring-2 ring-blue-400 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={avatarUrl} alt="Avatar option" className="w-full h-full bg-slate-100" />
                  {selectedAvatar === avatarUrl && (
                    <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center text-white">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Optional)</label>
            <input 
              type="password" 
              placeholder="Leave blank to keep current password"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition text-sm" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;