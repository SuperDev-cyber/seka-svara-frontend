import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader/index';
import AdminSidebar from '../../components/admin/AdminSidebar/index';
import AdminDashboard from '../../components/admin/AdminDashboard/index';
import CommissionManagement from './CommissionManagement/index';
import UserManagement from './UserManagement/index';
import TransactionManagement from './TransactionManagement/index';
import PlatformSettings from './PlatformSettings/index';
import Reports from './Reports/index';
import Notifications from './Notifications/index';
import Security from './Security/index';
import TeamManagement from './TeamManagement/index';
import './index.css';

const Admin = () => {
    console.log('Admin component is rendering');
    
    return (
        <div className="admin-layout">
            <AdminHeader />
            <AdminSidebar />
            <main className="admin-main">
                <Routes>
                    <Route path="/" element={<div style={{padding: '20px', color: 'white'}}>Admin Dashboard Test - Route Working!</div>} />
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/commission" element={<CommissionManagement />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/team" element={<TeamManagement />} />
                    <Route path="/transactions" element={<TransactionManagement />} />
                    <Route path="/settings" element={<PlatformSettings />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/security" element={<Security />} />
                </Routes>
            </main>
        </div>
    );
};

export default Admin;
