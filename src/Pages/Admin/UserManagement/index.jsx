import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import './index.css';

const UserManagement = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/admin/users');
            setUsersData(response || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Fallback to static data if API fails
            setUsersData(getStaticUsersData());
        } finally {
            setLoading(false);
        }
    };

    const getStaticUsersData = () => [
        {
            id: 1,
            name: 'John_doe',
            email: 'john@example.com',
            walletAddress: '0x742d35...E89a1f',
            status: 'Active',
            registered: '2024-05-10',
            gamesPlayed: 152,
            winRatio: 67
        },
        {
            id: 2,
            name: 'Jane_smith',
            email: 'jane@example.com',
            walletAddress: '0x5a2b50...D81c2a',
            status: 'Pending',
            registered: '2024-04-22',
            gamesPlayed: 87,
            winRatio: 45
        },
        {
            id: 3,
            name: 'Michael_brown',
            email: 'michael@example.com',
            walletAddress: '0xb14d62...C55d4e',
            status: 'Active',
            registered: '2024-06-15',
            gamesPlayed: 235,
            winRatio: 80
        },
        {
            id: 4,
            name: 'Emily_jones',
            email: 'emily@example.com',
            walletAddress: '0xd53d72...F92c8b',
            status: 'Block',
            registered: '2024-07-01',
            gamesPlayed: 50,
            winRatio: 30
        }
    ];


    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === usersData.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(usersData.map(user => user.id));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return '#10B981';
            case 'Pending':
                return '#3B82F6';
            case 'Block':
                return '#EF4444';
            default:
                return '#9CA3AF';
        }
    };

    // Filter users based on search and status
    const filteredUsers = usersData.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="user-management">
                <div className="user-management-content">
                    <div className="user-management-header">
                        <h1 className="user-management-title">User Management</h1>
                        <p className="user-management-subtitle">Loading user data...</p>
                    </div>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading users...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-management">
            <div className="user-management-content">
                {/* Header Section */}
                <div className="user-management-header">
                    <h1 className="user-management-title">User Management</h1>
                    <p className="user-management-subtitle">Manage registered users and their platform access.</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="user-search-filter-bar">
                    <div className="user-search-container">
                        <div className="user-search-input-wrapper">
                            <svg className="user-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="M21 21l-4.35-4.35"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by username, email, or wallet address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="user-search-input"
                            />
                        </div>
                    </div>
                    
                    <div className="user-filter-dropdown">
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="user-status-select"
                        >
                            <option value="All Status">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Block">Block</option>
                        </select>
                        <svg className="user-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6,9 12,15 18,9"/>
                        </svg>
                    </div>
                    
                    <button className="user-more-filters-btn">
                        <svg className="user-filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
                        </svg>
                        More Filters
                    </button>
                </div>

                {/* Users Table Section */}
                <div className="user-table-section">
                    <div className="user-table-header">
                        <h2 className="user-table-title">Users ({usersData.length})</h2>
                        <p className="user-table-subtitle">All registered platform users</p>
                    </div>
                    
                    <div className="user-table-container">
                        <div className="user-table">
                            {/* Table Header */}
                            <div className="user-table-header-row">
                                <div className="user-table-cell user-checkbox-cell">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === usersData.length}
                                        onChange={handleSelectAll}
                                        className="user-checkbox"
                                    />
                                </div>
                                <div className="user-table-cell user-header-cell">User</div>
                                <div className="user-table-cell user-header-cell">Wallet Address</div>
                                <div className="user-table-cell user-header-cell">Status</div>
                                <div className="user-table-cell user-header-cell">Registerd</div>
                                <div className="user-table-cell user-header-cell">Game Played</div>
                                <div className="user-table-cell user-header-cell">Win Ratio</div>
                                <div className="user-table-cell user-header-cell">Action</div>
                            </div>

                            {/* Table Rows */}
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="user-table-row">
                                    <div className="user-table-cell user-checkbox-cell">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                            className="user-checkbox"
                                        />
                                    </div>
                                    <div className="user-table-cell user-info-cell">
                                        <div className="user-name">{user.name}</div>
                                        <div className="user-email">{user.email}</div>
                                    </div>
                                    <div className="user-table-cell user-wallet-cell">
                                        {user.walletAddress}
                                    </div>
                                    <div className="user-table-cell user-status-cell">
                                        <span 
                                            className="user-status-badge"
                                            style={{ backgroundColor: getStatusColor(user.status) }}
                                        >
                                            {user.status}
                                        </span>
                                    </div>
                                    <div className="user-table-cell user-date-cell">
                                        {user.registered}
                                    </div>
                                    <div className="user-table-cell user-games-cell">
                                        {user.gamesPlayed}
                                    </div>
                                    <div className="user-table-cell user-ratio-cell">
                                        <div className="user-ratio-container">
                                            <div className="user-ratio-bar">
                                                <div 
                                                    className="user-ratio-fill"
                                                    style={{ width: `${user.winRatio}%` }}
                                                ></div>
                                            </div>
                                            <span className="user-ratio-text">{user.winRatio}%</span>
                                        </div>
                                    </div>
                                    <div className="user-table-cell user-action-cell">
                                        <button className="user-action-btn">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="1"/>
                                                <circle cx="12" cy="5" r="1"/>
                                                <circle cx="12" cy="19" r="1"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
