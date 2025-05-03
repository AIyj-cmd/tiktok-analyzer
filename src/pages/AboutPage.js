import React from 'react';
import { FaTiktok, FaChartLine, FaUsers, FaDatabase, FaMobileAlt, FaFileExport, FaComments } from 'react-icons/fa';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>关于我们</h1>
        <p>TikTok数据分析平台介绍与使用指南</p>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h2>平台介绍</h2>
          <p>
            TikTok数据分析平台是一个专业的社交媒体数据分析工具，专注于TikTok用户数据的采集、管理、分析和可视化。
            我们致力于为内容创作者、市场营销人员、MCN机构和品牌企业提供全面的数据洞察，
            帮助用户了解TikTok上的内容表现和用户互动情况，制定更有效的内容策略。
          </p>
          <p>
            该平台采用现代化Web技术开发，具有直观的用户界面和丰富的交互功能，适合各类用户使用。
            无论您是个人创作者还是专业团队，都能从我们的平台中获取有价值的数据和见解。
          </p>
        </section>
        
        <section className="about-section">
          <h2>核心功能</h2>
          <div className="features">
            <div className="feature">
              <FaDatabase className="feature-icon" />
              <h3>数据采集</h3>
              <p>通过TikTok链接或用户名快速获取用户资料和视频数据，实时了解最新动态。</p>
            </div>
            <div className="feature">
              <FaUsers className="feature-icon" />
              <h3>成员管理</h3>
              <p>添加、管理和追踪多个TikTok创作者，支持一键更新所有成员数据，实现集中化管理。</p>
            </div>
            <div className="feature">
              <FaChartLine className="feature-icon" />
              <h3>数据分析</h3>
              <p>全面统计关键指标如播放量、粉丝数、点赞数、评论数等，帮助用户深入了解内容表现。</p>
            </div>
            <div className="feature">
              <FaTiktok className="feature-icon" />
              <h3>用户收藏</h3>
              <p>将感兴趣的TikTok创作者添加到收藏夹，便于后续快速访问和数据对比。</p>
            </div>
            <div className="feature">
              <FaFileExport className="feature-icon" />
              <h3>数据导出</h3>
              <p>支持将成员数据导出为CSV格式，方便在Excel或其他工具中进行进一步处理和分析。</p>
            </div>
            <div className="feature">
              <FaComments className="feature-icon" />
              <h3>留言互动</h3>
              <p>通过留言板功能，用户可以分享见解、提出问题，促进社区交流和信息共享。</p>
            </div>
            <div className="feature">
              <FaMobileAlt className="feature-icon" />
              <h3>响应式设计</h3>
              <p>完美适配桌面端和移动端设备，随时随地进行数据查询和管理。</p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <h2>平台优势</h2>
          <div className="advantages">
            <div className="advantage-item">
              <h3>易用性</h3>
              <p>简洁直观的界面设计，无需专业培训即可上手使用。</p>
            </div>
            <div className="advantage-item">
              <h3>数据准确</h3>
              <p>采用优化的数据获取方式，确保数据的真实性和准确性。</p>
            </div>
            <div className="advantage-item">
              <h3>实时更新</h3>
              <p>支持一键更新所有成员数据，确保掌握最新的用户动态。</p>
            </div>
            <div className="advantage-item">
              <h3>安全可靠</h3>
              <p>采用安全的数据存储机制，保护用户数据隐私。</p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <h2>使用技巧</h2>
          <div className="tips">
            <div className="tip-item">
              <h3>定期更新数据</h3>
              <p>建议每周至少更新一次成员数据，以便掌握最新的动态变化。</p>
            </div>
            <div className="tip-item">
              <h3>数据对比分析</h3>
              <p>通过CSV导出功能，对比不同时期的数据，发现成长趋势和规律。</p>
            </div>
            <div className="tip-item">
              <h3>关注互动指标</h3>
              <p>除了粉丝数量外，点赞率、评论率等互动指标更能反映账号的实际影响力。</p>
            </div>
          </div>
        </section>
        
        <section className="about-section version-info">
          <p>版本：V1.2.0</p>
          <p>© 2024 TikTok数据分析平台. 保留所有权利。</p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage; 