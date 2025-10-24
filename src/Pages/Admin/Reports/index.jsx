import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
    ArcElement,
    Tooltip,
    Legend,
    BarController,
    BarElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './index.css';

const Reports = () => {
    const [range, setRange] = useState('7 Days');
    const lineCanvasRef = useRef(null);
    const pieCanvasRef = useRef(null);
    const monthlyCanvasRef = useRef(null);
    const commissionCanvasRef = useRef(null);
    const lineInstanceRef = useRef(null);
    const pieInstanceRef = useRef(null);
    const monthlyInstanceRef = useRef(null);
    const commissionInstanceRef = useRef(null);

    // register controllers once
    useEffect(() => {
        Chart.register(
            LineController,
            LineElement,
            PointElement,
            LinearScale,
            CategoryScale,
            Filler,
            ArcElement,
            Tooltip,
            Legend,
            BarController,
            BarElement,
            ChartDataLabels
        );
    }, []);

    const metrics = [
        { id: 'revenue', title: 'Total Revenue', value: '$2.1M', delta: '+12%', note: 'vs last period' },
        { id: 'users', title: 'Active Users', value: '12,847', delta: '+8%', note: 'vs last period' },
        { id: 'session', title: 'Avg. Session Time', value: '24 min', delta: '+15%', note: 'vs last period' },
        { id: 'growth', title: 'Platform Growth', value: '23%', delta: '+5%', note: 'vs last period' },
    ];

    const topPlayers = [
        { rank: 1, name: 'crypto_king', games: 234, winnings: '$45,800', winRate: '72%', tier: 'Elite' },
        { rank: 2, name: 'lucky_player', games: 189, winnings: '$38,200', winRate: '68%', tier: 'Pro' },
        { rank: 3, name: 'diamond_hands', games: 156, winnings: '$32,500', winRate: '65%', tier: 'Pro' },
        { rank: 4, name: 'whale_hunter', games: 143, winnings: '$28,900', winRate: '61%', tier: 'Pro' },
        { rank: 5, name: 'moon_walker', games: 128, winnings: '$24,600', winRate: '58%', tier: 'Regular' },
        { rank: 6, name: 'risk_taker', games: 117, winnings: '$21,300', winRate: '55%', tier: 'Regular' },
        { rank: 7, name: 'smart_trader', games: 104, winnings: '$19,800', winRate: '52%', tier: 'Regular' },
        { rank: 8, name: 'fortune_seeker', games: 98, winnings: '$17,500', winRate: '49%', tier: 'Regular' },
        { rank: 9, name: 'big_winner', games: 87, winnings: '$15,200', winRate: '46%', tier: 'Regular' },
        { rank: 10, name: 'game_master', games: 79, winnings: '$13,900', winRate: '43%', tier: 'Regular' }
    ];

    useEffect(() => {
        // Line chart
        if (lineInstanceRef.current) {
            lineInstanceRef.current.destroy();
            lineInstanceRef.current = null;
        }
        if (lineCanvasRef.current) {
            const ctx = lineCanvasRef.current.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 320);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.20)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');

            lineInstanceRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'],
                    datasets: [
                        {
                            label: 'DAU',
                            data: [1200, 1350, 1150, 1400, 1550, 1360, 1750],
                            borderColor: '#F59E0B',
                            backgroundColor: gradient,
                            pointRadius: 0,
                            tension: 0.35,
                            fill: true,
                            borderWidth: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: { padding: 0 },
                    plugins: { legend: { display: false }, tooltip: { enabled: true } },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255,255,255,0.06)' },
                            ticks: { color: '#9CA3AF' }
                        },
                        y: {
                            grid: { color: 'rgba(255,255,255,0.06)' },
                            ticks: { color: '#9CA3AF' },
                            suggestedMin: 0,
                            suggestedMax: 1800
                        }
                    }
                }
            });
        }

        // Pie chart
        if (pieInstanceRef.current) {
            pieInstanceRef.current.destroy();
            pieInstanceRef.current = null;
        }
        if (pieCanvasRef.current) {
            const ctx = pieCanvasRef.current.getContext('2d');
            pieInstanceRef.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['BEP20', 'TRC20'],
                    datasets: [
                        {
                            data: [68, 32],
                            backgroundColor: ['#F59E0B', '#2563EB'],
                            borderWidth: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '58%',
                    plugins: {
                        legend: { display: false },
                        datalabels: {
                            color: '#E5E7EB',
                            formatter: (val, ctx2) => `${ctx2.chart.data.labels[ctx2.dataIndex]}: ${val}%`,
                            anchor: 'end',
                            align: 'end',
                            offset: 8
                        }
                    }
                }
            });
        }

        // Monthly transactions line
        if (monthlyInstanceRef.current) {
            monthlyInstanceRef.current.destroy();
            monthlyInstanceRef.current = null;
        }
        if (monthlyCanvasRef.current) {
            const ctx = monthlyCanvasRef.current.getContext('2d');
            monthlyInstanceRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                    datasets: [
                        {
                            label: 'Volume',
                            data: [45000, 52000, 48000, 61000, 58000, 67000],
                            borderColor: '#2563EB',
                            backgroundColor: '#2563EB',
                            tension: 0.35,
                            fill: false,
                            borderWidth: 3,
                            pointRadius: 5,
                            pointHoverRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#9CA3AF' } },
                        y: {
                            grid: { color: 'rgba(255,255,255,0.06)' },
                            ticks: { color: '#9CA3AF' },
                            suggestedMin: 0,
                            suggestedMax: 85000
                        }
                    }
                }
            });
        }

        // Commission earnings bar chart
        if (commissionInstanceRef.current) {
            commissionInstanceRef.current.destroy();
            commissionInstanceRef.current = null;
        }
        if (commissionCanvasRef.current) {
            const ctx = commissionCanvasRef.current.getContext('2d');
            commissionInstanceRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                    datasets: [
                        {
                            data: [2100, 2450, 2200, 3000, 3200],
                            backgroundColor: '#F59E0B',
                            borderRadius: 0,
                            borderSkipped: false,
                            categoryPercentage: 0.8,
                            barPercentage: 0.6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.06)', borderDash: [4,4] }, ticks: { color: '#9CA3AF' } },
                        y: { grid: { color: 'rgba(255,255,255,0.06)', borderDash: [4,4] }, ticks: { color: '#9CA3AF' }, beginAtZero: true, suggestedMax: 3200 }
                    }
                }
            });
        }

        return () => {
            if (lineInstanceRef.current) lineInstanceRef.current.destroy();
            if (pieInstanceRef.current) pieInstanceRef.current.destroy();
            if (monthlyInstanceRef.current) monthlyInstanceRef.current.destroy();
            if (commissionInstanceRef.current) commissionInstanceRef.current.destroy();
        };
    }, []);

    return (
        <div className="reports">
            <div className="reports-content">
                <div className="reports-header">
                    <div>
                        <h1 className="reports-title">Reports & Analytics</h1>
                        <p className="reports-subtitle">Data visualization and performance insights for your platform.</p>
                    </div>
                    <div className="reports-actions">
                        <div className="reports-select">
                            <select value={range} onChange={(e) => setRange(e.target.value)} className="reports-select-input">
                                <option>7 Days</option>
                                <option>30 Days</option>
                                <option>90 Days</option>
                            </select>
                            <svg className="reports-select-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9"/></svg>
                        </div>
                        <button type="button" className="reports-export">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7-7 7 7"/><path d="M5 19h14"/></svg>
                            <span>Export Report</span>
                        </button>
                    </div>
                </div>

                <div className="reports-metrics-grid">
                    {metrics.map((m) => (
                        <div key={m.id} className="reports-metric-card">
                            <div className="reports-metric-header">
                                <div className="reports-metric-title">{m.title}</div>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><polyline points="3,17 9,11 13,15 21,7"/><polyline points="21,12 21,7 16,7"/></svg>
                            </div>
                            <div className="reports-metric-value">{m.value}</div>
                            <div className="reports-metric-foot">
                                <span className="reports-trend-icon">↗</span>
                                <span className="reports-delta">{m.delta}</span>
                                <span className="reports-note">{m.note}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="reports-charts-grid">
                    <div className="reports-chart-card">
                        <div className="reports-chart-header">Daily Active Users</div>
                        <div className="reports-chart-subtitle">User activity over the last 7 days</div>
                        <div className="reports-chart-canvas-wrapper">
                            <canvas ref={lineCanvasRef} />
                        </div>
                    </div>
                    <div className="reports-chart-card">
                        <div className="reports-chart-header">Network Distribution</div>
                        <div className="reports-chart-subtitle">User preference by blockchain network</div>
                        <div className="reports-chart-canvas-wrapper">
                            <canvas ref={pieCanvasRef} />
                        </div>
                        <div className="reports-pie-legend">
                            <span className="legend-dot" style={{background:'#F59E0B'}} /> <span className="legend-text">BEP20</span>
                            <span className="legend-spacer" />
                            <span className="legend-dot" style={{background:'#2563EB'}} /> <span className="legend-text">TRC20</span>
                        </div>
                    </div>
                </div>

                <div className="reports-chart-card reports-chart-full">
                    <div className="reports-chart-header">Transaction Volume Over Time</div>
                    <div className="reports-chart-subtitle">Monthly transaction volume trends</div>
                    <div className="reports-chart-canvas-wrapper large">
                        <canvas ref={monthlyCanvasRef} />
                    </div>
                </div>
                
                <div className="reports-chart-card reports-chart-full">
                    <div className="reports-chart-header">Commission Earnings Trend</div>
                    <div className="reports-chart-subtitle">Weekly commission earnings over the last 5 weeks</div>
                    <div className="reports-chart-canvas-wrapper large">
                        <canvas ref={commissionCanvasRef} />
                    </div>
                </div>

                <div className="reports-top-card">
                    <div className="reports-top-header">
                        <div>
                            <div className="reports-top-title">Top 10 Players by Winnings</div>
                            <div className="reports-top-subtitle">Highest earning players on the platform</div>
                        </div>
                        <button className="reports-export-lite">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7-7 7 7"/><path d="M5 19h14"/></svg>
                            Export
                        </button>
                    </div>
                    <div className="reports-top-list">
                        {topPlayers.map((p) => (
                            <div key={p.rank} className="reports-top-row">
                                <div className="reports-rank">{p.rank}</div>
                                <div>
                                    <div className="reports-player">{p.name}</div>
                                    <div className="reports-games">{p.games} games played</div>
                                </div>
                                <div className="reports-winnings">{p.winnings}</div>
                                <div className="reports-winrate">{p.winRate}</div>
                                <div className={`reports-tier ${p.tier.toLowerCase()}`}>{p.tier}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="reports-export-section">
                    <div className="reports-export-title">Export Options</div>
                    <div className="reports-export-subtitle">Generate detailed reports in various formats</div>
                    <div className="reports-export-grid">
                        <div className="reports-export-card">
                            <div className="reports-export-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>
                            </div>
                            <div className="reports-export-name">User Analytics</div>
                            <div className="reports-export-formats">CSV, Excel</div>
                        </div>
                        <div className="reports-export-card">
                            <div className="reports-export-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="2"><path d="M12 1v22M3 8c3 0 5-3 9-3s6 3 9 3"/></svg>
                            </div>
                            <div className="reports-export-name">Financial Report</div>
                            <div className="reports-export-formats">PDF, Excel</div>
                        </div>
                        <div className="reports-export-card">
                            <div className="reports-export-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="2"><polyline points="3,12 8,12 10,9 14,15 16,12 21,12"/></svg>
                            </div>
                            <div className="reports-export-name">Activity Report</div>
                            <div className="reports-export-formats">CSV, PDF</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;


