import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaTrash, FaEdit, FaSave, FaTimes, FaUser } from 'react-icons/fa';
import '../styles/MessageBoardPage.css';

const MessageBoardPage = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // 从本地存储加载消息
  useEffect(() => {
    const storedMessages = localStorage.getItem('messageBoard');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // 保存消息到本地存储
  const saveToLocalStorage = (updatedMessages) => {
    localStorage.setItem('messageBoard', JSON.stringify(updatedMessages));
  };

  // 添加新消息
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setLoading(true);
    
    // 模拟网络延迟
    setTimeout(() => {
      const message = {
        id: Date.now(),
        text: newMessage.trim(),
        user: currentUser.username,
        timestamp: new Date().toISOString(),
      };
      
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      saveToLocalStorage(updatedMessages);
      setNewMessage('');
      setLoading(false);
    }, 500);
  };

  // 删除消息
  const handleDelete = (id) => {
    const updatedMessages = messages.filter(message => message.id !== id);
    setMessages(updatedMessages);
    saveToLocalStorage(updatedMessages);
  };

  // 开始编辑消息
  const startEdit = (message) => {
    setEditingId(message.id);
    setEditText(message.text);
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // 保存编辑后的消息
  const saveEdit = (id) => {
    if (!editText.trim()) return;
    
    const updatedMessages = messages.map(message => 
      message.id === id ? { ...message, text: editText.trim() } : message
    );
    
    setMessages(updatedMessages);
    saveToLocalStorage(updatedMessages);
    setEditingId(null);
    setEditText('');
  };

  // 格式化日期显示
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="message-board-page">
      <h1>留言板</h1>
      <div className="message-form-container">
        <form onSubmit={handleSubmit} className="message-form">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="请输入您的留言..."
            rows={4}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newMessage.trim()}>
            {loading ? <FaSpinner className="spinner" /> : '发布留言'}
          </button>
        </form>
      </div>

      <div className="messages-container">
        <h2>所有留言</h2>
        {messages.length === 0 ? (
          <p className="no-messages">暂无留言，来发表第一条留言吧！</p>
        ) : (
          <div className="message-list">
            {messages.slice().reverse().map(message => (
              <div key={message.id} className="message-item">
                <div className="message-header">
                  <div className="user-info">
                    <FaUser className="user-icon" />
                    <span className="username">{message.user}</span>
                  </div>
                  <span className="timestamp">{formatDate(message.timestamp)}</span>
                </div>
                
                {editingId === message.id ? (
                  <div className="edit-container">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveEdit(message.id)} className="save-btn">
                        <FaSave /> 保存
                      </button>
                      <button onClick={cancelEdit} className="cancel-btn">
                        <FaTimes /> 取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="message-content">
                    <p className="message-text">{message.text}</p>
                    {currentUser.username === message.user && (
                      <div className="message-actions">
                        <button onClick={() => startEdit(message)} className="edit-btn">
                          <FaEdit /> 编辑
                        </button>
                        <button onClick={() => handleDelete(message.id)} className="delete-btn">
                          <FaTrash /> 删除
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBoardPage; 