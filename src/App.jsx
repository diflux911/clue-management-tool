import React, { useState, useEffect } from 'react'
import { FileText, Plus, AlertTriangle, Clock, CheckCircle, Archive } from 'lucide-react'
import ClueList from './components/ClueList'
import AddClueForm from './components/AddClueForm'
import ClueDetail from './components/ClueDetail'
import ArchiveList from './components/ArchiveList'
import LoginForm from './components/LoginForm'
import UserManagement from './components/UserManagement'
import { calculateWorkingDays, addWorkingDays, getDaysUntilDeadline } from './utils/dateUtils'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function MainApp() {
  const { currentUser, logout } = useAuth()
  const [currentView, setCurrentView] = useState('home')
  const [clues, setClues] = useState([])
  const [archivedClues, setArchivedClues] = useState([])
  const [selectedClue, setSelectedClue] = useState(null)

  // 加载数据
  useEffect(() => {
    const savedClues = localStorage.getItem('clues')
    const savedArchived = localStorage.getItem('archivedClues')
    
    if (savedClues) {
      setClues(JSON.parse(savedClues))
    }
    if (savedArchived) {
      setArchivedClues(JSON.parse(savedArchived))
    }
  }, [])

  // 保存数据
  useEffect(() => {
    localStorage.setItem('clues', JSON.stringify(clues))
  }, [clues])

  useEffect(() => {
    localStorage.setItem('archivedClues', JSON.stringify(archivedClues))
  }, [archivedClues])

  // 权限检查
  const canAddClue = () => {
    return currentUser?.permissions?.includes('add_clue')
  }

  const canEditClue = () => {
    return currentUser?.permissions?.includes('edit_clue')
  }

  const canViewArchive = () => {
    return currentUser?.permissions?.includes('view_archive')
  }

  const canManageUsers = () => {
    return currentUser?.role === 'admin'
  }

  // 添加新线索
  const addClue = (clueData) => {
    const newClue = {
      id: Date.now().toString(),
      ...clueData,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.username,
      deadline: addWorkingDays(new Date(clueData.receiveDate), 15),
      extensions: [],
      status: 'pending'
    }
    setClues(prev => [...prev, newClue])
    setCurrentView('home')
  }

  // 申请延期
  const requestExtension = (clueId, reason) => {
    setClues(prev => prev.map(clue => {
      if (clue.id === clueId) {
        const newDeadline = addWorkingDays(new Date(clue.deadline), 15)
        return {
          ...clue,
          deadline: newDeadline,
          extensions: [...clue.extensions, {
            date: new Date().toISOString(),
            reason,
            newDeadline,
            appliedBy: currentUser.username
          }]
        }
      }
      return clue
    }))
  }

  // 办结线索
  const completeClue = (clueId, remark) => {
    const clue = clues.find(c => c.id === clueId)
    if (clue) {
      const completedClue = {
        ...clue,
        status: 'completed',
        completedAt: new Date().toISOString(),
        completedBy: currentUser.username,
        remark: remark || ''
      }
      setArchivedClues(prev => [...prev, completedClue])
      setClues(prev => prev.filter(c => c.id !== clueId))
      setCurrentView('home')
    }
  }

  // 获取待办线索（剩余天数<=2的线索）
  const getPendingClues = () => {
    return clues.filter(clue => {
      const daysLeft = getDaysUntilDeadline(clue.deadline)
      return daysLeft <= 2
    })
  }

  const renderHome = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">线索管理工具</h1>
                <p className="mt-2 text-sm text-gray-600">
                  欢迎，{currentUser.name} ({currentUser.role === 'admin' ? '管理员' : '操作员'})
                </p>
              </div>
              <div className="flex space-x-3">
                {canManageUsers() && (
                  <button
                    onClick={() => setCurrentView('user-management')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
                  >
                    用户管理
                  </button>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总线索数</p>
                <p className="text-2xl font-bold text-gray-900">{clues.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">紧急待办</p>
                <p className="text-2xl font-bold text-red-600">{getPendingClues().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">处理中</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {clues.filter(c => getDaysUntilDeadline(c.deadline) > 2).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已办结</p>
                <p className="text-2xl font-bold text-green-600">{archivedClues.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 功能按钮 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setCurrentView('all-clues')}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 text-center transition-colors duration-200"
          >
            <FileText className="h-8 w-8 mx-auto mb-2" />
            <span className="text-lg font-medium">查看所有线索</span>
          </button>

          <button
            onClick={() => setCurrentView('pending-clues')}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-6 text-center transition-colors duration-200"
          >
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <span className="text-lg font-medium">查看待办线索</span>
          </button>

          {canAddClue() && (
            <button
              onClick={() => setCurrentView('add-clue')}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 text-center transition-colors duration-200"
            >
              <Plus className="h-8 w-8 mx-auto mb-2" />
              <span className="text-lg font-medium">添加新线索</span>
            </button>
          )}

          {canViewArchive() && (
            <button
              onClick={() => setCurrentView('archive')}
              className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg p-6 text-center transition-colors duration-200"
            >
              <Archive className="h-8 w-8 mx-auto mb-2" />
              <span className="text-lg font-medium">查看归档</span>
            </button>
          )}
        </div>

        {/* 快速概览 */}
        {getPendingClues().length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-red-800">紧急提醒</h3>
            </div>
            <p className="mt-2 text-red-700">
              有 {getPendingClues().length} 个线索即将到期或已过期，请及时处理！
            </p>
            <button
              onClick={() => setCurrentView('pending-clues')}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
            >
              立即查看
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return renderHome()
      case 'all-clues':
        return (
          <ClueList 
            clues={clues}
            title="所有线索"
            onBack={() => setCurrentView('home')}
            onViewDetail={(clue) => {
              setSelectedClue(clue)
              setCurrentView('detail')
            }}
            onRequestExtension={canEditClue() ? requestExtension : null}
            onComplete={canEditClue() ? completeClue : null}
            currentUser={currentUser}
            showFilters={true}
          />
        )
      case 'pending-clues':
        return (
          <ClueList 
            clues={getPendingClues()}
            title="待办线索"
            onBack={() => setCurrentView('home')}
            onViewDetail={(clue) => {
              setSelectedClue(clue)
              setCurrentView('detail')
            }}
            onRequestExtension={canEditClue() ? requestExtension : null}
            onComplete={canEditClue() ? completeClue : null}
            showUrgent={true}
            currentUser={currentUser}
            showFilters={false}
          />
        )
      case 'add-clue':
        return (
          <AddClueForm 
            onSubmit={addClue}
            onCancel={() => setCurrentView('home')}
          />
        )
      case 'detail':
        return (
          <ClueDetail 
            clue={selectedClue}
            onBack={() => setCurrentView('home')}
            onRequestExtension={canEditClue() ? requestExtension : null}
            onComplete={canEditClue() ? completeClue : null}
          />
        )
      case 'archive':
        return (
          <ArchiveList 
            archivedClues={archivedClues}
            onBack={() => setCurrentView('home')}
          />
        )
      case 'user-management':
        return (
          <UserManagement 
            onBack={() => setCurrentView('home')}
          />
        )
      default:
        return renderHome()
    }
  }

  return (
    <div className="fade-in">
      {renderContent()}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <LoginForm />
  }

  return <MainApp />
}

export default App
