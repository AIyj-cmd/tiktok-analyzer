import axios from 'axios';

// TikHub 授权令牌
const BEARER_TOKEN = "Bearer w7w7TUNdzmR2ryAT5le9oH4w5wJQjIb56boihG3KmXVGyU0Sf/1Xg0frPg==";

/**
 * 从 TikTok URL 中提取 unique_id
 * @param {string} tiktokUrl - TikTok 账号链接
 * @returns {string|null} - 提取的 unique_id 或 null
 */
export const extractUniqueId = (tiktokUrl) => {
  const match = tiktokUrl.match(/tiktok.com\/@([\w._]+)(?:\?|$)/);
  return match ? match[1] : null;
};

/**
 * 获取用户数据和视频列表
 * @param {string} uniqueId - TikTok 用户的 unique_id
 * @returns {Promise<Object>} - 包含用户信息和视频列表的对象
 */
export const fetchUserData = async (uniqueId) => {
  const headers = { Authorization: BEARER_TOKEN };

  try {
    // 获取 sec_user_id
    const profileUrl = "https://api.tikhub.io/api/v1/tiktok/web/fetch_user_profile";
    const profileResp = await axios.get(profileUrl, {
      headers,
      params: { uniqueId }
    });

    if (profileResp.status !== 200) {
      console.error('Profile API 错误状态码:', profileResp.status);
      throw new Error(`获取 ${uniqueId} 个人资料失败: 状态码 ${profileResp.status}`);
    }
    
    if (!profileResp.data || !profileResp.data.data || !profileResp.data.data.userInfo) {
      console.error('Profile API 响应结构异常:', profileResp.data);
      throw new Error(`获取 ${uniqueId} 个人资料失败: 响应结构异常`);
    }

    const userInfo = profileResp.data.data.userInfo;
    console.log('API 返回用户信息:', userInfo);
    
    if (!userInfo.user || !userInfo.user.secUid) {
      console.error('缺少必要的用户ID信息:', userInfo);
      throw new Error(`获取 ${uniqueId} 个人资料失败: 缺少用户ID信息`);
    }

    const secUserId = userInfo.user.secUid;

    // 获取视频数据
    const videoUrl = "https://api.tikhub.io/api/v1/tiktok/app/v3/fetch_user_post_videos";
    const videoResp = await axios.get(videoUrl, {
      headers,
      params: {
        sec_user_id: secUserId,
        count: 20,
        sort_type: 0,
        max_cursor: 0
      }
    });

    if (videoResp.status !== 200) {
      console.error('Video API 错误状态码:', videoResp.status);
      throw new Error(`获取 ${uniqueId} 视频列表失败: 状态码 ${videoResp.status}`);
    }
    
    if (!videoResp.data || !videoResp.data.data || !videoResp.data.data.aweme_list) {
      console.error('Video API 响应结构异常:', videoResp.data);
      throw new Error(`获取 ${uniqueId} 视频列表失败: 响应结构异常`);
    }

    // 处理用户统计数据
    if (!userInfo.stats && userInfo.user.stats) {
      userInfo.stats = userInfo.user.stats;
    }
    
    console.log('处理后的用户统计数据:', userInfo.stats);

    return {
      userInfo: userInfo,
      videos: videoResp.data.data.aweme_list
    };
  } catch (error) {
    console.error('API 错误详情:', error);
    if (error.response) {
      console.error('错误响应数据:', error.response.data);
      console.error('错误响应状态:', error.response.status);
      console.error('错误响应头:', error.response.headers);
    }
    throw new Error(`获取数据失败: ${error.message}. 请检查网络连接或稍后再试`);
  }
};

// Authentication API functions
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || '登录失败');
    } else {
      throw new Error('无法连接到服务器，请确认服务器是否启动');
    }
  }
};

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/register', {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || '注册失败');
    } else {
      throw new Error('无法连接到服务器，请确认服务器是否启动');
    }
  }
}; 