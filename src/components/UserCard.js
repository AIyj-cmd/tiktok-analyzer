import React from 'react';
import { FaUsers, FaPlay, FaHeart, FaComment, FaShare, FaBookmark, FaGlobe, FaTiktok, FaVideo, FaEye } from 'react-icons/fa';
import '../styles/UserCard.css';

/**
 * TikTok 用户信息卡片组件
 * @param {Object} props - 组件属性
 * @param {Object} props.userData - 用户数据对象
 * @param {Array} props.videos - 用户视频列表
 * @param {Function} props.formatNumber - 数字格式化函数
 */
const UserCard = ({ userData, videos, formatNumber }) => {
  if (!userData || !userData.user) {
    return null;
  }

  // 获取头像URL
  const getAvatarUrl = () => {
    const avatarRaw = userData.user.avatarThumb;
    if (!avatarRaw) return 'https://via.placeholder.com/150';
    
    if (typeof avatarRaw === 'string') {
      return avatarRaw;
    } else if (avatarRaw.urlList && avatarRaw.urlList.length > 0) {
      return avatarRaw.urlList[0];
    }
    
    return 'https://via.placeholder.com/150';
  };

  // 计算视频统计数据
  const calculateVideoStats = () => {
    if (!videos || videos.length === 0) return { plays: 0, likes: 0, comments: 0, shares: 0, collects: 0 };
    
    return videos.reduce((stats, video) => {
      const videoStats = video.statistics || {};
      return {
        plays: stats.plays + parseInt(videoStats.play_count || 0),
        likes: stats.likes + parseInt(videoStats.digg_count || 0),
        comments: stats.comments + parseInt(videoStats.comment_count || 0),
        shares: stats.shares + parseInt(videoStats.share_count || 0),
        collects: stats.collects + parseInt(videoStats.collect_count || 0)
      };
    }, { plays: 0, likes: 0, comments: 0, shares: 0, collects: 0 });
  };

  // 计算平均互动数据
  const calculateAverageEngagement = (stats, videoCount) => {
    if (!videoCount || videoCount === 0) return { avgPlays: 0, avgLikes: 0, avgComments: 0, avgShares: 0, avgCollects: 0 };
    
    return {
      avgPlays: Math.round(stats.plays / videoCount),
      avgLikes: Math.round(stats.likes / videoCount),
      avgComments: Math.round(stats.comments / videoCount),
      avgShares: Math.round(stats.shares / videoCount),
      avgCollects: Math.round(stats.collects / videoCount)
    };
  };

  // 计算百分比
  const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return ((value / total) * 100).toFixed(2);
  };

  const videoStats = calculateVideoStats();
  const averageStats = calculateAverageEngagement(videoStats, videos.length);
  const { nickname, uniqueId, region } = userData.user;
  const followerCount = userData.stats?.followerCount || 0;
  const tiktokUrl = `https://www.tiktok.com/@${uniqueId}`;

  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-profile">
          <div className="avatar-container">
            <img 
              src={getAvatarUrl()} 
              alt={nickname || 'User'} 
              className="user-avatar"
              onError={(e) => {e.target.src = 'https://via.placeholder.com/150'}}
            />
            <a 
              href={tiktokUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="tiktok-link" 
              title="在TikTok上查看"
            >
              <FaTiktok />
            </a>
          </div>
          <div className="user-info">
            <h2 className="user-name">{nickname || 'N/A'}</h2>
            <p className="user-id">@{uniqueId || 'N/A'}</p>
            <div className="user-meta">
              {region && (
                <div className="user-region">
                  <FaGlobe className="info-icon" />
                  <span>{region}</span>
                </div>
              )}
              <div className="user-followers">
                <FaUsers className="info-icon" />
                <span>{formatNumber(followerCount)} 粉丝</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-metrics">
          <div className="metric-item">
            <div className="metric-value">{videos.length}</div>
            <div className="metric-label">
              <FaVideo className="metric-icon" />
              视频数
            </div>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <div className="metric-value">{formatNumber(videoStats.plays)}</div>
            <div className="metric-label">
              <FaEye className="metric-icon" />
              总播放量
            </div>
          </div>
        </div>
      </div>

      <div className="user-card-content">
        <div className="stats-section">
          <div className="section-header">
            <h3>内容统计</h3>
            <div className="section-subtitle">基于 {videos.length} 个视频的统计数据</div>
          </div>

          {/* 新的统计数据卡片和环形进度条 */}
          <div className="stats-overview">
            <div className="stats-cards">
              <div className="stats-card">
                <div className="stats-card-header">
                  <FaPlay className="stats-card-icon" />
                  <span>总播放量</span>
                </div>
                <div className="stats-card-value">{formatNumber(videoStats.plays)}</div>
                <div className="stats-card-footer">
                  <div className="stats-card-avg">
                    <span>平均每视频</span>
                    <span className="stats-card-avg-value">{formatNumber(averageStats.avgPlays)}</span>
                  </div>
                </div>
              </div>
              
              <div className="stats-card highlight">
                <div className="stats-card-header">
                  <FaHeart className="stats-card-icon" />
                  <span>总点赞数</span>
                </div>
                <div className="stats-card-value">{formatNumber(videoStats.likes)}</div>
                <div className="stats-card-footer">
                  <div className="stats-card-avg">
                    <span>平均每视频</span>
                    <span className="stats-card-avg-value">{formatNumber(averageStats.avgLikes)}</span>
                  </div>
                  <div className="stats-card-percentage">
                    <div className="percentage-bar">
                      <div 
                        className="percentage-fill" 
                        style={{width: `${Math.min(100, calculatePercentage(videoStats.likes, videoStats.plays) * 5)}%`}}
                      ></div>
                    </div>
                    <span>{calculatePercentage(videoStats.likes, videoStats.plays)}% 点赞率</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-detail-grid">
              <div className="stats-detail-item">
                <div className="stats-detail-icon">
                  <FaComment />
                </div>
                <div className="stats-detail-content">
                  <div className="stats-detail-main">
                    <div className="stats-detail-title">评论数</div>
                    <div className="stats-detail-value">{formatNumber(videoStats.comments)}</div>
                  </div>
                  <div className="stats-detail-sub">
                    <div className="stats-detail-avg">平均 {formatNumber(averageStats.avgComments)}/视频</div>
                    <div className="stats-detail-percentage">
                      <div className="mini-bar">
                        <div 
                          className="mini-bar-fill" 
                          style={{width: `${Math.min(100, calculatePercentage(videoStats.comments, videoStats.plays) * 20)}%`}}
                        ></div>
                      </div>
                      <span>{calculatePercentage(videoStats.comments, videoStats.plays)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stats-detail-item">
                <div className="stats-detail-icon">
                  <FaShare />
                </div>
                <div className="stats-detail-content">
                  <div className="stats-detail-main">
                    <div className="stats-detail-title">分享数</div>
                    <div className="stats-detail-value">{formatNumber(videoStats.shares)}</div>
                  </div>
                  <div className="stats-detail-sub">
                    <div className="stats-detail-avg">平均 {formatNumber(averageStats.avgShares)}/视频</div>
                    <div className="stats-detail-percentage">
                      <div className="mini-bar">
                        <div 
                          className="mini-bar-fill" 
                          style={{width: `${Math.min(100, calculatePercentage(videoStats.shares, videoStats.plays) * 10)}%`}}
                        ></div>
                      </div>
                      <span>{calculatePercentage(videoStats.shares, videoStats.plays)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stats-detail-item">
                <div className="stats-detail-icon">
                  <FaBookmark />
                </div>
                <div className="stats-detail-content">
                  <div className="stats-detail-main">
                    <div className="stats-detail-title">收藏数</div>
                    <div className="stats-detail-value">{formatNumber(videoStats.collects)}</div>
                  </div>
                  <div className="stats-detail-sub">
                    <div className="stats-detail-avg">平均 {formatNumber(averageStats.avgCollects)}/视频</div>
                    <div className="stats-detail-percentage">
                      <div className="mini-bar">
                        <div 
                          className="mini-bar-fill" 
                          style={{width: `${Math.min(100, calculatePercentage(videoStats.collects, videoStats.plays) * 10)}%`}}
                        ></div>
                      </div>
                      <span>{calculatePercentage(videoStats.collects, videoStats.plays)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-summary">
            <div className="stats-comparison">
              <h4>互动对比</h4>
              <div className="comparison-bars">
                <div className="comparison-item">
                  <div className="comparison-label">
                    <FaHeart className="comparison-icon like" />
                    <span>点赞</span>
                  </div>
                  <div className="comparison-bar-container">
                    <div 
                      className="comparison-bar like-bar" 
                      style={{width: `${Math.min(100, (videoStats.likes / videoStats.plays) * 100)}%`}}
                    ></div>
                  </div>
                  <div className="comparison-value">{formatNumber(videoStats.likes)}</div>
                </div>
                <div className="comparison-item">
                  <div className="comparison-label">
                    <FaComment className="comparison-icon comment" />
                    <span>评论</span>
                  </div>
                  <div className="comparison-bar-container">
                    <div 
                      className="comparison-bar comment-bar" 
                      style={{width: `${Math.min(100, (videoStats.comments / videoStats.plays) * 100 * 10)}%`}}
                    ></div>
                  </div>
                  <div className="comparison-value">{formatNumber(videoStats.comments)}</div>
                </div>
                <div className="comparison-item">
                  <div className="comparison-label">
                    <FaShare className="comparison-icon share" />
                    <span>分享</span>
                  </div>
                  <div className="comparison-bar-container">
                    <div 
                      className="comparison-bar share-bar" 
                      style={{width: `${Math.min(100, (videoStats.shares / videoStats.plays) * 100 * 5)}%`}}
                    ></div>
                  </div>
                  <div className="comparison-value">{formatNumber(videoStats.shares)}</div>
                </div>
                <div className="comparison-item">
                  <div className="comparison-label">
                    <FaBookmark className="comparison-icon collect" />
                    <span>收藏</span>
                  </div>
                  <div className="comparison-bar-container">
                    <div 
                      className="comparison-bar collect-bar" 
                      style={{width: `${Math.min(100, (videoStats.collects / videoStats.plays) * 100 * 5)}%`}}
                    ></div>
                  </div>
                  <div className="comparison-value">{formatNumber(videoStats.collects)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="engagement-section">
          <div className="section-header">
            <h3>互动率分析</h3>
            <div className="section-subtitle">互动数占播放量的百分比</div>
          </div>
          <div className="engagement-grid">
            <div className="engagement-item">
              <div className="engagement-bar-container">
                <div 
                  className="engagement-bar" 
                  style={{width: `${Math.min(100, calculatePercentage(videoStats.likes, videoStats.plays) * 5)}%`}}
                ></div>
              </div>
              <div className="engagement-details">
                <div className="engagement-icon"><FaHeart /></div>
                <div className="engagement-info">
                  <div className="engagement-title">点赞率</div>
                  <div className="engagement-value">{calculatePercentage(videoStats.likes, videoStats.plays)}%</div>
                </div>
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-bar-container">
                <div 
                  className="engagement-bar" 
                  style={{width: `${Math.min(100, calculatePercentage(videoStats.comments, videoStats.plays) * 20)}%`}}
                ></div>
              </div>
              <div className="engagement-details">
                <div className="engagement-icon"><FaComment /></div>
                <div className="engagement-info">
                  <div className="engagement-title">评论率</div>
                  <div className="engagement-value">{calculatePercentage(videoStats.comments, videoStats.plays)}%</div>
                </div>
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-bar-container">
                <div 
                  className="engagement-bar" 
                  style={{width: `${Math.min(100, calculatePercentage(videoStats.shares, videoStats.plays) * 10)}%`}}
                ></div>
              </div>
              <div className="engagement-details">
                <div className="engagement-icon"><FaShare /></div>
                <div className="engagement-info">
                  <div className="engagement-title">分享率</div>
                  <div className="engagement-value">{calculatePercentage(videoStats.shares, videoStats.plays)}%</div>
                </div>
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-bar-container">
                <div 
                  className="engagement-bar" 
                  style={{width: `${Math.min(100, calculatePercentage(videoStats.collects, videoStats.plays) * 10)}%`}}
                ></div>
              </div>
              <div className="engagement-details">
                <div className="engagement-icon"><FaBookmark /></div>
                <div className="engagement-info">
                  <div className="engagement-title">收藏率</div>
                  <div className="engagement-value">{calculatePercentage(videoStats.collects, videoStats.plays)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard; 