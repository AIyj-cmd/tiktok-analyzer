import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserPlus, FaTrash, FaTimes, FaSpinner, FaSortUp, FaSortDown, FaSort, FaSyncAlt, FaStar, FaRegStar, FaFileExport } from 'react-icons/fa';
import { extractUniqueId, fetchUserData } from '../api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/MembersPage.css';

// Mock member data
const initialMembers = [
  {
    id: 1,
    name: '张三',
    username: 'zhangsan_tiktok',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    followers: 254680,
    plays: 1589400,
    likes: 452870,
    comments: 32540,
    shares: 18650,
    bookmarks: 12480,
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: '李四',
    username: 'lisi_creator',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    followers: 158900,
    plays: 982500,
    likes: 321400,
    comments: 24180,
    shares: 12750,
    bookmarks: 8640,
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: '王五',
    username: 'wangwu_official',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    followers: 89700,
    plays: 645800,
    likes: 234500,
    comments: 15420,
    shares: 8920,
    bookmarks: 5680,
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: '赵六',
    username: 'zhaoliu_videos',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    followers: 128400,
    plays: 874300,
    likes: 298600,
    comments: 18750,
    shares: 10480,
    bookmarks: 7290,
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    name: '钱七',
    username: 'qianqi_tiktok',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    followers: 75600,
    plays: 542900,
    likes: 187400,
    comments: 12650,
    shares: 7380,
    bookmarks: 4560,
    updatedAt: new Date().toISOString()
  }
];

/**
 * 从TikTok API返回的不同格式数据中提取粉丝数
 * @param {Object} userInfo - 用户信息对象
 * @returns {number} - 提取的粉丝数量，如果无法获取则返回0
 */
const extractFollowerCount = (userInfo) => {
  if (!userInfo) return 0;
  
  // 记录路径尝试
  console.log('尝试提取粉丝数...');
  
  // 尝试多种可能的数据路径
  try {
    // 路径1: userInfo.stats.followerCount
    if (userInfo.stats && userInfo.stats.followerCount !== undefined) {
      const count = parseInt(userInfo.stats.followerCount);
      console.log('从userInfo.stats.followerCount路径获取到粉丝数:', count);
      if (!isNaN(count)) return count;
    }
    
    // 路径2: userInfo.user.stats.followerCount
    if (userInfo.user && userInfo.user.stats && userInfo.user.stats.followerCount !== undefined) {
      const count = parseInt(userInfo.user.stats.followerCount);
      console.log('从userInfo.user.stats.followerCount路径获取到粉丝数:', count);
      if (!isNaN(count)) return count;
    }
    
    // 路径3: userInfo.user.followerCount
    if (userInfo.user && userInfo.user.followerCount !== undefined) {
      const count = parseInt(userInfo.user.followerCount);
      console.log('从userInfo.user.followerCount路径获取到粉丝数:', count);
      if (!isNaN(count)) return count;
    }
    
    // 路径4: userInfo.user.fans || userInfo.user.fansCount
    const fans = userInfo.user && (userInfo.user.fans || userInfo.user.fansCount);
    if (fans !== undefined) {
      const count = parseInt(fans);
      console.log('从其他粉丝数字段获取到粉丝数:', count);
      if (!isNaN(count)) return count;
    }
    
    // 尝试递归搜索对象
    console.log('尝试递归搜索对象中的粉丝数字段...');
    const searchTerms = ['followerCount', 'fans', 'fansCount', 'followers'];
    for (const term of searchTerms) {
      const result = findValueByKeyDeep(userInfo, term);
      if (result !== null) {
        const count = parseInt(result);
        console.log(`通过递归搜索找到${term}:`, count);
        if (!isNaN(count)) return count;
      }
    }
    
    console.log('无法从任何已知路径提取粉丝数');
    return 0;
  } catch (error) {
    console.error('提取粉丝数时出错:', error);
    return 0;
  }
};

/**
 * 在对象中深度搜索键名
 * @param {Object} obj - 要搜索的对象
 * @param {string} key - 要查找的键名
 * @returns {*} - 找到的值，如果未找到则返回null
 */
const findValueByKeyDeep = (obj, key) => {
  if (!obj || typeof obj !== 'object') return null;
  
  if (obj[key] !== undefined) return obj[key];
  
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      const result = findValueByKeyDeep(obj[k], key);
      if (result !== null) return result;
    }
  }
  
  return null;
};

// 添加成员模态框组件
const AddMemberModal = ({ isOpen, onClose, onAdd }) => {
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 提取用户ID
      const uniqueId = extractUniqueId(tiktokUrl);
      if (!uniqueId) {
        throw new Error('无效的TikTok链接，请确保链接格式正确');
      }

      // 获取用户数据
      const { userInfo, videos } = await fetchUserData(uniqueId);
      
      if (!userInfo || !userInfo.user) {
        throw new Error('无法获取用户信息，请检查链接或稍后再试');
      }

      // 计算总播放量、点赞等数据
      const totalPlays = videos.reduce((sum, video) => sum + parseInt(video.statistics?.play_count || 0), 0);
      const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.statistics?.digg_count || 0), 0);
      const totalComments = videos.reduce((sum, video) => sum + parseInt(video.statistics?.comment_count || 0), 0);
      const totalShares = videos.reduce((sum, video) => sum + parseInt(video.statistics?.share_count || 0), 0);
      const totalBookmarks = videos.reduce((sum, video) => sum + parseInt(video.statistics?.collect_count || 0), 0);

      // 格式化用户数据
      const user = userInfo.user;
      
      // 调试粉丝数信息
      console.log('用户信息:', user);
      console.log('用户统计:', user.stats);
      console.log('用户信息统计:', userInfo.stats);
      
      // 使用辅助函数提取粉丝数
      const followerCount = extractFollowerCount(userInfo);
      console.log('最终提取的粉丝数:', followerCount);

      const newMember = {
        id: Date.now(),
        name: user.nickname,
        username: user.uniqueId,
        avatar: typeof user.avatarThumb === 'string' ? user.avatarThumb : user.avatarThumb?.urlList?.[0] || '',
        followers: followerCount,
        plays: totalPlays,
        likes: totalLikes,
        comments: totalComments,
        shares: totalShares,
        bookmarks: totalBookmarks,
        updatedAt: new Date().toISOString()
      };

      // 添加用户
      onAdd(newMember);
      setTiktokUrl('');
      onClose();
    } catch (err) {
      console.error('添加用户错误:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>添加TikTok成员</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tiktok-url">TikTok链接</label>
            <input
              id="tiktok-url"
              type="text"
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              placeholder="例如: https://www.tiktok.com/@username"
              required
            />
            <p className="hint">输入TikTok用户主页链接，将自动获取用户数据</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>取消</button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? <><FaSpinner className="spinner" /> 获取中...</> : '添加成员'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { isAdmin } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // 加载成员数据
  useEffect(() => {
    const storedMembers = localStorage.getItem('members');
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers));
    } else {
      setMembers(initialMembers);
      localStorage.setItem('members', JSON.stringify(initialMembers));
    }
  }, []);
  
  // 根据搜索和排序过滤成员列表
  const sortedMembers = React.useMemo(() => {
    let sortableMembers = [...members];
    
    // 应用搜索过滤
    if (searchTerm) {
      sortableMembers = sortableMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 应用排序
    if (sortConfig.key) {
      sortableMembers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableMembers;
  }, [members, searchTerm, sortConfig]);
  
  // 处理排序请求
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // 获取排序图标
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return <FaSort className="sort-icon" />;
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="sort-icon active" /> : 
      <FaSortDown className="sort-icon active" />;
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // 处理添加成员
  const handleAddMember = () => {
    setIsModalOpen(true);
  };
  
  // 处理一键更新所有成员数据
  const handleBatchUpdate = async () => {
    // 确认操作
    if (!window.confirm('确定要更新所有成员数据吗？此操作可能需要一些时间。')) {
      return;
    }

    // 设置更新状态为 true
    setIsUpdating(true);

    // 复制当前成员列表以在更新时标记进度
    let updatedMembers = [...members];
    let hasErrors = false;

    // 将同步图标添加旋转动画
    const syncIcon = document.querySelector('.update-button svg');
    if (syncIcon) {
      syncIcon.style.animation = 'rotate 1s linear infinite';
    }

    // 创建一个状态提示元素
    const statusElement = document.createElement('div');
    statusElement.className = 'update-status-message';
    statusElement.innerHTML = '正在更新成员数据 (0/' + members.length + ')';
    document.body.appendChild(statusElement);

    try {
      // 逐个更新成员数据
      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        statusElement.innerHTML = `正在更新: ${member.name} (${i+1}/${members.length})`;
        
        try {
          // 获取最新用户数据
          const { userInfo, videos } = await fetchUserData(member.username);
          
          if (!userInfo || !userInfo.user) {
            throw new Error(`无法获取 ${member.username} 的用户信息`);
          }

          // 计算总播放量、点赞等数据
          const totalPlays = videos.reduce((sum, video) => sum + parseInt(video.statistics?.play_count || 0), 0);
          const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.statistics?.digg_count || 0), 0);
          const totalComments = videos.reduce((sum, video) => sum + parseInt(video.statistics?.comment_count || 0), 0);
          const totalShares = videos.reduce((sum, video) => sum + parseInt(video.statistics?.share_count || 0), 0);
          const totalBookmarks = videos.reduce((sum, video) => sum + parseInt(video.statistics?.collect_count || 0), 0);

          // 使用辅助函数提取粉丝数
          const followerCount = extractFollowerCount(userInfo);

          // 更新成员数据
          updatedMembers[i] = {
            ...member,
            followers: followerCount,
            plays: totalPlays,
            likes: totalLikes,
            comments: totalComments,
            shares: totalShares,
            bookmarks: totalBookmarks,
            updatedAt: new Date().toISOString()
          };
          
          // 每更新一个成员就更新状态并保存，避免全部失败
          setMembers([...updatedMembers]);
          localStorage.setItem('members', JSON.stringify(updatedMembers));
          
          // 短暂延迟，避免API限制
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`更新 ${member.username} 数据时出错:`, error);
          hasErrors = true;
          
          // 继续处理其他成员
          statusElement.innerHTML = `更新 ${member.name} 失败，正在继续... (${i+1}/${members.length})`;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // 更新完成，显示状态
      statusElement.style.background = hasErrors ? '#fff3cd' : '#d4edda';
      statusElement.style.color = hasErrors ? '#856404' : '#155724';
      statusElement.innerHTML = hasErrors 
        ? '部分成员数据更新完成，但有错误发生。请检查控制台了解详情。'
        : '所有成员数据更新成功！';
      
      // 停止同步图标旋转
      if (syncIcon) {
        syncIcon.style.animation = '';
      }
      
      // 设置更新状态为 false
      setIsUpdating(false);
      
      // 5秒后移除状态提示
      setTimeout(() => {
        if (document.body.contains(statusElement)) {
          document.body.removeChild(statusElement);
        }
      }, 5000);
      
    } catch (error) {
      console.error('批量更新数据时出错:', error);
      
      // 显示错误信息
      statusElement.style.background = '#f8d7da';
      statusElement.style.color = '#721c24';
      statusElement.innerHTML = '更新过程中发生错误: ' + error.message;
      
      // 停止同步图标旋转
      if (syncIcon) {
        syncIcon.style.animation = '';
      }
      
      // 设置更新状态为 false
      setIsUpdating(false);
      
      // 5秒后移除状态提示
      setTimeout(() => {
        if (document.body.contains(statusElement)) {
          document.body.removeChild(statusElement);
        }
      }, 5000);
    }
  };

  const handleAddMemberSubmit = (newMember) => {
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    localStorage.setItem('members', JSON.stringify(updatedMembers));
  };
  
  const handleFollowMember = (username) => {
    const isNowFavorite = toggleFavorite(username);
    
    // 显示收藏状态的提示信息
    const message = document.createElement('div');
    message.className = 'favorite-status-message';
    message.innerHTML = isNowFavorite ? `已收藏 @${username}` : `已取消收藏 @${username}`;
    message.style.background = isNowFavorite ? '#d4edda' : '#f8d7da';
    message.style.color = isNowFavorite ? '#155724' : '#721c24';
    document.body.appendChild(message);
    
    // 2秒后移除提示
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 2000);
  };
  
  const handleDeleteMember = (id) => {
    if (window.confirm('确定要删除这个成员吗？')) {
      const updatedMembers = members.filter(member => member.id !== id);
      setMembers(updatedMembers);
      // Save to localStorage after deletion
      localStorage.setItem('members', JSON.stringify(updatedMembers));
    }
  };

  // 处理点击成员，导航到TikTok主页
  const handleMemberClick = (username, event) => {
    // 如果点击来自操作列中的按钮，不执行操作
    if (event && event.target.closest('.operations-column')) {
      return;
    }
    
    // 打开TikTok主页
    window.open(`https://www.tiktok.com/@${username}`, '_blank');
  };

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
  
  // Format date to locale string
  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 导出CSV文件
  const exportToCSV = () => {
    // 定义CSV的标头
    const headers = [
      '序号', 
      '成员', 
      '用户名', 
      '粉丝数', 
      '播放量', 
      '点赞数', 
      '评论数', 
      '分享数', 
      '收藏数', 
      '更新时间'
    ];
    
    // 处理CSV单元格中的特殊字符
    const escapeCSV = (text) => {
      if (text === null || text === undefined) return '';
      const t = String(text);
      // 如果文本包含逗号、双引号或换行符，则需要用双引号包裹并处理内部的双引号
      if (t.includes(',') || t.includes('"') || t.includes('\n')) {
        return '"' + t.replace(/"/g, '""') + '"';
      }
      return t;
    };
    
    // 将数据转换为CSV格式的行
    const dataRows = sortedMembers.map((member, index) => [
      index + 1,
      member.name,
      member.username,
      member.followers,
      member.plays,
      member.likes,
      member.comments,
      member.shares,
      member.bookmarks,
      formatDate(member.updatedAt)
    ].map(escapeCSV));
    
    // 组合标头和数据行
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...dataRows.map(row => row.join(','))
    ].join('\n');
    
    // 创建Blob对象（添加BOM标记以正确显示中文）
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 创建下载链接
    const link = document.createElement('a');
    
    // 创建URL
    const url = URL.createObjectURL(blob);
    
    // 设置文件名
    const fileName = `tiktok-members-${new Date().toISOString().slice(0, 10)}.csv`;
    
    // 设置链接属性
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    // 添加到DOM
    document.body.appendChild(link);
    
    // 触发下载
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // 显示导出成功提示
    const message = document.createElement('div');
    message.className = 'export-success-message';
    message.innerHTML = `已成功导出 ${sortedMembers.length} 个成员数据`;
    message.style.background = '#d4edda';
    message.style.color = '#155724';
    document.body.appendChild(message);
    
    // 2秒后移除提示
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 2000);
  };

  return (
    <div className="members-page">
      <div className="page-header">
        <h1>TikTok成员管理</h1>
        <p className="page-subtitle">管理和分析TikTok创作者数据，提供实时数据统计、批量导出和更新功能</p>
      </div>
      
      <div className="members-toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="搜索成员..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="action-buttons">
          <button className="export-button" onClick={exportToCSV} title="导出CSV">
            <FaFileExport /> 导出CSV
          </button>
          {isAdmin() && (
            <>
              <button className="update-button" onClick={handleBatchUpdate} disabled={isUpdating}>
                {isUpdating ? <FaSpinner className="spinner" /> : <FaSyncAlt />} 
                {isUpdating ? '更新中...' : '一键更新成员数据'}
              </button>
              <button className="add-button" onClick={handleAddMember}>
                <FaUserPlus /> 添加成员
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="members-table-container">
        <table className="members-table">
          <thead>
            <tr>
              <th className="index-column">序号</th>
              <th onClick={() => requestSort('name')} className="sortable-column">
                成员 {getSortIcon('name')}
              </th>
              <th onClick={() => requestSort('followers')} className="sortable-column">
                粉丝数 {getSortIcon('followers')}
              </th>
              <th onClick={() => requestSort('plays')} className="sortable-column">
                播放量 {getSortIcon('plays')}
              </th>
              <th onClick={() => requestSort('likes')} className="sortable-column">
                点赞数 {getSortIcon('likes')}
              </th>
              <th onClick={() => requestSort('comments')} className="sortable-column">
                评论数 {getSortIcon('comments')}
              </th>
              <th onClick={() => requestSort('shares')} className="sortable-column">
                分享数 {getSortIcon('shares')}
              </th>
              <th onClick={() => requestSort('bookmarks')} className="sortable-column">
                收藏数 {getSortIcon('bookmarks')}
              </th>
              <th onClick={() => requestSort('updatedAt')} className="sortable-column">
                更新时间 {getSortIcon('updatedAt')}
              </th>
              <th className="operations-column">操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedMembers.map((member, index) => (
              <tr key={member.id} className="member-row">
                <td className="index-column">{index + 1}</td>
                <td 
                  className="member-info clickable" 
                  onClick={(e) => handleMemberClick(member.username, e)}
                >
                  <img src={member.avatar} alt={member.name} className="member-avatar" />
                  <div>
                    <div className="member-name">{member.name}</div>
                    <div className="member-username">@{member.username}</div>
                  </div>
                </td>
                <td>{formatNumber(member.followers)}</td>
                <td>{formatNumber(member.plays)}</td>
                <td>{formatNumber(member.likes)}</td>
                <td>{formatNumber(member.comments)}</td>
                <td>{formatNumber(member.shares)}</td>
                <td>{formatNumber(member.bookmarks)}</td>
                <td className="date-column">{formatDate(member.updatedAt)}</td>
                <td className="operations-column">
                  <div className="member-actions">
                    <button 
                      className={`action-button favorite ${isFavorite(member.username) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowMember(member.username);
                      }}
                      title={isFavorite(member.username) ? "取消收藏" : "收藏"}
                    >
                      <span className="icon-wrapper">
                        {isFavorite(member.username) ? 
                          <FaStar size={16} /> : 
                          <FaRegStar size={16} />
                        }
                      </span>
                    </button>
                    {isAdmin() && (
                      <button 
                        className="action-button delete" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMember(member.id);
                        }}
                        title="删除"
                      >
                        <span className="icon-wrapper">
                          <FaTrash size={16} />
                        </span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 添加模态框 */}
      <AddMemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMemberSubmit}
      />
    </div>
  );
};

export default MembersPage; 