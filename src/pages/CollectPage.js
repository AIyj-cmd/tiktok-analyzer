import React, { useState, useEffect } from 'react';
import { 
  FaTiktok, 
  FaSearch, 
  FaSpinner, 
  FaHistory, 
  FaChartBar, 
  FaDownload,
  FaTimes
} from 'react-icons/fa';
import { extractUniqueId, fetchUserData } from '../api';
import UserCard from '../components/UserCard';
import VideoList from '../components/VideoList';
import '../styles/CollectPage.css';

const CollectPage = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'user', 'videos'
  const [cachedData, setCachedData] = useState({});

  // 加载最近搜索记录和缓存数据
  useEffect(() => {
    const savedSearches = localStorage.getItem('tiktok_recent_searches');
    const savedCache = localStorage.getItem('tiktok_data_cache');
    
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    if (savedCache) {
      setCachedData(JSON.parse(savedCache));
    }
  }, []);

  // 保存搜索记录和完整数据
  const saveSearch = (userInfo, videoData) => {
    if (!userInfo || !userInfo.user) return;
    
    const userId = userInfo.user.uniqueId;
    
    // 保存完整数据到缓存
    const updatedCache = {
      ...cachedData,
      [userId]: {
        userInfo,
        videos: videoData,
        timestamp: new Date().getTime()
      }
    };
    setCachedData(updatedCache);
    localStorage.setItem('tiktok_data_cache', JSON.stringify(updatedCache));
    
    // 保存搜索历史记录
    const newSearch = {
      id: userId,
      name: userInfo.user.nickname,
      avatar: typeof userInfo.user.avatarThumb === 'string' 
        ? userInfo.user.avatarThumb 
        : (userInfo.user.avatarThumb?.urlList?.[0] || ''),
      timestamp: new Date().getTime(),
      followers: userInfo.stats?.followerCount || 0
    };
    
    // 检查是否已存在，如果存在则移除旧的
    const filteredSearches = recentSearches.filter(s => s.id !== newSearch.id);
    
    // 添加到最前面，并限制保存最近的10条
    const updatedSearches = [newSearch, ...filteredSearches].slice(0, 10);
    setRecentSearches(updatedSearches);
    localStorage.setItem('tiktok_recent_searches', JSON.stringify(updatedSearches));
  };

  // 处理搜索
  const handleSearch = async (e, searchUserId = null) => {
    if (e) e.preventDefault();
    
    const searchInput = searchUserId || inputUrl;
    if (!searchInput) return;
    
    setError('');
    setLoading(true);
    setUserData(null);
    setVideos([]);
    setShowSearchHistory(false);
    
    try {
      // 从URL中提取用户ID
      const uniqueId = searchUserId || extractUniqueId(inputUrl);
      
      if (!uniqueId) {
        throw new Error('请输入有效的 TikTok 链接 (例如: https://www.tiktok.com/@username)');
      }
      
      // 检查缓存中是否有此用户的数据
      if (searchUserId && cachedData[uniqueId]) {
        const cachedUserData = cachedData[uniqueId];
        setUserData(cachedUserData.userInfo);
        setVideos(cachedUserData.videos);
        
        // 如果通过历史记录搜索，更新输入框
        setInputUrl(`https://www.tiktok.com/@${uniqueId}`);
        
        // 更新该记录的时间戳
        saveSearch(cachedUserData.userInfo, cachedUserData.videos);
        setLoading(false);
        return;
      }
      
      // 如果缓存中没有或不是从历史搜索，则调用API获取数据
      const data = await fetchUserData(uniqueId);
      
      setUserData(data.userInfo);
      setVideos(data.videos);
      
      // 保存搜索记录和数据缓存
      saveSearch(data.userInfo, data.videos);
      
      // 如果通过历史记录搜索，更新输入框
      if (searchUserId) {
        setInputUrl(`https://www.tiktok.com/@${searchUserId}`);
      }
      
    } catch (err) {
      console.error('搜索错误:', err);
      setError(err.message || '获取数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 清除搜索记录和缓存
  const clearSearchHistory = () => {
    setRecentSearches([]);
    setCachedData({});
    localStorage.removeItem('tiktok_recent_searches');
    localStorage.removeItem('tiktok_data_cache');
    setShowSearchHistory(false);
  };

  // 切换搜索历史显示
  const toggleSearchHistory = () => {
    setShowSearchHistory(!showSearchHistory);
  };

  // 从历史记录中搜索
  const searchFromHistory = (userId) => {
    handleSearch(null, userId);
  };

  // 导出数据为CSV
  const exportData = () => {
    if (!userData || !videos.length) return;
    
    // 准备用户数据行
    const userRow = [
      '用户ID', '用户名', '粉丝数', '地区', 'TikTok链接'
    ].join(',') + '\n' + [
      userData.user?.uniqueId || '',
      `"${(userData.user?.nickname || '').replace(/"/g, '""')}"`,
      userData.stats?.followerCount || 0,
      `"${(userData.user?.region || '').replace(/"/g, '""')}"`,
      `https://www.tiktok.com/@${userData.user?.uniqueId || ''}`
    ].join(',');
    
    // 准备视频数据表头
    const videoHeaders = [
      '视频ID', '描述', '发布时间', '播放量', '点赞数', '评论数', '分享数', '收藏数', '视频链接'
    ].join(',');
    
    // 准备视频数据行
    const videoRows = videos.map(video => {
      const stats = video.statistics || {};
      const createDate = new Date(video.create_time * 1000).toISOString().split('T')[0];
      
      return [
        video.aweme_id || '',
        `"${(video.desc || '').replace(/"/g, '""')}"`,
        createDate,
        stats.play_count || 0,
        stats.digg_count || 0,
        stats.comment_count || 0,
        stats.share_count || 0,
        stats.collect_count || 0,
        `https://www.tiktok.com/@${userData.user?.uniqueId || ''}/video/${video.aweme_id || ''}`
      ].join(',');
    }).join('\n');
    
    // 合并所有CSV内容
    const userCSV = userRow + '\n\n';
    const videosCSV = videoHeaders + '\n' + videoRows;
    const csvContent = userCSV + videosCSV;
    
    // 创建下载链接
    const encodedUri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvContent);
    const exportFileName = `tiktok_${userData.user?.uniqueId || 'user'}_${new Date().toISOString().split('T')[0]}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', encodedUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  };

  // 格式化数字显示
  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // 格式化日期
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="collect-page">
      <div className="page-header">
        <h1>TikTok用户采集</h1>
        <p>快速搜索并分析TikTok用户数据和内容表现</p>
      </div>
      
      <div className="search-container">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <div className="search-input-container">
                <FaTiktok className="tiktok-icon" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="请输入有效的 TikTok 链接 (例如: https://www.tiktok.com/@username)"
                  className="search-input"
                  onFocus={() => recentSearches.length > 0 && setShowSearchHistory(true)}
                />
                {inputUrl && (
                  <button 
                    type="button" 
                    className="clear-input" 
                    onClick={() => setInputUrl('')}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button 
                type="button" 
                className="history-button" 
                onClick={toggleSearchHistory}
                disabled={recentSearches.length === 0}
                title="搜索历史"
              >
                <FaHistory />
              </button>
            </div>
            <button type="submit" className="search-button" disabled={loading}>
              <div className="button-content">
                {loading ? <FaSpinner className="spinner" /> : <FaSearch />}
                <span className={loading ? "loading-text" : ""}>
                  {loading ? "搜索中..." : "搜索用户"}
                </span>
              </div>
            </button>
          </form>
          
          {error && <div className="error-message">{error}</div>}
        </div>
        
        {showSearchHistory && (
          <div className="search-history">
            <div className="history-header">
              <h3>最近搜索</h3>
              <button onClick={clearSearchHistory} className="clear-history">清除历史</button>
            </div>
            <div className="history-list">
              {recentSearches.map(search => (
                <div 
                  key={search.id} 
                  className="history-item"
                  onClick={() => searchFromHistory(search.id)}
                >
                  <img 
                    src={search.avatar} 
                    alt={search.name} 
                    className="history-avatar"
                    onError={(e) => {e.target.src = 'https://via.placeholder.com/40'}}
                  />
                  <div className="history-info">
                    <div className="history-name">{search.name}</div>
                    <div className="history-details">
                      <span>@{search.id}</span>
                      <span>{formatNumber(search.followers)} 粉丝</span>
                      <span>{formatDate(search.timestamp)}</span>
                      {cachedData[search.id] && (
                        <span className="cached-indicator">已缓存</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {userData && (
        <div className="results-container">
          <div className="results-toolbar">
            <div className="view-toggles">
              <button 
                className={`view-toggle ${viewMode === 'all' ? 'active' : ''}`}
                onClick={() => setViewMode('all')}
              >
                所有内容
              </button>
              <button 
                className={`view-toggle ${viewMode === 'user' ? 'active' : ''}`}
                onClick={() => setViewMode('user')}
              >
                用户资料
              </button>
              <button 
                className={`view-toggle ${viewMode === 'videos' ? 'active' : ''}`}
                onClick={() => setViewMode('videos')}
              >
                视频列表
              </button>
            </div>
            <div className="results-actions">
              <button 
                className="action-button chart-button" 
                title="查看数据图表"
                onClick={() => alert('图表功能正在开发中')}
              >
                <FaChartBar />
                <span>数据图表</span>
              </button>
              <button 
                className="action-button export-button" 
                title="导出CSV数据" 
                onClick={exportData}
              >
                <FaDownload />
                <span>导出CSV</span>
              </button>
            </div>
          </div>
          
          {(viewMode === 'all' || viewMode === 'user') && (
            <UserCard 
              userData={userData} 
              videos={videos} 
              formatNumber={formatNumber} 
            />
          )}
          
          {(viewMode === 'all' || viewMode === 'videos') && (
            <VideoList 
              videos={videos} 
              formatNumber={formatNumber} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CollectPage; 