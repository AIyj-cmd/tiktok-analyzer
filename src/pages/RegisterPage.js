import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { registerUser, loginUser } from '../api';
import '../styles/AuthPages.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Validation
    if (!username || !password || !confirmPassword) {
      setError('请填写所有必填字段');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('密码长度不能少于6个字符');
      setIsLoading(false);
      return;
    }
    
    try {
      // Register the user via API
      const registerData = await registerUser(username, password);
      
      if (registerData.success) {
        // Auto login after registration
        try {
          await loginUser(username, password);
          login(username, password);
          navigate('/');
        } catch (loginErr) {
          setError('注册成功，但登录失败，请尝试手动登录');
          navigate('/login');
        }
      } else {
        setError(registerData.message || '注册失败');
      }
    } catch (err) {
      setError(err.message || '注册时发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2 className="auth-title">用户注册</h2>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="确认密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <>正在注册...</>
            ) : (
              <>
                <FaUserPlus className="button-icon" />
                注册
              </>
            )}
          </button>
        </form>
        <div className="auth-links">
          已有账号？ <Link to="/login">立即登录</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 