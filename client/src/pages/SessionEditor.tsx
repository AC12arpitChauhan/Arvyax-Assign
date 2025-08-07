import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const API = import.meta.env.VITE_API_BASE_URL;

const SessionEditor: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(location.search).get('id');

  const [title, setTitle] = useState('');
  const [sessionStatus, setSessionStatus] = useState('draft');
  const [tags, setTags] = useState('');
  const [jsonUrl, setJsonUrl] = useState('');
  const [autoSaveTimer, setAutoSaveTimer] = useState<number | null>(null);

  const fetchSession = async () => {
    try {
      if (!sessionId) return;
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/my-sessions/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const session = res.data.data;
      setTitle(session.title);
      setTags(session.tags.join(', '));
      setJsonUrl(session.jsonUrl);
      setSessionStatus(session.status);
    } catch (err) {
      console.error('Error fetching session:', err);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const handleAutoSave = useCallback(() => {
    const saveDraft = async () => {
      try {
        const token = localStorage.getItem('token');
        const payload: any = {
          title,
          tags: tags.split(',').map(tag => tag.trim()),
          jsonUrl,
        };
        if (sessionId) payload.id = sessionId;

        await axios.post(`${API}/my-sessions/save-draft`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Auto-saved draft.');
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    };

    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const timer = setTimeout(saveDraft, 5000);
    setAutoSaveTimer(timer);
  }, [title, tags, jsonUrl, sessionId]);

  useEffect(() => {
    handleAutoSave();
  }, [title, tags, jsonUrl]);

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const draftPayload = {
        id: sessionId,
        title,
        tags: tags.split(',').map(tag => tag.trim()),
        jsonUrl: jsonUrl || '<placeholder>',
      };

      await axios.post(`${API}/my-sessions/save-draft`, draftPayload, { headers });

      const response = await axios.post(`{API}/my-sessions/publish`, { id: sessionId }, { headers });

      setSessionStatus('published');
      console.log('Published successfully:', response.data.message);
      
      // Show success toast
      toast.success('🎉 Session published successfully!', {
        duration: 4000,
        style: {
          background: '#10b981',
          color: '#ffffff',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '16px 20px',
        },
        iconTheme: {
          primary: '#ffffff',
          secondary: '#10b981',
        },
      });
      
      // Navigate after showing toast
      setTimeout(() => {
        navigate('/my-sessions');
      }, 1000);
    } catch (err) {
      console.error('Publish failed:', err);
      
      // Show error toast
      toast.error('❌ Failed to publish session. Please try again.', {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#ffffff',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '16px 20px',
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {sessionId ? 'Edit Session' : 'Create Session'}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">Auto-saving enabled</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                sessionStatus === 'published'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  sessionStatus === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              ></div>
              Status: {sessionStatus}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mb-8">
          <div className="space-y-8">
            {/* Title Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Session Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter a compelling title for your wellness session"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Tags
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="meditation, mindfulness, relaxation (comma-separated)"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Use commas to separate multiple tags</p>
            </div>

            {/* JSON URL Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                JSON Data URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://example.com/session-data.json"
                  value={jsonUrl}
                  onChange={e => setJsonUrl(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Link to your session configuration data</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/my-sessions')}
            className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all duration-200 hover:shadow-lg"
          >
            ← Back to Sessions
          </button>
          <button
            onClick={handlePublish}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              Publish Session
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* Preview Section */}
        {title && (
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Preview</h3>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-bold text-slate-800">{title}</h4>
              {tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionEditor;