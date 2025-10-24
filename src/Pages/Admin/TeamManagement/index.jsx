import React, { useState } from 'react';
import './index.css';

const TeamManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [selectedMembers, setSelectedMembers] = useState([]);

    const teamMembers = [
        {
            id: 1,
            name: 'Alex Johnson',
            email: 'alex.johnson@company.com',
            initials: 'AJ',
            role: 'Team Lead',
            roleColor: '#8B5CF6',
            department: 'Engineering',
            status: 'Active',
            statusColor: '#10B981',
            performance: 95,
            projects: 5,
            joined: '2023-01-15'
        },
        {
            id: 2,
            name: 'Sarah Martinez',
            email: 'sarah.martinez@company.com',
            initials: 'SM',
            role: 'Senior Developer',
            roleColor: '#3B82F6',
            department: 'Engineering',
            status: 'Active',
            statusColor: '#10B981',
            performance: 93,
            projects: 4,
            joined: '2023-03-20'
        },
        {
            id: 3,
            name: 'Michael Chen',
            email: 'michael.chen@company.com',
            initials: 'MC',
            role: 'UI/UX Designer',
            roleColor: '#EC4899',
            department: 'Design',
            status: 'Active',
            statusColor: '#10B981',
            performance: 91,
            projects: 6,
            joined: '2023-02-10'
        },
        {
            id: 4,
            name: 'Emily Davis',
            email: 'emily.davis@company.com',
            initials: 'ED',
            role: 'Product Manager',
            roleColor: '#F59E0B',
            department: 'Product',
            status: 'On Leave',
            statusColor: '#3B82F6',
            performance: 89,
            projects: 3,
            joined: '2023-04-05'
        },
        {
            id: 5,
            name: 'David Kim',
            email: 'david.kim@company.com',
            initials: 'DK',
            role: 'DevOps Engineer',
            roleColor: '#10B981',
            department: 'Engineering',
            status: 'Active',
            statusColor: '#10B981',
            performance: 96,
            projects: 7,
            joined: '2023-05-12'
        },
        {
            id: 6,
            name: 'Jessica Wilson',
            email: 'jessica.wilson@company.com',
            initials: 'JW',
            role: 'QA Engineer',
            roleColor: '#EAB308',
            department: 'Quality Assurance',
            status: 'Active',
            statusColor: '#10B981',
            performance: 95,
            projects: 8,
            joined: '2023-06-18'
        },
        {
            id: 7,
            name: 'Ryan Thompson',
            email: 'ryan.thompson@company.com',
            initials: 'RT',
            role: 'Junior Developer',
            roleColor: '#06B6D4',
            department: 'Engineering',
            status: 'Active',
            statusColor: '#10B981',
            performance: 74,
            projects: 2,
            joined: '2024-01-10'
        },
        {
            id: 8,
            name: 'Lisa Anderson',
            email: 'lisa.anderson@company.com',
            initials: 'LA',
            role: 'Data Analyst',
            roleColor: '#EF4444',
            department: 'Analytics',
            status: 'Inactive',
            statusColor: '#EF4444',
            performance: 95,
            projects: 0,
            joined: '2023-07-22'
        }
    ];

    const handleSelectMember = (memberId) => {
        setSelectedMembers(prev => 
            prev.includes(memberId) 
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleSelectAll = () => {
        setSelectedMembers(
            selectedMembers.length === teamMembers.length 
                ? [] 
                : teamMembers.map(member => member.id)
        );
    };

    const statsData = [
        {
            title: 'Total Members',
            value: '8',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1.99-1.51A2.5 2.5 0 0 0 10 8H8.46c-.8 0-1.54.37-2.01.99L4 10.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 12.46 8H14c.8 0 1.54.37 2.01.99L18 10.5V22h2z"/>
                </svg>
            ),
            color: '#FFBA08'
        },
        {
            title: 'Active',
            value: '6',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            ),
            color: '#FFBA08'
        },
        {
            title: 'On Leave',
            value: '1',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                </svg>
            ),
            color: '#FFBA08'
        },
        {
            title: 'Inactive',
            value: '1',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1.99-1.51A2.5 2.5 0 0 0 10 8H8.46c-.8 0-1.54.37-2.01.99L4 10.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 12.46 8H14c.8 0 1.54.37 2.01.99L18 10.5V22h2z"/>
                </svg>
            ),
            color: '#EF4444'
        },
        {
            title: 'Avg Performance',
            value: '91%',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            ),
            color: '#FFBA08'
        }
    ];

    return (
        <div className="team-management">
            <div className="team-management-content">
                {/* Header */}
                <div className="team-header">
                    <div className="team-header-left">
                        <h1 className="team-title">Team Management</h1>
                        <p className="team-subtitle">Manage your team members, roles, and permissions.</p>
                    </div>
                    <button className="team-add-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="8.5" cy="7" r="4"/>
                            <line x1="20" y1="8" x2="20" y2="14"/>
                            <line x1="17" y1="11" x2="23" y2="11"/>
                        </svg>
                        Add Team Member
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="team-stats-grid">
                    {statsData.map((stat, index) => (
                        <div key={index} className="team-stat-card">
                            <div className="team-stat-icon" style={{ color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="team-stat-content">
                                <div className="team-stat-title">{stat.title}</div>
                                <div className="team-stat-value" style={{ color: stat.color }}>{stat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search and Filter Bar */}
                <div className="team-search-filter-bar">
                    <div className="team-search-container">
                        <div className="team-search-input-wrapper">
                            <svg className="team-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.35-4.35"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name, email, or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="team-search-input"
                            />
                        </div>
                    </div>

                    <div className="team-filters-container">
                        <select 
                            value={roleFilter} 
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="team-filter-select"
                        >
                            <option value="All Roles">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Developer">Developer</option>
                            <option value="Designer">Designer</option>
                        </select>

                        <select 
                            value={departmentFilter} 
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="team-filter-select"
                        >
                            <option value="All Departments">All Departments</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                        </select>

                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="team-filter-select"
                        >
                            <option value="All Status">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="On Leave">On Leave</option>
                        </select>

                        <button className="team-more-filters-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
                            </svg>
                            More Filters
                        </button>
                    </div>
                </div>

                {/* Team Members Table */}
                <div className="team-members-section">
                    <div className="team-members-header">
                        <div className="team-members-title">Team Members (8)</div>
                        <div className="team-members-count">All team members across departments</div>
                    </div>

                    <div className="team-members-table">
                        {/* Table Header */}
                        <div className="team-table-header">
                            <div className="team-table-cell checkbox-cell">
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.length === teamMembers.length}
                                    onChange={handleSelectAll}
                                    className="team-checkbox"
                                />
                            </div>
                            <div className="team-table-cell member-cell">Member</div>
                            <div className="team-table-cell role-cell">Role</div>
                            <div className="team-table-cell department-cell">Department</div>
                            <div className="team-table-cell status-cell">Status</div>
                            <div className="team-table-cell performance-cell">Performance</div>
                            <div className="team-table-cell projects-cell">Projects</div>
                            <div className="team-table-cell joined-cell">Joined</div>
                            <div className="team-table-cell actions-cell">Actions</div>
                        </div>

                        {/* Table Rows */}
                        {teamMembers.map((member) => (
                            <div key={member.id} className="team-table-row">
                                <div className="team-table-cell checkbox-cell">
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.includes(member.id)}
                                        onChange={() => handleSelectMember(member.id)}
                                        className="team-checkbox"
                                    />
                                </div>
                                <div className="team-table-cell member-cell">
                                    <div className="member-info">
                                        <div className="member-avatar">
                                            {member.initials}
                                        </div>
                                        <div className="member-details">
                                            <div className="member-name">{member.name}</div>
                                            <div className="member-email">{member.email}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="team-table-cell role-cell">
                                    <span 
                                        className="role-badge" 
                                        style={{ color: member.roleColor }}
                                    >
                                        {member.role}
                                    </span>
                                </div>
                                <div className="team-table-cell department-cell">
                                    {member.department}
                                </div>
                                <div className="team-table-cell status-cell">
                                    <span 
                                        className="status-badge" 
                                        style={{ backgroundColor: member.statusColor }}
                                    >
                                        {member.status}
                                    </span>
                                </div>
                                <div className="team-table-cell performance-cell">
                                    <div className="performance-bar">
                                        <div 
                                            className="performance-fill" 
                                            style={{ width: `${member.performance}%` }}
                                        ></div>
                                    </div>
                                    <span className="performance-text">{member.performance}%</span>
                                </div>
                                <div className="team-table-cell projects-cell">
                                    {member.projects}
                                </div>
                                <div className="team-table-cell joined-cell">
                                    {member.joined}
                                </div>
                                <div className="team-table-cell actions-cell">
                                    <button className="team-actions-btn">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
    );
};

export default TeamManagement;
