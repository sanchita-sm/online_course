const user = JSON.parse(localStorage.getItem('user') || '{}')
if (!user.id || user.role !== 'student') location.href = '../login/index.html'
document.getElementById('navUsername').textContent = `${user.firstname || ''} ${user.lastname || ''}`

let categoryMap = {}

async function loadProgress() {
  try {
    const [enrollRes, catRes] = await Promise.all([
      api.enrollments.getByStudent(user.id),
      api.categories.getAll()
    ])
    const courses = enrollRes.data
    catRes.data.forEach(c => categoryMap[c.id] = c.category)

    let totalLessons = 0, completedAll = 0
    const withProg = await Promise.all(courses.map(async c => {
      const pRes = await api.progress.getCourseProgress(user.id, c.id)
      const prog = pRes.data
      totalLessons += prog.total_lessons     || 0
      completedAll += prog.completed_lessons || 0
      return { ...c, total: prog.total_lessons || 0, done: prog.completed_lessons || 0 }
    }))

    document.getElementById('statCourses').textContent = courses.length
    document.getElementById('statDone').textContent    = completedAll
    const avg = totalLessons > 0 ? Math.round((completedAll / totalLessons) * 100) : 0
    document.getElementById('statAvg').textContent = `${avg}%`

    renderProgress(withProg)
  } catch (e) {
    document.getElementById('progressList').innerHTML = '<div class="empty-state">ไม่สามารถโหลดข้อมูลได้</div>'
  }
}

function renderProgress(courses) {
  const list = document.getElementById('progressList')
  if (!courses.length) {
    list.innerHTML = `<div class="empty-state">ยังไม่ได้ลงทะเบียนคอร์สใด <a href="../courses/index.html" class="auth-link">ค้นหาคอร์ส</a></div>`
    return
  }
  list.innerHTML = courses.map(c => {
    const pct         = c.total > 0 ? Math.round((c.done / c.total) * 100) : 0
    const statusClass = pct === 100 ? 'status-complete' : pct > 0 ? 'status-inprogress' : 'status-notstart'
    const statusText  = pct === 100 ? '✅ เรียนจบแล้ว'  : pct > 0 ? '▶ กำลังเรียน'    : '○ ยังไม่เริ่ม'
    return `
      <div class="progress-course-card">
        <div class="progress-course-left">
          <div class="progress-course-icon">📖</div>
          <div class="progress-course-info">
            <h3 class="progress-course-title">${c.title}</h3>
            <div class="course-card-tags" style="margin-top:4px">
              <span class="tag tag-category">${categoryMap[c.category_id] || c.category_id}</span>
            </div>
          </div>
        </div>
        <div class="progress-course-right">
          <span class="progress-status ${statusClass}">${statusText}</span>
          <div class="progress-bar-wrap" style="width:200px">
            <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
            <span class="progress-pct">${pct}%</span>
          </div>
          <span class="progress-label">${c.done}/${c.total} บทเรียน</span>
          <a href="../lesson-view/index.html?course_id=${c.id}" class="btn-continue">
            ${pct === 100 ? '🔁 ทบทวน' : '▶ เรียนต่อ'}
          </a>
        </div>
      </div>`
  }).join('')
}

async function logout() {
  await api.users.logout()
  localStorage.removeItem('user')
  location.href = '../../index.html'
}

loadProgress()