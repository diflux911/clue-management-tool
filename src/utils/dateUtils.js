// 计算两个日期之间的工作日天数（不包括周末）
export function calculateWorkingDays(startDate, endDate) {
  let count = 0
  const current = new Date(startDate)
  const end = new Date(endDate)
  
  while (current <= end) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 不是周六日
      count++
    }
    current.setDate(current.getDate() + 1)
  }
  
  return count
}

// 在指定日期基础上增加指定的工作日数
export function addWorkingDays(startDate, workingDays) {
  const date = new Date(startDate)
  let daysAdded = 0
  
  while (daysAdded < workingDays) {
    date.setDate(date.getDate() + 1)
    const dayOfWeek = date.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 不是周六日
      daysAdded++
    }
  }
  
  return date
}

// 获取距离截止日期的工作日天数
export function getDaysUntilDeadline(deadlineDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const deadline = new Date(deadlineDate)
  deadline.setHours(0, 0, 0, 0)
  
  if (deadline < today) {
    return -calculateWorkingDays(deadline, today) // 返回负数表示已过期
  }
  
  return calculateWorkingDays(today, deadline)
}

// 格式化日期显示
export function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 格式化日期时间显示
export function formatDateTime(date) {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
