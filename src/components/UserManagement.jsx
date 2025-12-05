import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, Key, User, Shield, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function UserManagement({ onBack }) {
  const { getUsers, addUser, updateUser, deleteUser, resetPassword } = useAuth()
  const [users, setUsers] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showResetPassword, setShowResetPassword] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    role: 'operator',
    permissions: []
  })
  const [newPassword, setNewPassword] = useState('')

  const roleOptions = [
    { value: 'admin', label: '管理员' },
    { value: 'operator', label: '操作员' }
  ]

  const permissionOptions = [
    { value: 'add_clue', label: '添加线索' },
    { value: 'edit_clue', label: '编辑线索' },
    { value: 'view_archive', label: '查看归档' }
  ]

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const allUsers = getUsers()
    setUsers(allUsers.filter(u => u.status === 'active'))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    if (editingUser) {
      // 更新用户
      const updates = {
        name: formData.name,
        role: formData.role,
        permissions: formData.permissions
      }
      
      if (formData.password) {
        updates.password = formData.password
      }
      
      const result = updateUser(editingUser.id, updates)
      if (result.success) {
        setEditingUser(null)
        resetForm()
        loadUsers()
      }
    } else {
      // 添加用户
      const result = addUser(formData)
      if (result.success) {
        setShowAddForm(false)
        resetForm()
        loadUsers()
      } else {
        alert(result.error)
      }
    }
  }

  const handleDelete = (user) => {
    if (confirm(`确定要删除用户 "${user.name}" 吗？`)) {
      const result = deleteUser(user.id)
      if (result.success) {
        loadUsers()
      } else {
        alert(result.error)
      }
    }
  }

  const handleResetPassword = (user) => {
    if (newPassword.trim()) {
      const result = resetPassword(user.id, newPassword)
      if (result.success) {
        setShowResetPassword(null)
        setNewPassword('')
        alert('密码重置成功')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      password: '',
      role: 'operator',
      permissions: []
    })
  }

  const startEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      name: user.name,
      password: '',
      role: user.role,
      permissions: user.permissions || []
    })
    setShowAddForm(true)
  }

  const handlePermissionChange = (permission, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permission)
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
                <p className="mt-2 text-sm text-gray-600">
                  管理系统用户和权限
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddForm(true)
                  setEditingUser(null)
                  resetForm()
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加用户
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 用户列表 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  权限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? '管理员' : '操作员'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {(user.permissions || []).map(perm => {
                        const permOption = permissionOptions.find(p => p.value === perm)
                        return permOption ? (
                          <span key={perm} className="mr-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {permOption.label}
                          </span>
                        ) : null
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="编辑"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowResetPassword(user)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="重置密码"
                      >
                        <Key className="h-4 w-4" />
                      </button>
                      {user.id !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-red-600 hover:text-red-900"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 弹窗代码省略，内容太长 */}
    </div>
  )
}

export default UserManagement
