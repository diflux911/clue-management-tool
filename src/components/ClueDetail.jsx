import React, { useState } from 'react'
import { ArrowLeft, Calendar, MapPin, FileText, Clock, AlertTriangle, Plus, CheckCircle, User } from 'lucide-react'
import { getDaysUntilDeadline, formatDate, formatDateTime } from '../utils/dateUtils'

function ClueDetail({ clue, onBack, onRequestExtension, onComplete }) {
  const [showExtensionForm, setShowExtensionForm] = useState(false)
  const [extensionReason, setExtensionReason] = useState('')

  if (!clue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">线索信息加载中...</p>
          <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-800">
            返回
          </button>
        </div>
      </div>
    )
  }

  const daysLeft = getDaysUntilDeadline(clue.deadline)
  
  const getStatusColor = () => {
    if (daysLeft < 0) return 'bg-red-100 text-red-800 border-red-200'
    if (daysLeft <= 2) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-green-100 text-green-800 border-green-200'
  }

  const getStatusText = () => {
    if (daysLeft < 0) return `已超期 ${Math.abs(daysLeft)} 个工作日`
    if (daysLeft === 0) return '今日到期'
    if (daysLeft === 1) return '明日到期'
    return `还剩 ${daysLeft} 个工作日`
  }

  const handleExtensionSubmit = () => {
    if (extensionReason.trim()) {
      onRequestExtension(clue.id, extensionReason.trim())
      setExtensionReason('')
      setShowExtensionForm(false)
    }
  }

  const handleComplete = () => {
    if (confirm('确认办结此线索吗？')) {
      const remark = prompt('请填写备注（可选）：')
      onComplete(clue.id, remark)
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
                <h1 className="text-3xl font-bold text-gray-900">{clue.name}</h1>
                <div className="mt-2 flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                  {clue.extensions.length > 0 && (
                    <span className="ml-3 bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                      已延期 {clue.extensions.length} 次
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                {onRequestExtension && (
                  <button
                    onClick={() => setShowExtensionForm(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                  >
                    申请延期
                  </button>
                )}
                {onComplete && (
                  <button
                    onClick={handleComplete}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                  >
                    办结
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    线索来源
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{clue.source}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    接收日期
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(clue.receiveDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    地点
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{clue.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    截止日期
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(clue.deadline)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    录入人
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{clue.createdBy}</dd>
                </div>
              </dl>
            </div>

            {/* 线索描述 */}
            {clue.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">线索描述</h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{clue.description}</p>
              </div>
            )}

            {/* 延期记录 */}
            {clue.extensions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">延期记录</h2>
                <div className="space-y-4">
                  {clue.extensions.map((extension, index) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-4 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          第 {index + 1} 次延期
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(extension.date)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{extension.reason}</p>
                      <div className="mt-1 text-xs text-gray-500 space-y-1">
                        <p>申请人：{extension.appliedBy}</p>
                        <p>新截止日期：{formatDate(extension.newDeadline)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 状态卡片 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">处理状态</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">创建时间</p>
                    <p className="text-xs text-gray-500">{formatDateTime(clue.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className={`h-5 w-5 mr-3 ${daysLeft <= 2 ? 'text-red-500' : 'text-green-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">紧急程度</p>
                    <p className="text-xs text-gray-500">
                      {daysLeft <= 2 ? '紧急处理' : '正常处理'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            {(onRequestExtension || onComplete) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h3>
                <div className="space-y-3">
                  {onRequestExtension && (
                    <button
                      onClick={() => setShowExtensionForm(true)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      申请延期
                    </button>
                  )}
                  {onComplete && (
                    <button
                      onClick={handleComplete}
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors duration-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      办结线索
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 延期申请弹窗 */}
      {showExtensionForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">申请延期</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                延期理由 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请说明延期理由..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowExtensionForm(false)
                  setExtensionReason('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                取消
              </button>
              <button
                onClick={handleExtensionSubmit}
                disabled={!extensionReason.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                确认延期
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClueDetail
