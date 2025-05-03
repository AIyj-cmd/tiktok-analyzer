import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserData } from '../api';
import VideoList from '../components/VideoList';
import UserProfile from '../components/UserProfile';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import '../styles/MemberDetailPage.css';

const MemberDetailPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [memberInfo, setMemberInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        // 首先从本地存储中获取成员基本信息
        const storedMembers = JSON.parse(localStorage.getItem('members') || '[]');
        const member = storedMembers.find(m => m.username === username);
        
        if (member) {
          setMemberInfo(member);
        }

        // 从 API 获取最新数据
        const data = await fetchUserData(username);
        setUserData(data.userInfo);
        setVideos(data.videos);
      } catch (err) {
        console.error('获取数据失败:', err);
        setError(err.message || '获取数据失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  const goBack = () => {
    navigate('/members');
  };

  // 格式化数字显示
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="member-detail-page">
      <div className="back-nav">
        <button className="back-button" onClick={goBack}>
          <FaArrowLeft /> 返回成员列表
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>加载数据中...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={goBack}>返回</button>
        </div>
      ) : (
        <>
          <div className="page-header">
            <h1>{userData?.user?.nickname || memberInfo?.name || username}</h1>
            <p>@{username}</p>
          </div>

          <div className="content-container">
            <div className="user-section">
              {userData && userData.user && (
                <UserProfile userInfo={userData} />
              )}

              {userData && (
                <div className="stats-card">
                  <h2 className="section-title">📊 数据概览</h2>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-value">{formatNumber(userData?.stats?.followerCount || memberInfo?.followers)}</div>
                      <div className="stat-label">粉丝数</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{formatNumber(memberInfo?.plays)}</div>
                      <div className="stat-label">播放量</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{formatNumber(memberInfo?.likes)}</div>
                      <div className="stat-label">点赞数</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{formatNumber(memberInfo?.comments)}</div>
                      <div className="stat-label">评论数</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{formatNumber(memberInfo?.shares)}</div>
                      <div className="stat-label">分享数</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{formatNumber(memberInfo?.bookmarks)}</div>
                      <div className="stat-label">收藏数</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {videos.length > 0 && (
              <div className="videos-section">
                <h2 className="section-title">📱 最新视频</h2>
                <VideoList videos={videos} userInfo={userData} formatNumber={formatNumber} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MemberDetailPage; 