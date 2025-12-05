import React, { createContext, useContext, useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  // 默认管理员账号
  const defaultAdmin = {
    id: 'admin',
    username: 'admin',
    name: '管理员',
    password: hashPassword('123456'), // 默认密码
    role: 'admin',
    permissions: ['add_clue', 'edit_clue', 'view_archive', 'manage_users'],
    createdAt: new Date().toISOString(),
    status: 'active'
  }

  // 密码加密
  function hashPassword(password) {
    return CryptoJS.SHA256(password).toString()
  }

  // 初始化用户数据
  useEffect(() => {
    const savedUsers = localStorage.getItem('users')
    if (!savedUsers) {
      localStorage.setItem('users', JSON.stringify([defaultAdmin]))
    }

    const savedCurrentUser = localStorage.getItem('currentUser')
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser))
    }
  }, [])

  // 登录
  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.username === username && u.status === 'active')
    
    if (user && user.password === hashPassword(password)) {
      const userSession = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      }
      setCurrentUser(userSession)
      localStorage.setItem('currentUser', JSON.stringify(userSession))
      return { success: true }
    }
    
    return { success: false, error: '用户名或密码错误' }
  }

  // 登出
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
  }

  // 获取所有用户
  const getUsers = () => {
    return JSON.parse(localStorage.getItem('users') || '[]')
  }

  // 添加用户
  const addUser = (userData) => {
    const users = getUsers()
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      password: hashPassword(userData.password),
      createdAt: new Date().toISOString(),
      status: 'active'
    }
    
    // 检查用户名是否已存在
    if (users.find(u => u.username === userData.username)) {
      return { success: false, error: '用户名已存在' }
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    return { success: true, user: newUser }
  }

  // 更新用户
  const updateUser = (userId, updates) => {
    const users = getUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      return { success: false, error: '用户不存在' }
    }
    
    // 如果更新密码，需要加密
    if (updates.password) {
      updates.password = hashPassword(updates.password)
    }
    
    users[userIndex] = { ...users[userIndex], ...updates }
    localStorage.setItem('users', JSON.stringify(users))
    return { success: true }
  }

  // 删除用户（设为非活跃状态）
  const deleteUser = (userId) => {
    if (userId === 'admin') {
      return { success: false, error: '不能删除管理员账号' }
    }
    
    return updateUser(userId, { status: 'inactive' })
  }

  // 重置密码
  const resetPassword = (userId, newPassword) => {
    return updateUser(userId, { password: newPassword })
  }

  const value = {
    currentUser,
    login,
    logout,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
