const user = JSON.parse(localStorage.getItem('user') || '{}')
if (!user.id || user.role !== 'student') location.href = '../login/index.html'
document.getElementById('navUsername').textContent = `${user.firstname || ''} ${user.lastname || ''}`

let categoryMap = {}
let levelMap    = {}

async function loadMyCourses() {
  try {
    const [enrollRes, catRes, levRes] = await Promise.all([
      api.enrollments.getByStudent(user.id),
      api.categories.getAll(),
      api.levels.getAll()
    ])
    const courses = enrollRes.data
    catRes.data.forEach(c => categoryMap[c.id] = c.category)
    levRes.data.forEach(l => levelMap[l.id]    = l.level)

    const grid = document.getElementById('myCoursesGrid')
    if (!courses.length) {
      grid.innerHTML = `<div class="empty-state">ยังไม่ได้ลงทะเบียนคอร์สใด <a href="../courses/index.html" class="auth-link">ค้นหาคอร์ส</a></div>`
      return
    }

    const withProgress = await Promise.all(courses.map(async c => {
      const pRes = await api.progress.getCourseProgress(user.id, c.id)
      return { ...c, progress: pRes.data }
    }))

    grid.innerHTML = withProgress.map(c => {
      const total = c.progress?.total_lessons     || 0
      const done  = c.progress?.completed_lessons || 0
      const pct   = total > 0 ? Math.round((done / total) * 100) : 0
      return `
        <div class="my-course-card">
          <div class="my-course-img">📖</div>
          <div class="my-course-body">
            <div class="course-card-tags">
              <span class="tag tag-category">${categoryMap[c.category_id] || c.category_id}</span>
              <span class="tag tag-level">${levelMap[c.level_id] || c.level_id}</span>
            </div>
            <h3 class="my-course-title">${c.title}</h3>
            <div class="progress-bar-wrap" style="margin-top:8px">
              <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
              <span class="progress-pct">${pct}%</span>
            </div>
            <div class="my-course-footer">
              <span class="progress-label">${done}/${total} บทเรียน</span>
              <a href="../lesson-view/index.html?course_id=${c.id}" class="btn-continue">
                ${pct === 0 ? '▶ เริ่มเรียน' : pct === 100 ? '✓ เรียนจบแล้ว' : '▶ เรียนต่อ'}
              </a>
            </div>
          </div>
        </div>`
    }).join('')
  } catch (e) {
    document.getElementById('myCoursesGrid').innerHTML = '<div class="empty-state">ไม่สามารถโหลดข้อมูลได้</div>'
  }
}

async function logout() {
  await api.users.logout()
  localStorage.removeItem('user')
  location.href = '../../index.html'
}

loadMyCourses()