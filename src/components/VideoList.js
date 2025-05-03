import React, { useState, useEffect } from 'react';
import { 
  FaPlay, 
  FaHeart, 
  FaComment, 
  FaShare, 
  FaCalendarAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaFilter,
  FaTimes,
  FaVideo
} from 'react-icons/fa';
import { format } from 'date-fns';
import '../styles/VideoList.css';

/**
 * TikTok 视频列表组件
 * @param {Object} props - 组件属性
 * @param {Array} props.videos - 视频列表
 * @param {Function} props.formatNumber - 数字格式化函数
 */
const VideoList = ({ videos, formatNumber }) => {
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('create_time');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minLikes: '',
    minComments: '',
    minShares: '',
    dateRange: 'all' // 'all', 'week', 'month', 'year'
  });

  // 初始化过滤后的视频列表
  useEffect(() => {
    if (!videos || videos.length === 0) return;
    setFilteredVideos(videos);
  }, [videos]);

  // 处理排序和过滤
  useEffect(() => {
    if (!videos || videos.length === 0) return;
    
    let results = [...videos];
    
    // 应用搜索过滤
    if (searchTerm.trim() !== '') {
      results = results.filter(video => 
        (video.desc && video.desc.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // 应用筛选条件
    if (filters.minLikes) {
      results = results.filter(video => {
        const likes = parseInt(video.statistics?.digg_count || 0);
        return likes >= parseInt(filters.minLikes);
      });
    }
    
    if (filters.minComments) {
      results = results.filter(video => {
        const comments = parseInt(video.statistics?.comment_count || 0);
        return comments >= parseInt(filters.minComments);
      });
    }
    
    if (filters.minShares) {
      results = results.filter(video => {
        const shares = parseInt(video.statistics?.share_count || 0);
        return shares >= parseInt(filters.minShares);
      });
    }
    
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        results = results.filter(video => {
          const createTime = video.create_time ? new Date(video.create_time * 1000) : null;
          return createTime && createTime >= startDate;
        });
      }
    }
    
    // 应用排序
    results.sort((a, b) => {
      let valA, valB;
      
      switch (sortField) {
        case 'create_time':
          valA = parseInt(a.create_time || 0);
          valB = parseInt(b.create_time || 0);
          break;
        case 'plays':
          valA = parseInt(a.statistics?.play_count || 0);
          valB = parseInt(b.statistics?.play_count || 0);
          break;
        case 'likes':
          valA = parseInt(a.statistics?.digg_count || 0);
          valB = parseInt(b.statistics?.digg_count || 0);
          break;
        case 'comments':
          valA = parseInt(a.statistics?.comment_count || 0);
          valB = parseInt(b.statistics?.comment_count || 0);
          break;
        default:
          valA = parseInt(a.create_time || 0);
          valB = parseInt(b.create_time || 0);
      }
      
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
    
    setFilteredVideos(results);
  }, [videos, searchTerm, sortField, sortDirection, filters]);

  // 处理排序字段变更
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 重置过滤条件
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      minLikes: '',
      minComments: '',
      minShares: '',
      dateRange: 'all'
    });
    setSortField('create_time');
    setSortDirection('desc');
  };

  // 获取视频的封面URL
  const getCoverUrl = (video) => {
    if (!video || !video.video || !video.video.dynamic_cover || !video.video.dynamic_cover.url_list) {
      return 'https://via.placeholder.com/300x400';
    }
    const urls = video.video.dynamic_cover.url_list;
    return urls.length > 0 ? urls[0] : 'https://via.placeholder.com/300x400';
  };

  // 获取视频的URL
  const getVideoUrl = (video) => {
    if (!video || !video.video || !video.video.play_addr || !video.video.play_addr.url_list) {
      return '#';
    }
    const urls = video.video.play_addr.url_list;
    return urls.length > 0 ? urls[0] : '#';
  };

  // 将时间戳转换为日期时间
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return format(new Date(timestamp * 1000), 'yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      return 'N/A';
    }
  };

  // 获取排序图标
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="video-list-empty">
        <p>暂无视频数据</p>
      </div>
    );
  }

  return (
    <div className="video-list-container">
      <div className="video-list-header">
        <div className="video-list-title">
          <h3><FaVideo /> 视频列表 <span className="video-count">{videos.length}</span></h3>
        </div>
        
        <div className="video-list-actions">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索视频描述..."
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FaTimes />
              </button>
            )}
          </div>
          
          <button 
            className={`filter-button ${showFilters ? 'active' : ''}`} 
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            <span>筛选</span>
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-header">
            <h4>筛选选项</h4>
            <button className="reset-filters" onClick={resetFilters}>重置</button>
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label>最小点赞数</label>
              <input
                type="number"
                value={filters.minLikes}
                onChange={(e) => setFilters({...filters, minLikes: e.target.value})}
                placeholder="点赞数 ≥"
              />
            </div>
            
            <div className="filter-group">
              <label>最小评论数</label>
              <input
                type="number"
                value={filters.minComments}
                onChange={(e) => setFilters({...filters, minComments: e.target.value})}
                placeholder="评论数 ≥"
              />
            </div>
            
            <div className="filter-group">
              <label>最小分享数</label>
              <input
                type="number"
                value={filters.minShares}
                onChange={(e) => setFilters({...filters, minShares: e.target.value})}
                placeholder="分享数 ≥"
              />
            </div>
            
            <div className="filter-group">
              <label>发布时间</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              >
                <option value="all">全部时间</option>
                <option value="week">最近一周</option>
                <option value="month">最近一个月</option>
                <option value="year">最近一年</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="sort-controls">
        <button
          className={`sort-button ${sortField === 'create_time' ? 'active' : ''}`}
          onClick={() => handleSort('create_time')}
        >
          发布时间 {getSortIcon('create_time')}
        </button>
        <button
          className={`sort-button ${sortField === 'plays' ? 'active' : ''}`}
          onClick={() => handleSort('plays')}
        >
          播放量 {getSortIcon('plays')}
        </button>
        <button
          className={`sort-button ${sortField === 'likes' ? 'active' : ''}`}
          onClick={() => handleSort('likes')}
        >
          点赞数 {getSortIcon('likes')}
        </button>
        <button
          className={`sort-button ${sortField === 'comments' ? 'active' : ''}`}
          onClick={() => handleSort('comments')}
        >
          评论数 {getSortIcon('comments')}
        </button>
      </div>
      
      <div className="filter-summary">
        {filteredVideos.length !== videos.length && (
          <div className="filter-info">
            已筛选: 显示 {filteredVideos.length}/{videos.length} 个视频
            <button className="clear-filters" onClick={resetFilters}>
              <FaTimes /> 清除筛选
            </button>
          </div>
        )}
      </div>
      
      <div className="videos-grid">
        {filteredVideos.map((video, index) => (
          <div key={video.aweme_id || index} className="video-item">
            <div className="video-thumbnail-container">
              <img 
                src={getCoverUrl(video)} 
                alt={`Video ${index + 1}`} 
                className="video-thumbnail"
                onError={(e) => {e.target.src = 'https://via.placeholder.com/300x400'}}
              />
              <div className="video-overlay">
                <a href={getVideoUrl(video)} target="_blank" rel="noopener noreferrer" className="play-button">
                  <FaPlay />
                </a>
              </div>
            </div>
            <div className="video-details">
              <div className="video-meta">
                <div className="video-id">ID: {video.aweme_id ? `${video.aweme_id.substring(0, 8)}...` : 'N/A'}</div>
                <div className="video-date">
                  <FaCalendarAlt className="date-icon" />
                  {formatTimestamp(video.create_time)}
                </div>
              </div>
              <p className="video-description">{video.desc || 'No description'}</p>
              <div className="video-stats">
                <div className="stat-item">
                  <div className="stat-icon play">
                    <FaPlay />
                  </div>
                  <div className="stat-value">{formatNumber(video.statistics?.play_count)}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon like">
                    <FaHeart />
                  </div>
                  <div className="stat-value">{formatNumber(video.statistics?.digg_count)}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon comment">
                    <FaComment />
                  </div>
                  <div className="stat-value">{formatNumber(video.statistics?.comment_count)}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon share">
                    <FaShare />
                  </div>
                  <div className="stat-value">{formatNumber(video.statistics?.share_count)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredVideos.length === 0 && (
        <div className="no-results">
          <p>没有找到符合条件的视频。请尝试调整筛选条件或清除筛选。</p>
          <button className="clear-filters-button" onClick={resetFilters}>
            清除所有筛选
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoList; 