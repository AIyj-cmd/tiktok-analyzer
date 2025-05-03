<div className="member-count-card">
  <div className="icon-container">
    <UserOutlined />
  </div>
  <div className="count-title">成员总数</div>
  <div className="count-value">2</div>
  <div className="count-subtitle">TikTok 创作者数量</div>
  <div className="count-change">
    <ArrowUpOutlined /> 本月新增 1 位
  </div>
</div>

/* CSS styles */
.member-count-card {
  background-color: #ff4d6a;
  color: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.icon-container {
  margin-bottom: 5px;
}

.count-title {
  font-size: 16px;
  font-weight: 500;
}

.count-value {
  font-size: 42px;
  font-weight: bold;
  line-height: 1.1;
}

.count-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 10px;
}

.count-change {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  width: fit-content;
} 