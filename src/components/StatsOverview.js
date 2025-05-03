import React, { useEffect, useState } from 'react';
import { FaPlay, FaHeart, FaComment, FaShare, FaBookmark, FaUsers } from 'react-icons/fa';

const StatCard = ({ icon, label, value, iconColor, subtitle, isCustom }) => {
  if (isCustom) {
    return (
      <div className="stat-card" style={{ 
        flex: '1',
        minWidth: 'calc(50% - 0.5rem)',
        backgroundColor: iconColor,
        color: 'white',
        borderRadius: '8px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div style={{ marginBottom: '5px' }}>
          {React.cloneElement(icon, { style: { fontSize: '1.25rem' } })}
        </div>
        <div style={{ fontSize: '16px', fontWeight: '500' }}>{label}</div>
        <div style={{ fontSize: '42px', fontWeight: 'bold', lineHeight: '1.1' }}>{value}</div>
        <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '10px' }}>{subtitle}</div>
        <div style={{ 
          fontSize: '13px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px',
          padding: '5px 10px',
          borderRadius: '20px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          width: 'fit-content'
        }}>
          ↑ 本月新增 1 位
        </div>
      </div>
    );
  }
  
  return (
    <div className="stat-card" style={{ 
      flex: '1',
      minWidth: 'calc(50% - 0.5rem)', // For mobile layout (2 columns)
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          backgroundColor: `${iconColor}15`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginRight: '0.75rem'
        }}>
          {React.cloneElement(icon, { style: { color: iconColor, fontSize: '1.25rem' } })}
        </div>
        <div style={{ 
          fontSize: '0.9rem', 
          color: '#666',
          textAlign: 'left'
        }}>
          {label}
        </div>
      </div>
      <div style={{ 
        fontWeight: 'bold', 
        fontSize: '1.2rem',
        textAlign: 'right'
      }}>
        {value.toLocaleString()}
      </div>
    </div>
  );
};

const StatsOverview = ({ videoList }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    // Set initial state
    setIsDesktop(window.innerWidth >= 768);
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 计算总统计数据
  const totalPlay = videoList.reduce((sum, video) => 
    sum + parseInt(video?.statistics?.play_count || 0), 0);
  
  const totalDigg = videoList.reduce((sum, video) => 
    sum + parseInt(video?.statistics?.digg_count || 0), 0);
  
  const totalComment = videoList.reduce((sum, video) => 
    sum + parseInt(video?.statistics?.comment_count || 0), 0);
  
  const totalShare = videoList.reduce((sum, video) => 
    sum + parseInt(video?.statistics?.share_count || 0), 0);
  
  const totalCollect = videoList.reduce((sum, video) => 
    sum + parseInt(video?.statistics?.collect_count || 0), 0);

  const stats = [
    { 
      icon: <FaUsers />, 
      label: "成员总数", 
      value: videoList.length > 0 ? 2 : 0, 
      subtitle: "TikTok 创作者数量",
      iconColor: '#ff4d6a',
      isCustom: true
    },
    { 
      icon: <FaPlay />, 
      label: "总播放量", 
      value: totalPlay, 
      iconColor: '#fe2c55' 
    },
    { 
      icon: <FaHeart />, 
      label: "总点赞数", 
      value: totalDigg, 
      iconColor: '#fe2c55' 
    },
    { 
      icon: <FaComment />, 
      label: "总评论数", 
      value: totalComment, 
      iconColor: '#5b5fc7' 
    },
    { 
      icon: <FaShare />, 
      label: "总分享数", 
      value: totalShare, 
      iconColor: '#27ae60' 
    },
    { 
      icon: <FaBookmark />, 
      label: "总收藏数", 
      value: totalCollect, 
      iconColor: '#f39c12' 
    }
  ];

  return (
    <div className="card">
      <h2 className="section-title" style={{ textAlign: 'left' }}>📊 综合统计</h2>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: isDesktop ? 'nowrap' : 'wrap',
        gap: '1rem',
        width: '100%'
      }}>
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            iconColor={stat.iconColor}
            subtitle={stat.subtitle}
            isCustom={stat.isCustom}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsOverview; 