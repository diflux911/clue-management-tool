import React, { useState } from 'react'
import { ArrowLeft, FileText, Calendar, MapPin, Clock, Eye, Search, User } from 'lucide-react'
import { formatDate, formatDateTime } from '../utils/dateUtils'

function ArchiveList({ archivedClues, onBack }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClue, setSelectedClue] = useState(null)

  const filteredClues = archivedClues.filter(clue =>
    clue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clue.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clue.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetail = (clue) => {
    setSelectedClue(clue)
  }

  const closeDetail = () => {
    setSelectedClue(null)
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
                  <h1 className="text-3xl font-bold text-gray-900">归档线索</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    共 {archivedClues.length} 个已办结线索
                  </p>
                </div>
              </div>
              
              {/* 搜索框 */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="搜索归档线索..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {filteredClues.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? '没有找到匹配的归档线索' : '暂无归档线索'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? '请尝试其他搜索关键词' : '还没有办结任何线索'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    线索信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    来源/地点
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    处理人员
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时间信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    延期次数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClues.map((clue) => (
                  <tr key={clue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{clue.name}</div>
                        {clue.remark && (
                          <div className="text-sm text-gray-500 mt-1">备注：{clue.remark}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{clue.source}</div>
                      <div className="text-sm text-gray-500">{clue.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">录入：{clue.createdBy}</div>
                      <div className="text-sm text-gray-500">办结：{clue.completedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>接收：{formatDate(clue.receiveDate)}</div>
                      <div>办结：{formatDate(clue.completedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {clue.extensions.length > 0 ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {clue.extensions.length} 次
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          无延期
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetail(clue)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      {selectedClue && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">归档线索详情</h3>
              <button
                onClick={closeDetail}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">关闭</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">基本信息</h4>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">线索名称</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedClue.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">来源</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedClue.source}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">接收日期</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedClue.receiveDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">地点</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedClue.location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">录入人</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedClue.createdBy}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">办结人</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedClue.completedBy}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">办结时间</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDateTime(selectedClue.completedAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">延期次数</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedClue.extensions.length} 次</dd>
                  </div>
                </dl>
              </div>

              {/* 线索描述 */}
              {selectedClue.description && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">线索描述</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedClue.description}</p>
                </div>
              )}

              {/* 办结备注 */}
              {selectedClue.remark && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">办结备注</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedClue.remark}</p>
                </div>
              )}

              {/* 延期记录 */}
              {selectedClue.extensions.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">延期记录</h4>
                  <div className="space-y-3">
                    {selectedClue.extensions.map((extension, index) => (
                      <div key={index} className="border-l-4 border-blue-400 pl-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            第 {index + 1} 次延期
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(extension.date)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{extension.reason}</p>
                        <div className="text-xs text-gray-500 space-y-1 mt-1">
                          <p>申请人：{extension.appliedBy}</p>
                          <p>延期至：{formatDate(extension.newDeadline)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeDetail}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArchiveList
