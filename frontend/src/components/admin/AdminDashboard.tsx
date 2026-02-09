import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    LogOut,
    Activity,
    BarChart3,
    Search
} from 'lucide-react';
import VoterRegistration from './VoterRegistration';
import { api } from '../../services/api';

interface AdminDashboardProps {
    onLogout: () => void;
}

type AdminView = 'stats' | 'register' | 'voters' | 'results';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [currentView, setCurrentView] = useState<AdminView>('stats');
    const [stats, setStats] = useState({
        total_voters: 0,
        voters_voted: 0,
        registration_complete: false
    });

    const username = localStorage.getItem('admin_username') || 'Admin';

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await api.admin.getStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_username');
        onLogout();
    };

    const renderContent = () => {
        switch (currentView) {
            case 'register':
                return <VoterRegistration onCancel={() => setCurrentView('stats')} />;
            case 'stats':
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium">Total Voters</h3>
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">{stats.total_voters}</p>
                            <p className="text-green-500 text-sm mt-2 flex items-center">
                                <Activity className="w-3 h-3 mr-1" />
                                Updated just now
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium">Votes Cast</h3>
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">{stats.voters_voted}</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Turnout: {stats.total_voters ? Math.round((stats.voters_voted / stats.total_voters) * 100) : 0}%
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setCurrentView('register')}
                        >
                            <div className="p-4 bg-purple-50 rounded-full mb-3">
                                <UserPlus className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800">Register New Voter</h3>
                            <p className="text-sm text-gray-500 mt-1">Add voter details & photos</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center">
                        <Users className="w-6 h-6 mr-2 text-blue-600" />
                        Admin Panel
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <button
                        onClick={() => setCurrentView('stats')}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === 'stats'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Activity className="w-5 h-5 mr-3" />
                        Dashboard
                    </button>

                    <button
                        onClick={() => setCurrentView('register')}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === 'register'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <UserPlus className="w-5 h-5 mr-3" />
                        Register Voter
                    </button>

                    <button
                        onClick={() => setCurrentView('voters')}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === 'voters'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Search className="w-5 h-5 mr-3" />
                        Manage Voters
                    </button>

                    <button
                        onClick={() => setCurrentView('results')}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === 'results'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <BarChart3 className="w-5 h-5 mr-3" />
                        Results
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center mb-4 px-4">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                            {username[0]}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{username}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex items-center justify-between mb-8 md:hidden">
                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                    <button onClick={handleLogout} className="p-2 text-gray-600">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
