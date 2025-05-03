import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // 加载收藏数据
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // 检查用户是否已收藏
  const isFavorite = (username) => {
    return favorites.includes(username);
  };

  // 添加收藏
  const addFavorite = (username) => {
    if (!isFavorite(username)) {
      const updatedFavorites = [...favorites, username];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  // 移除收藏
  const removeFavorite = (username) => {
    if (isFavorite(username)) {
      const updatedFavorites = favorites.filter(user => user !== username);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  // 切换收藏状态
  const toggleFavorite = (username) => {
    if (isFavorite(username)) {
      removeFavorite(username);
      return false; // 返回操作后的状态
    } else {
      addFavorite(username);
      return true; // 返回操作后的状态
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      isFavorite, 
      addFavorite, 
      removeFavorite, 
      toggleFavorite 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext; 