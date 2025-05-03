import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaPlay, FaThumbsUp, FaComment, 
  FaShare, FaBookmark, FaChartLine, FaArrowUp, 
  FaArrowDown, FaFireAlt, FaCalendarAlt, FaEye,
  FaBullhorn, FaEdit, FaSave, FaTimes
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/HomePage.css';

// Initial empty stats
const initialStats = {
  members: 0,
  plays: 0,
  likes: 0, 
  comments: 0,
  shares: 0,
  bookmarks: 0
};

const HomePage = () => {
  const [stats, setStats] = useState(initialStats);
  const [targetStats, setTargetStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('all');
  const [topCreators, setTopCreators] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [isEditingAnnouncement, setIsEditingAnnouncement] = useState(false);
  const [editableAnnouncement, setEditableAnnouncement] = useState('');
  const [announcementDate, setAnnouncementDate] = useState('');
  const { isAdmin } = useAuth();

  // Calculate stats from members data in localStorage
  useEffect(() => {
    // Get members from localStorage
    const savedMembers = localStorage.getItem('members');
    let members = [];
    
    if (savedMembers) {
      members = JSON.parse(savedMembers);
      
      // Get top 3 creators by followers
      const sortedMembers = [...members].sort((a, b) => b.followers - a.followers);
      setTopCreators(sortedMembers.slice(0, 3));
    }
    
    // Calculate total stats based on members data
    const calculatedStats = {
      members: members.length,
      plays: members.reduce((sum, member) => sum + (member.plays || 0), 0),
      likes: members.reduce((sum, member) => sum + (member.likes || 0), 0),
      comments: members.reduce((sum, member) => sum + (member.comments || 0), 0),
      shares: members.reduce((sum, member) => sum + (member.shares || 0), 0),
      bookmarks: members.reduce((sum, member) => sum + (member.bookmarks || 0), 0)
    };
    
    setTargetStats(calculatedStats);
    
    // Load announcement from localStorage
    const savedAnnouncement = localStorage.getItem('announcement');
    if (savedAnnouncement) {
      const announcementData = JSON.parse(savedAnnouncement);
      setAnnouncement(announcementData.text);
      setAnnouncementDate(announcementData.date);
    } else {
      // Set default announcement if none exists
      const defaultAnnouncement = {
        text: "欢迎来到TikTok数据分析平台！我们将不断更新功能，提供更好的服务。请关注最新动态和数据分析报告。",
        date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
      };
      setAnnouncement(defaultAnnouncement.text);
      setAnnouncementDate(defaultAnnouncement.date);
      localStorage.setItem('announcement', JSON.stringify(defaultAnnouncement));
    }
    
    setIsLoading(false);
  }, []);

  // Format large numbers with k/M suffix
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Animate stats counters
  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(() => {
      setStats(prevStats => {
        const newStats = { ...prevStats };
        let complete = true;
        
        // Update each stat incrementally
        Object.keys(targetStats).forEach(key => {
          if (prevStats[key] < targetStats[key]) {
            // Increment at different rates based on the size of the value
            const increment = Math.max(1, Math.floor(targetStats[key] / 30));
            newStats[key] = Math.min(prevStats[key] + increment, targetStats[key]);
            if (newStats[key] < targetStats[key]) complete = false;
          }
        });
        
        // Stop the interval when all values have reached their targets
        if (complete) clearInterval(interval);
        
        return newStats;
      });
    }, 25); // Update more frequently for smoother animation
    
    return () => clearInterval(interval);
  }, [targetStats, isLoading]);

  // Calculate engagement rates
  const calculateEngagementRate = () => {
    if (stats.plays === 0) return 0;
    return ((stats.likes + stats.comments + stats.shares) / stats.plays * 100).toFixed(2);
  };

  // Set up progress bar animations
  useEffect(() => {
    if (isLoading) return;
    
    // Wait for the DOM to be updated
    setTimeout(() => {
      const progressBars = document.querySelectorAll('.kpi-progress-fill');
      progressBars.forEach(bar => {
        // Get the width from the element's style
        const width = bar.style.width;
        
        // Store original width
        bar.setAttribute('data-width', width);
        
        // Set initial width to 0 for animation
        bar.style.width = '0';
        
        // Trigger reflow (using void to avoid ESLint error)
        void bar.offsetWidth;
        
        // Set the CSS variable for the animation target
        bar.style.setProperty('--target-width', width);
      });
    }, 500);
  }, [isLoading]);

  // Generate mock trend data
  const generateTrendData = () => {
    const now = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      
      // Generate some realistic-looking data with a slight upward trend
      const basePlays = Math.floor(targetStats.plays * 0.9 / 7);
      const baseLikes = Math.floor(targetStats.likes * 0.9 / 7);
      const baseComments = Math.floor(targetStats.comments * 0.9 / 7);
      const baseShares = Math.floor(targetStats.shares * 0.9 / 7);
      const baseBookmarks = Math.floor(targetStats.bookmarks * 0.9 / 7);
      
      // Add some randomness but ensure overall trend is up
      const randomFactor = 0.85 + (Math.random() * 0.3) + (i * 0.025);
      
      data.push({
        date: dayStr,
        plays: Math.floor(basePlays * randomFactor),
        likes: Math.floor(baseLikes * randomFactor),
        comments: Math.floor(baseComments * randomFactor),
        shares: Math.floor(baseShares * randomFactor),
        bookmarks: Math.floor(baseBookmarks * randomFactor)
      });
    }
    return data;
  };

  // Mock trend data
  const trendData = generateTrendData();
  
  // Mock performance metrics
  const performanceMetrics = [
    { 
      label: "平均播放量", 
      value: stats.members > 0 ? Math.floor(stats.plays / stats.members) : 0,
      change: 5.2,
      icon: <FaEye />,
      color: "#2D88FF"
    },
    { 
      label: "互动率", 
      value: calculateEngagementRate(),
      change: 2.8,
      icon: <FaFireAlt />,
      color: "#FE2C55"
    },
    { 
      label: "完成率", 
      value: stats.plays > 0 ? "61.2%" : "0%",
      change: -1.4,
      icon: <FaChartLine />,
      color: "#22C55E"
    },
    { 
      label: "分享率", 
      value: stats.plays > 0 ? (stats.shares / stats.plays * 100).toFixed(1) + "%" : "0%",
      change: 3.2,
      icon: <FaShare />,
      color: "#22C55E"
    },
    { 
      label: "收藏率", 
      value: stats.plays > 0 ? (stats.bookmarks / stats.plays * 100).toFixed(1) + "%" : "0%",
      change: 4.8,
      icon: <FaBookmark />,
      color: "#F59E0B"
    }
  ];

  // Handle announcement edit
  const handleEditAnnouncement = () => {
    setEditableAnnouncement(announcement);
    setIsEditingAnnouncement(true);
  };

  // Handle save announcement
  const handleSaveAnnouncement = () => {
    const newDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });
    setAnnouncement(editableAnnouncement);
    setAnnouncementDate(newDate);
    setIsEditingAnnouncement(false);
    
    // Save to localStorage
    const announcementData = {
      text: editableAnnouncement,
      date: newDate
    };
    localStorage.setItem('announcement', JSON.stringify(announcementData));
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditingAnnouncement(false);
  };

  return (
    <div className="homepage">
      <div className="dashboard-header">
        <div>
          <h1>首页</h1>
          <p>总体数据概览和统计分析</p>
        </div>
        <div className="timeframe-selector">
          <button 
            className={activeTimeframe === 'day' ? 'active' : ''} 
            onClick={() => setActiveTimeframe('day')}
          >
            今日
          </button>
          <button 
            className={activeTimeframe === 'week' ? 'active' : ''} 
            onClick={() => setActiveTimeframe('week')}
          >
            本周
          </button>
          <button 
            className={activeTimeframe === 'month' ? 'active' : ''} 
            onClick={() => setActiveTimeframe('month')}
          >
            本月
          </button>
          <button 
            className={activeTimeframe === 'all' ? 'active' : ''} 
            onClick={() => setActiveTimeframe('all')}
          >
            全部
          </button>
        </div>
      </div>
      
      <div className="dashboard-cards">
        <div className="stat-card main-card">
          <div className="main-card-content">
            <div className="stat-count-wrapper">
              <div className="count-display">{stats.members.toLocaleString()}</div>
              <div className="count-trend">
                {stats.members > 0 && (
                  <span className="trend-badge positive">
                    <FaArrowUp /> 本月新增 1 位
                  </span>
                )}
              </div>
            </div>
            <div className="count-description">
              <FaUsers className="count-icon" />
              <div className="count-text">
                <h3>成员总数</h3>
                <p>TikTok 创作者数量</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stat-card metric-card">
          <div className="main-card-content">
            <div className="stat-count-wrapper">
              <div className="count-display">{stats.plays.toLocaleString()}</div>
              <div className="count-trend">
                {stats.plays > 0 && (
                  <span className="trend-badge positive">
                    <FaArrowUp /> 12.5%
                  </span>
                )}
              </div>
            </div>
            <div className="count-description">
              <FaPlay className="count-icon" />
              <div className="count-text">
                <h3>总播放量</h3>
                <p>视频播放总数据</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stat-card metric-card">
          <div className="main-card-content">
            <div className="stat-count-wrapper">
              <div className="count-display">{stats.likes.toLocaleString()}</div>
              <div className="count-trend">
                {stats.likes > 0 && (
                  <span className="trend-badge positive">
                    <FaArrowUp /> 8.3%
                  </span>
                )}
              </div>
            </div>
            <div className="count-description">
              <FaThumbsUp className="count-icon" />
              <div className="count-text">
                <h3>总点赞数</h3>
                <p>视频获赞总数据</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stat-card metric-card">
          <div className="main-card-content">
            <div className="stat-count-wrapper">
              <div className="count-display">{stats.comments.toLocaleString()}</div>
              <div className="count-trend">
                {stats.comments > 0 && (
                  <span className="trend-badge positive">
                    <FaArrowUp /> 5.7%
                  </span>
                )}
              </div>
            </div>
            <div className="count-description">
              <FaComment className="count-icon" />
              <div className="count-text">
                <h3>总评论数</h3>
                <p>视频评论总数据</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stat-card metric-card">
          <div className="main-card-content">
            <div className="stat-count-wrapper">
              <div className="count-display">{stats.shares.toLocaleString()}</div>
              <div className="count-trend">
                {stats.shares > 0 && (
                  <span className="trend-badge positive">
                    <FaArrowUp /> 15.2%
                  </span>
                )}
              </div>
            </div>
            <div className="count-description">
              <FaShare className="count-icon" />
              <div className="count-text">
                <h3>总分享数</h3>
                <p>视频分享总数据</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stat-card metric-card">
          <div className="main-card-content">
            <div className="stat-count-wrapper">
              <div className="count-display">{stats.bookmarks.toLocaleString()}</div>
              <div className="count-trend">
                {stats.bookmarks > 0 && (
                  <span className="trend-badge positive">
                    <FaArrowUp /> 9.8%
                  </span>
                )}
              </div>
            </div>
            <div className="count-description">
              <FaBookmark className="count-icon" />
              <div className="count-text">
                <h3>总收藏数</h3>
                <p>视频收藏总数据</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="chart-card trend-chart">
            <div className="chart-header">
              <h3>7日数据趋势</h3>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color play-color"></span>
                  <span>播放量</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color like-color"></span>
                  <span>点赞量</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color comment-color"></span>
                  <span>评论量</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color share-color"></span>
                  <span>分享量</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color bookmark-color"></span>
                  <span>收藏量</span>
                </div>
              </div>
            </div>
            <div className="chart-visualization">
              {trendData.map((day, index) => (
                <div key={index} className="chart-day">
                  <div className="bars-container">
                    <div className="chart-bar play-bar" style={{ height: `${day.plays / (trendData.reduce((max, d) => Math.max(max, d.plays), 0) || 1) * 100}%` }}></div>
                    <div className="chart-bar like-bar" style={{ height: `${day.likes / (trendData.reduce((max, d) => Math.max(max, d.likes), 0) || 1) * 100}%` }}></div>
                    <div className="chart-bar comment-bar" style={{ height: `${day.comments / (trendData.reduce((max, d) => Math.max(max, d.comments), 0) || 1) * 100}%` }}></div>
                    <div className="chart-bar share-bar" style={{ height: `${day.shares / (trendData.reduce((max, d) => Math.max(max, d.shares), 0) || 1) * 100}%` }}></div>
                    <div className="chart-bar bookmark-bar" style={{ height: `${day.bookmarks / (trendData.reduce((max, d) => Math.max(max, d.bookmarks), 0) || 1) * 100}%` }}></div>
                  </div>
                  <div className="chart-date">{day.date}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="metrics-card">
            <h3>关键数据指标</h3>
            <div className="kpi-indicators">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="kpi-item">
                  <div className="kpi-icon-container" style={{ backgroundColor: `${metric.color}12` }}>
                    <div className="kpi-icon" style={{ color: metric.color }}>
                      {metric.icon}
                    </div>
                  </div>
                  <div className="kpi-content">
                    <div className="kpi-label">{metric.label}</div>
                    <div className="kpi-value">{typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}</div>
                    <div className="kpi-progress-container">
                      <div className="kpi-progress-bar">
                        <div 
                          className="kpi-progress-fill" 
                          style={{ 
                            width: typeof metric.value === 'string' && metric.value.includes('%') 
                              ? metric.value 
                              : `${Math.min(100, metric.value / 10000 * 100)}%`,
                            backgroundColor: metric.color 
                          }}
                          data-animate="true"
                        ></div>
                      </div>
                      <div className={`kpi-change ${metric.change >= 0 ? 'positive' : 'negative'}`}>
                        {(typeof metric.value === 'number' && metric.value > 0) || 
                         (typeof metric.value === 'string' && metric.value !== '0%') ? (
                          <>
                            {metric.change >= 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(metric.change)}%
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="dashboard-section secondary-section">
          <div className="engagement-card">
            <h3>互动数据分析</h3>
            <div className="engagement-ratio">
              <div className="donut-chart">
                <div className="donut-center">
                  <div className="donut-text">{calculateEngagementRate()}%</div>
                </div>
                <svg viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f0f0f0" strokeWidth="3"></circle>
                  
                  {/* 计算总互动数 */}
                  {(() => {
                    const totalInteractions = stats.likes + stats.comments + stats.shares + stats.bookmarks;
                    let dashOffset = 25;
                    
                    // 如果没有互动，返回空
                    if (totalInteractions === 0) return null;
                    
                    return (
                      <>
                        {/* 点赞率 */}
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.91549430918954" 
                          fill="transparent" 
                          stroke="#fe2c55" 
                          strokeWidth="3" 
                          strokeDasharray={`${stats.likes / totalInteractions * 100} 100`}
                          strokeDashoffset={dashOffset}
                        />
                        
                        {/* 更新下一个扇形的起始位置 */}
                        {(() => {
                          dashOffset = 100 - (stats.likes / totalInteractions * 100) + 25;
                          return null;
                        })()}
                        
                        {/* 评论率 */}
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.91549430918954" 
                          fill="transparent" 
                          stroke="#5b5fc7" 
                          strokeWidth="3" 
                          strokeDasharray={`${stats.comments / totalInteractions * 100} 100`}
                          strokeDashoffset={dashOffset}
                        />
                        
                        {/* 更新下一个扇形的起始位置 */}
                        {(() => {
                          dashOffset = dashOffset - (stats.comments / totalInteractions * 100);
                          return null;
                        })()}
                        
                        {/* 分享率 */}
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.91549430918954" 
                          fill="transparent" 
                          stroke="#22c55e" 
                          strokeWidth="3" 
                          strokeDasharray={`${stats.shares / totalInteractions * 100} 100`}
                          strokeDashoffset={dashOffset}
                        />
                        
                        {/* 更新下一个扇形的起始位置 */}
                        {(() => {
                          dashOffset = dashOffset - (stats.shares / totalInteractions * 100);
                          return null;
                        })()}
                        
                        {/* 收藏率 */}
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.91549430918954" 
                          fill="transparent" 
                          stroke="#f59e0b" 
                          strokeWidth="3" 
                          strokeDasharray={`${stats.bookmarks / totalInteractions * 100} 100`}
                          strokeDashoffset={dashOffset}
                        />
                      </>
                    );
                  })()}
                </svg>
              </div>
              <div className="ratio-details">
                <div className="ratio-item">
                  <div className="interaction-type">
                    <div className="ratio-color" style={{backgroundColor: "#fe2c55"}}></div>
                    <div className="ratio-label">点赞</div>
                  </div>
                  <div className="ratio-value">
                    {stats.likes + stats.comments + stats.shares + stats.bookmarks > 0 
                      ? Math.round(stats.likes / (stats.likes + stats.comments + stats.shares + stats.bookmarks) * 100) 
                      : 0}%
                  </div>
                </div>
                <div className="ratio-item">
                  <div className="interaction-type">
                    <div className="ratio-color" style={{backgroundColor: "#5b5fc7"}}></div>
                    <div className="ratio-label">评论</div>
                  </div>
                  <div className="ratio-value">
                    {stats.likes + stats.comments + stats.shares + stats.bookmarks > 0 
                      ? Math.round(stats.comments / (stats.likes + stats.comments + stats.shares + stats.bookmarks) * 100) 
                      : 0}%
                  </div>
                </div>
                <div className="ratio-item">
                  <div className="interaction-type">
                    <div className="ratio-color" style={{backgroundColor: "#22c55e"}}></div>
                    <div className="ratio-label">分享</div>
                  </div>
                  <div className="ratio-value">
                    {stats.likes + stats.comments + stats.shares + stats.bookmarks > 0 
                      ? Math.round(stats.shares / (stats.likes + stats.comments + stats.shares + stats.bookmarks) * 100) 
                      : 0}%
                  </div>
                </div>
                <div className="ratio-item">
                  <div className="interaction-type">
                    <div className="ratio-color" style={{backgroundColor: "#f59e0b"}}></div>
                    <div className="ratio-label">收藏</div>
                  </div>
                  <div className="ratio-value">
                    {stats.likes + stats.comments + stats.shares + stats.bookmarks > 0 
                      ? Math.round(stats.bookmarks / (stats.likes + stats.comments + stats.shares + stats.bookmarks) * 100) 
                      : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="top-performers-card">
            <h3>Top 3 创作者</h3>
            <div className="performers-list">
              {topCreators.length > 0 ? (
                topCreators.map((creator, index) => (
                  <div key={index} className="performer-item">
                    <img src={creator.avatar} alt={creator.name} className="performer-avatar" />
                    <div className="performer-info">
                      <div className="performer-name">{creator.name}</div>
                      <div className="performer-username">@{creator.username}</div>
                    </div>
                    <div className="performer-stats">
                      <div className="performer-followers">{formatNumber(creator.followers)}</div>
                      <div className="performer-plays">{formatNumber(creator.plays)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data-message">暂无数据，请添加创作者</div>
              )}
            </div>
          </div>
          
          {/* 公告板块 */}
          <div className="announcement-card">
            <div className="announcement-header">
              <h3><FaBullhorn className="announcement-icon" /> 平台公告</h3>
              {isAdmin() && !isEditingAnnouncement && (
                <button className="announcement-edit-button" onClick={handleEditAnnouncement}>
                  <FaEdit /> 编辑
                </button>
              )}
            </div>
            
            {isEditingAnnouncement ? (
              <div className="announcement-editor">
                <textarea
                  className="announcement-textarea"
                  value={editableAnnouncement}
                  onChange={(e) => setEditableAnnouncement(e.target.value)}
                  placeholder="输入公告内容..."
                />
                <div className="announcement-buttons">
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    <FaTimes /> 取消
                  </button>
                  <button className="save-button" onClick={handleSaveAnnouncement}>
                    <FaSave /> 保存
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="announcement-content">
                  {announcement}
                </div>
                <div className="announcement-footer">
                  <div className="announcement-date">
                    <FaCalendarAlt className="date-icon" /> 更新于: {announcementDate}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 