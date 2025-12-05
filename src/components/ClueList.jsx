import React, { useState } from 'react'
import { ArrowLeft, AlertTriangle, Clock, Calendar, MapPin, FileText, User, Filter, X } from 'lucide-react'
import { getDaysUntilDeadline, formatDate } from '../utils/dateUtils'

function ClueList({ clues, title, onBack, onViewDetail, onRequestExtension, onComplete, showUrgent = false, currentUser, showFilters = false }) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'all', // all, urgent, normal, overdue
    source: '',
    location: ''
  })
  const [showFilterPanel, setShowFilterPanel] = useState(false)

  const getStatusColor = (clue) => {
    const daysLeft = getDaysUntilDeadline(clue.deadline)
    if (daysLeft < 0) return 'bg-red-100 text-red-800 border-red-200'
    if (daysLeft <= 2) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-green-100 text-green-800 border-green-200'
  }

  const getStatusText = (clue) => {
    const daysLeft = getDaysUntilDeadline(clue.deadline)
    if (daysLeft < 0) return `已超期 ${Math.abs(daysLeft)} 个工作日`
    if (daysLeft === 0) return '今日到期'
    if (daysLeft === 1) return '明日到期'
    return `还剩 ${daysLeft} 个工作日`
  }

  const getClueStatus = (clue) => {
    const daysLeft = getDaysUntilDeadline(clue.deadline)
    if (daysLeft < 0) return 'overdue'
    if (daysLeft <= 2) return 'urgent'
    return 'normal'
  }

  // 筛选逻辑
  const filteredClues = clues.filter(clue => {
    // 时间范围筛选
    if (filters.startDate && new Date(clue.receiveDate) < new Date(filters.startDate)) {
      return false
    }
    if (filters.endDate && new Date(clue.receiveDate) > new Date(filters.endDate)) {
      return false
    }

    // 状态筛选
    if (filters.status !== 'all') {
      const clueStatus = getClueStatus(clue)
      if (filters.status !== clueStatus) {
        return false
      }
    }

    // 来源筛选
    if (filters.source && !clue.source.toLowerCase().includes(filters.source.toLowerCase())) {
      return false
    }

    // 地点筛选
    if (filters.location && !clue.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }

    return true
  })

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: 'all',
      source: '',
      location: ''
    })
  }

  const hasActiveFilters = () => {
    return filters.startDate || filters.endDate || filters.status !== 'all' || filters.source || filters.location
  }

  const handleExtensionRequest = (e, clue) => {
    e.stopPropagation()
    const reason = prompt('请输入延期理由：')
    if (reason && reason.trim()) {
      onRequestExtension(clue.id, reason.trim())
    }
  }

  const handleComplete = (e, clue) => {
    e.stopPropagation()
    if (confirm('确认办结此线索吗？')) {
      const remark = prompt('请填写备注（可选）：')
      onComplete(clue.id, remark)
    }
  }

  // 统计信息
  const stats = {
    total: filteredClues.length,
    urgent: filteredClues.filter(clue => getClueStatus(clue) === 'urgent').length,
    overdue: filteredClues.filter(clue => getClueStatus(clue) === 'overdue').length,
    normal: filteredClues.filter(clue => getClueStatus(clue) === 'normal').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={onBack}
                  className="mr-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    共 {stats.total} 个线索
                    {stats.overdue > 0 && (
                      <span className="ml-2 text-red-600 font-medium">
                        ({stats.overdue} 个已超期)
                      </span>
                    )}
                    {stats.urgent > 0 && (
                      <span className="ml-2 text-orange-600 font-medium">
                        ({stats.urgent} 个即将到期)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* 筛选按钮 */}
              {showFilters !== false && (
                <div className="flex items-center space-x-3">
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      清除筛选
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    className={`px-4 py-2 rounded-md text-sm flex items-center ${
                      showFilterPanel 
                        ? 'bg-blue-600 text-white' 
                        : hasActiveFilters()
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    筛选条件
                    {hasActiveFilters() && (
                      <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                        {Object.values(filters).filter(v => v && v !== 'all').length}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 筛选面板 */}
      {showFilterPanel && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* 开始日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  开始日期
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* 结束日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  结束日期
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* 状态筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  处理状态
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="all">全部状态</option>
                  <option value="overdue">已超期</option>
                  <option value="urgent">即将到期</option>
                  <option value="normal">正常处理</option>
                </select>
              </div>

              {/* 来源筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  线索来源
                </label>
                <input
                  type="text"
                  value={filters.source}
                  onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="筛选来源..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* 地点筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  地点
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="筛选地点..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* 统计信息 */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                <span>总计: {stats.total}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-400 rounded-full mr-2"></span>
                <span>已超期: {stats.overdue}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                <span>即将到期: {stats.urgent}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                <span>正常处理: {stats.normal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {filteredClues.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters() ? '没有符合条件的线索' : '暂无线索'}
            </h3>
            <p className="text-gray-600">
              {hasActiveFilters() ? '请尝试调整筛选条件' : showUrgent ? '没有需要紧急处理的线索' : '还没有添加任何线索'}
            </p>
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
              >
                清除所有筛选条件
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClues.map(clue => (
              <div
                key={clue.id}
                onClick={() => onViewDetail(clue)}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {clue.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(clue)}`}>
                          {getStatusText(clue)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          <span>来源：{clue.source}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>接收：{formatDate(clue.receiveDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>地点：{clue.location}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>录入人：{clue.createdBy}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>截止日期：{formatDate(clue.deadline)}</span>
                          {clue.extensions.length > 0 && (
                            <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              已延期 {clue.extensions.length} 次
                            </span>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          {onRequestExtension && (
                            <button
                              onClick={(e) => handleExtensionRequest(e, clue)}
                              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
                            >
                              申请延期
                            </button>
                          )}
                          {onComplete && (
                            <button
                              onClick={(e) => handleComplete(e, clue)}
                              className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm transition-colors"
                            >
                              办结
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClueList
