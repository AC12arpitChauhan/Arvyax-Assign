import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API_BASE_URL;

interface Session {
  _id: string;
  title: string;
  tags: string[];
  jsonUrl: string;
  status: string;
}

const MySessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMySessions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API}/my-sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSessions(res.data.data);
      } catch (err) {
        console.error('Error fetching my sessions:', err);
      }
    };

    fetchMySessions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            My Wellness Sessions
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Manage and track your personal wellness journey with beautifully organized sessions
          </p>
        </div>

        {/* Create New Session Button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                const res = await axios.post(
                  `${API}/my-sessions/save-draft`,
                  { title: '', tags: [], jsonUrl: '' },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const newId = res.data.data._id;
                navigate(`/editor?id=${newId}`);
              } catch (err) {
                console.error('Failed to create draft:', err);
              }
            }}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">+</span>
            </div>
            Create New Session
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No sessions yet</h3>
            <p className="text-slate-500">Create your first wellness session to get started</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      session.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700'
                        : session.status === 'draft'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        session.status === 'published'
                          ? 'bg-emerald-400'
                          : session.status === 'draft'
                          ? 'bg-amber-400'
                          : 'bg-slate-400'
                      }`}
                    ></div>
                    {session.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {session.title || 'Untitled Session'}
                </h3>

                {/* Tags */}
                <div className="mb-6">
                  {session.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {session.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {session.tags.length > 3 && (
                        <span className="inline-block bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full font-medium">
                          +{session.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm italic">No tags</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/editor?id=${session._id}`)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <a
                    href={session.jsonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-xl transition-all duration-200 group/link"
                  >
                    <svg className="w-5 h-5 transform group-hover/link:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySessions;