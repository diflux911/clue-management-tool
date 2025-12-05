import React, { useState } from 'react'
import { ArrowLeft, Save, X } from 'lucide-react'

function AddClueForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    source: '',
    receiveDate: new Date().toISOString().split('T')[0],
    location: '',
    description: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 清除错误信息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '线索名称不能为空'
    }
    
    if (!formData.source.trim()) {
      newErrors.source = '线索来源不能为空'
    }
    
    if (!formData.receiveDate) {
      newErrors.receiveDate = '接收日期不能为空'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = '地点不能为空'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center">
              <button
                onClick={onCancel}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">添加新线索</h1>
                <p className="mt-2 text-sm text-gray-600">
                  请填写完整的线索信息
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* 线索名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  线索名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="请输入线索名称"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* 线索来源 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  线索来源 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.source ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="例如：举报电话、网络举报、实地检查等"
                />
                {errors.source && (
                  <p className="mt-1 text-sm text-red-600">{errors.source}</p>
                )}
              </div>

              {/* 接收日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  接收日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="receiveDate"
                  value={formData.receiveDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.receiveDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.receiveDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.receiveDate}</p>
                )}
              </div>

              {/* 地点 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  地点 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="请输入具体地址或区域"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* 线索描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  线索描述
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请描述线索的具体情况（可选）"
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                保存线索
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddClueForm
