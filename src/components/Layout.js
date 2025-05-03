import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaHome, FaUsers, FaTiktok, FaInfoCircle, FaBars, FaChevronLeft, FaUser, FaSignOutAlt, FaComments } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/Layout.css';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="layout">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <FaTiktok style={{ fontSize: '24px', color: '#fe2c55' }} />
          {!sidebarCollapsed && <h2>TikTok 分析</h2>}
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? <FaBars /> : <FaChevronLeft />}
          </button>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaHome className="nav-icon" />
            {!sidebarCollapsed && <span>首页</span>}
          </NavLink>
          <NavLink to="/members" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaUsers className="nav-icon" />
            {!sidebarCollapsed && <span>成员管理</span>}
          </NavLink>
          <NavLink to="/collect" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaTiktok className="nav-icon" />
            {!sidebarCollapsed && <span>TikTok用户采集</span>}
          </NavLink>
          <NavLink to="/message-board" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaComments className="nav-icon" />
            {!sidebarCollapsed && <span>留言板</span>}
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaInfoCircle className="nav-icon" />
            {!sidebarCollapsed && <span>关于我们</span>}
          </NavLink>
        </nav>
      </div>
      <div className="content-wrapper">
        <div className="top-bar">
          <div className="user-menu">
            <div className="user-menu-trigger" onClick={toggleUserMenu}>
              <FaUser className="user-icon" />
              <span className="username">{currentUser?.username}</span>
              {isAdmin() && <span className="admin-badge">管理员</span>}
            </div>
            {userMenuOpen && (
              <div className="user-dropdown">
                <div className="user-info">
                  <strong>{currentUser?.username}</strong>
                  {isAdmin() && <span className="user-role">管理员</span>}
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>退出登录</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout; 