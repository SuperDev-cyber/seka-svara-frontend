import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    ArcElement,
    Tooltip,
    Legend,
    LineController,
    DoughnutController,
    BarController,
    BarElement,
} from 'chart.js';
import './index.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    ArcElement,
    Tooltip,
    Legend,
    LineController,
    DoughnutController,
    BarController,
    BarElement
);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const areaChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);
    const areaChartInstance = useRef(null);
    const pieChartInstance = useRef(null);
    const barChartInstance = useRef(null);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Add cache-busting timestamp
            const timestamp = new Date().getTime();
            const response = await apiService.get(`/admin/dashboard-stats?_t=${timestamp}`);
            console.log('✅ Dashboard data loaded:', response);
            setDashboardData(response);
        } catch (error) {
            console.error('❌ Error fetching dashboard data:', error);
            if (window.showToast) {
                window.showToast('Error loading dashboard data', 'error', 3000);
            }
            // Fallback to static data if API fails
            setDashboardData(getStaticDashboardData());
        } finally {
            setLoading(false);
        }
    };

    const getStaticDashboardData = () => ({
        totalUsers: 47050,
        totalTransactions: 89324,
        totalCommission: 45892,
        activeTables: 158,
        revenueData: [12000, 19000, 3000, 5000, 2000, 3000, 45000, 12000, 19000, 3000, 5000, 2000],
        userGrowthData: [100, 120, 150, 180, 200, 250, 300, 350, 400, 450, 500, 600],
        transactionTypes: [
            { type: 'Deposits', count: 45, percentage: 45 },
            { type: 'Withdrawals', count: 30, percentage: 30 },
            { type: 'Games', count: 25, percentage: 25 }
        ]
    });

    const statsData = dashboardData ? [
        {
            id: 'total-users',
            title: 'Total User',
            value: dashboardData.totalUsers?.toLocaleString() || '0',
            change: '+12%',
            changeType: 'positive',
            description: 'Active registered users',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
            )
        },
        {
            id: 'total-transactions',
            title: 'Total Transactions',
            value: dashboardData.totalTransactions?.toLocaleString() || '0',
            change: '+8%',
            changeType: 'positive',
            description: 'All-time transactions',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z"/>
                </svg>
            )
        },
        {
            id: 'total-commission',
            title: 'Total Commission',
            value: `$${dashboardData.totalCommission?.toLocaleString() || '0'}`,
            change: '+23%',
            changeType: 'positive',
            description: 'Commission earned',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <rect x="7" y="7" width="3" height="9"/>
                    <rect x="14" y="7" width="3" height="5"/>
                    <rect x="10.5" y="7" width="3" height="7"/>
                </svg>
            )
        },
        {
            id: 'active-tables',
            title: 'Active Tables',
            value: dashboardData.activeTables?.toString() || '0',
            change: '-5%',
            changeType: 'negative',
            description: 'Ongoing games',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
            )
        }
    ] : [];

    // Chart data and configuration
    const areaChartData = {
        labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'],
        datasets: [
            {
                label: 'Transaction Volume',
                data: [1800, 4200, 3800, 6800, 4800, 7200, 7800],
                borderColor: '#FF8C00',
                backgroundColor: 'rgba(255, 140, 0, 0.4)',
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#FF8C00',
                pointHoverBorderColor: '#FF8C00',
                pointHoverBorderWidth: 2,
            }
        ]
    };

    const areaChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1A1D29',
                titleColor: '#FFFFFF',
                bodyColor: '#9CA3AF',
                borderColor: '#2A2F3F',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: {
                    color: '#2A2F3F',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9CA3AF',
                    font: {
                        size: 10
                    }
                }
            },
            y: {
                grid: {
                    color: '#2A2F3F',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9CA3AF',
                    font: {
                        size: 10
                    },
                    callback: function(value) {
                        return value === 0 ? '0' : value.toLocaleString();
                    }
                },
                min: 0,
                max: 8000,
                stepSize: 2000
            }
        }
    };

    const pieChartData = {
        labels: ['BEP20', 'TRC20'],
        datasets: [
            {
                data: [65, 35],
                backgroundColor: ['#10B981', '#3B82F6'],
                borderColor: '#0F1419',
                borderWidth: 2,
                hoverOffset: 4
            }
        ]
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'rect',
                    padding: 20,
                    font: {
                        size: 12
                    },
                    color: '#FFFFFF',
                    generateLabels: function(chart) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                                const dataset = data.datasets[0];
                                const value = dataset.data[i];
                                return {
                                    text: `${label} ${value}%`,
                                    fillStyle: dataset.backgroundColor[i],
                                    strokeStyle: dataset.backgroundColor[i],
                                    lineWidth: 0,
                                    pointStyle: 'rect',
                                    hidden: false,
                                    index: i
                                };
                            });
                        }
                        return [];
                    }
                }
            },
            tooltip: {
                backgroundColor: '#1A1D29',
                titleColor: '#FFFFFF',
                bodyColor: '#9CA3AF',
                borderColor: '#2A2F3F',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.parsed + '%';
                    }
                }
            }
        }
    };

    // Bar chart data and configuration
    const barChartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Commission Earnings',
                data: [2000, 8500, 6000, 11000],
                backgroundColor: '#FF8C00',
                borderColor: '#FF8C00',
                borderWidth: 0,
                borderRadius: 0,
                borderSkipped: false,
            }
        ]
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1A1D29',
                titleColor: '#FFFFFF',
                bodyColor: '#9CA3AF',
                borderColor: '#2A2F3F',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#9CA3AF',
                    font: {
                        size: 10
                    }
                }
            },
            y: {
                grid: {
                    color: '#2A2F3F',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9CA3AF',
                    font: {
                        size: 10
                    },
                    stepSize: 3000,
                    callback: function(value) {
                        return value.toLocaleString();
                    }
                },
                min: 0,
                max: 12000
            }
        }
    };

    // Get dynamic data from API or fallback to empty arrays
    const transactionsData = dashboardData?.latestTransactions || [];
    const usersData = dashboardData?.latestUsers || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Success':
            case 'Active':
                return '#22C55E';
            case 'Pending':
                return '#3B82F6';
            case 'Failed':
            case 'Blocked':
                return '#EF4444';
            default:
                return '#9CA3AF';
        }
    };

    // System status data
    const systemStatUSDTata = [
        {
            id: 1,
            name: 'Binance Smart Chain',
            status: 'Online',
            statusColor: '#22C55E'
        },
        {
            id: 2,
            name: 'Tron Network',
            status: 'Online',
            statusColor: '#22C55E'
        },
        {
            id: 3,
            name: 'System Load',
            status: 'Moderate',
            statusColor: '#F59E0B'
        }
    ];

    useEffect(() => {
        // Destroy existing charts if they exist
        if (areaChartInstance.current) {
            areaChartInstance.current.destroy();
            areaChartInstance.current = null;
        }
        if (pieChartInstance.current) {
            pieChartInstance.current.destroy();
            pieChartInstance.current = null;
        }
        if (barChartInstance.current) {
            barChartInstance.current.destroy();
            barChartInstance.current = null;
        }

        // Create area chart
        if (areaChartRef.current) {
            areaChartInstance.current = new ChartJS(areaChartRef.current, {
                type: 'line',
                data: areaChartData,
                options: areaChartOptions
            });
        }

        // Create pie chart
        if (pieChartRef.current) {
            pieChartInstance.current = new ChartJS(pieChartRef.current, {
                type: 'doughnut',
                data: pieChartData,
                options: pieChartOptions
            });
        }

        // Create bar chart
        if (barChartRef.current) {
            barChartInstance.current = new ChartJS(barChartRef.current, {
                type: 'bar',
                data: barChartData,
                options: barChartOptions
            });
        }

        // Cleanup function
        return () => {
            if (areaChartInstance.current) {
                areaChartInstance.current.destroy();
                areaChartInstance.current = null;
            }
            if (pieChartInstance.current) {
                pieChartInstance.current.destroy();
                pieChartInstance.current = null;
            }
            if (barChartInstance.current) {
                barChartInstance.current.destroy();
                barChartInstance.current = null;
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="admin-dashboard-content">
                    <div className="admin-welcome">
                        <h1 className="admin-welcome-title">Loading Dashboard...</h1>
                        <p className="admin-welcome-subtitle">Fetching platform statistics...</p>
                    </div>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading dashboard data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-content">
                {/* Welcome Section */}
                <div className="admin-welcome">
                    <h1 className="admin-welcome-title">
                        Welcome back! {user?.username || user?.email?.split('@')[0] || 'Admin'}
                    </h1>
                    <p className="admin-welcome-subtitle">Here's what's happening with your platform today.</p>
                </div>

                {/* Stats Cards */}
                <div className="admin-stats-grid">
                    {statsData.map((stat) => (
                        <div key={stat.id} className="admin-stat-card">
                            <div className="admin-stat-header">
                                <h3 className="admin-stat-title">{stat.title}</h3>
                                <div className="admin-stat-icon">
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="admin-stat-value">{stat.value}</div>
                            <div className="admin-stat-change">
                                <div className={`admin-change-indicator ${stat.changeType}`}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {stat.changeType === 'positive' ? (
                                            <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
                                        ) : (
                                            <polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/>
                                        )}
                                    </svg>
                                </div>
                                <span className={`admin-change-text ${stat.changeType}`}>
                                    {stat.change}
                                </span>
                                <span className="admin-change-period">vs last month</span>
                            </div>
                            <p className="admin-stat-description">{stat.description}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="admin-charts-grid">
                    <div className="admin-chart-card">
                        <div className="admin-chart-header">
                            <h3 className="admin-chart-title">Daily Transaction Volume</h3>
                            <p className="admin-chart-subtitle">Transaction volume over the last 7 days</p>
                        </div>
                        <div className="admin-chart-content">
                            <canvas ref={areaChartRef}></canvas>
                        </div>
                    </div>

                    <div className="admin-chart-card">
                        <div className="admin-chart-header">
                            <h3 className="admin-chart-title">Network Distribution</h3>
                            <p className="admin-chart-subtitle">Transaction distribution by network</p>
                        </div>
                        <div className="admin-chart-content">
                            <canvas ref={pieChartRef}></canvas>
                        </div>
                    </div>

                    <div className="admin-chart-card">
                        <div className="admin-chart-header">
                            <h3 className="admin-chart-title">Weekly Commission Earnings</h3>
                            <p className="admin-chart-subtitle">Commission earned per week this month</p>
                        </div>
                        <div className="admin-chart-content">
                            <canvas ref={barChartRef}></canvas>
                        </div>
                    </div>
                </div>

                {/* Data Tables Section */}
                <div className="admin-tables-grid">
                    <div className="admin-table-card">
                        <div className="admin-table-header">
                            <h3 className="admin-table-title">Latest Transactions</h3>
                            <p className="admin-table-subtitle">Recent platform transactions</p>
                        </div>
                        <div className="admin-table-content">
                            {transactionsData.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: '#9CA3AF'
                                }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>No Transactions Yet</div>
                                    <div style={{ fontSize: '14px' }}>Transactions will appear here when users make deposits</div>
                                </div>
                            ) : (
                                transactionsData.map((transaction) => (
                                    <div key={transaction.id} className="admin-table-row">
                                        <div className="admin-table-row-left">
                                            <div className="admin-table-row-top">
                                                <span className="admin-table-username">{transaction.userName}</span>
                                                <span className="admin-table-type">{transaction.type}</span>
                                            </div>
                                            <span className="admin-table-date">{transaction.date}</span>
                                        </div>
                                        <div className="admin-table-row-right">
                                            <span className="admin-table-amount">{transaction.amount}</span>
                                            <span className="admin-table-status" style={{ backgroundColor: getStatusColor(transaction.status) }}>
                                                {transaction.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="admin-table-card">
                        <div className="admin-table-header">
                            <h3 className="admin-table-title">Latest Registered Users</h3>
                            <p className="admin-table-subtitle">Recently joined users</p>
                        </div>
                        <div className="admin-table-content">
                            {usersData.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: '#9CA3AF'
                                }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>No Users Yet</div>
                                    <div style={{ fontSize: '14px' }}>Registered users will appear here</div>
                                </div>
                            ) : (
                                usersData.map((user) => (
                                    <div key={user.id} className="admin-table-row">
                                        <div className="admin-table-row-left">
                                            <span className="admin-table-username">{user.userName}</span>
                                            <span className="admin-table-address">{user.address}</span>
                                        </div>
                                        <div className="admin-table-row-right">
                                            <span className="admin-table-status" style={{ backgroundColor: getStatusColor(user.status) }}>
                                                {user.status}
                                            </span>
                                            <span className="admin-table-date">{user.date}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* System Status Section */}
                <div className="admin-status-section">
                    <div className="admin-status-card">
                        <div className="admin-status-header">
                            <h3 className="admin-status-title">System Status</h3>
                            <p className="admin-status-subtitle">Network and platform status</p>
                        </div>
                        <div className="admin-status-content">
                            {systemStatUSDTata.map((item) => (
                                <div key={item.id} className="admin-status-item">
                                    <div className="admin-status-indicator">
                                        <div className="admin-status-dot" style={{ backgroundColor: item.statusColor }}></div>
                                        <div className="admin-status-info">
                                            <span className="admin-status-name">{item.name}</span>
                                            <span className="admin-status-text">{item.status}</span>
                                        </div>
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

export default AdminDashboard;
