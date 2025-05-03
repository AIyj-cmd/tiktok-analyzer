import React from 'react';
import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const UserProfile = ({ userInfo }) => {
  const author = userInfo.user;
  const nickname = author.nickname || '未知';
  
  // 处理头像链接
  let avatarUrl = 'https://via.placeholder.com/150';
  if (author.avatarThumb) {
    if (typeof author.avatarThumb === 'object' && author.avatarThumb.urlList && author.avatarThumb.urlList.length > 0) {
      avatarUrl = author.avatarThumb.urlList[0];
    } else if (typeof author.avatarThumb === 'string') {
      avatarUrl = author.avatarThumb;
    }
  }

  // 添加错误处理
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
  };

  const region = author.region || '未知';
  const stats = userInfo.stats || author.stats || {};
  const fans = parseInt(stats.followerCount || 0).toLocaleString();
  const uniqueId = author.uniqueId || '';

  return (
    <div className="card">
      <h2 className="section-title">📌 用户信息</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* 用户基本信息行 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={avatarUrl} 
            alt={`${nickname} 的头像`} 
            onError={handleImageError}
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              marginRight: '1.5rem',
              objectFit: 'cover',
              border: '3px solid #fe2c55'
            }} 
          />
          
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {nickname} <span style={{ color: '#fe2c55', fontSize: '1rem' }}>@{uniqueId}</span>
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaMapMarkerAlt style={{ color: '#666', marginRight: '0.3rem' }} />
                <span>{region}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaUsers style={{ color: '#666', marginRight: '0.3rem' }} />
                <span>{fans} 粉丝</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* TikTok链接按钮行 */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
          <a 
            href={`https://www.tiktok.com/@${uniqueId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              backgroundColor: '#fe2c55',
              color: 'white',
              padding: '0.6rem 1rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d91b43'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fe2c55'}
          >
            <svg viewBox="0 0 512 512" style={{ width: '18px', height: '18px', marginRight: '0.5rem', fill: 'currentColor' }}>
              <path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z"/>
            </svg>
            查看TikTok主页
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 