const user = JSON.parse(localStorage.getItem('user') || '{}')
if (!user.id || user.role !== 'student') location.href = '../login/index.html'

document.getElementById('navUsername').textContent = `${user.firstname || ''} ${user.lastname || ''}`
document.getElementById('welcomeText').textContent = `ยินดีต้อนรับ, ${user.firstname || 'นักเรียน'} 👋`

let categoryMap = {}
let levelMap    = {}

async function loadDashboard() {
  try {
    const [enrollRes, allRes, catRes, levRes] = await Promise.all([
      api.enrollments.getByStudent(user.id),
      api.courses.getAll(),
      api.categories.getAll(),
      api.levels.getAll()
    ])
    const enrolled   = enrollRes.data
    const allCourses = allRes.data
    catRes.data.forEach(c => categoryMap[c.id] = c.category)
    levRes.data.forEach(l => levelMap[l.id]    = l.level)

    document.getElementById('statEnrolled').textContent = enrolled.length

    let totalLessons = 0, completedLessons = 0
    const progressData = await Promise.all(enrolled.map(async c => {
      const res  = await api.progress.getCourseProgress(user.id, c.id)
      const prog = res.data
      totalLessons     += parseInt(prog.total_lessons)     || 0
      completedLessons += parseInt(prog.completed_lessons) || 0
      return { ...c, progress: prog }
    }))

    document.getElementById('statCompleted').textContent = `${completedLessons}/${totalLessons}`
    const avg = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    document.getElementById('statProgress').textContent = `${avg}%`

    renderContinue(progressData)
    const enrolledIds = new Set(enrolled.map(c => c.id))
    renderDiscover(allCourses.filter(c => !enrolledIds.has(c.id)).slice(0, 6))
  } catch (e) {
    document.getElementById('continueGrid').innerHTML = '<div class="empty-state">ไม่สามารถโหลดข้อมูลได้</div>'
  }
}

function renderContinue(courses) {
  const grid = document.getElementById('continueGrid')
  if (!courses.length) {
    grid.innerHTML = `<div class="empty-state">ยังไม่ได้ลงทะเบียนคอร์สใด <a href="../courses/index.html" class="auth-link">ค้นหาคอร์ส</a></div>`
    return
  }
  grid.innerHTML = courses.slice(0, 3).map(c => {
    const total = c.progress?.total_lessons     || 0
    const done  = c.progress?.completed_lessons || 0
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0
    return `
      <a href="../lesson-view/index.html?course_id=${c.id}" class="course-card student-course-card">
        <div class="course-card-img">📖</div>
        <div class="course-card-body">
          <div class="course-card-tags">
            <span class="tag tag-category">${categoryMap[c.category_id] || c.category_id}</span>
          </div>
          <h3 class="course-card-title">${c.title}</h3>
          <div class="progress-bar-wrap">
            <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
            <span class="progress-pct">${pct}%</span>
          </div>
          <span class="progress-label">${done}/${total} บทเรียน</span>
        </div>
      </a>`
  }).join('')
}

function renderDiscover(courses) {
  const grid = document.getElementById('discoverGrid')
  if (!courses.length) { grid.innerHTML = '<div class="empty-state">ไม่มีคอร์สแนะนำ</div>'; return }
  grid.innerHTML = courses.map(c => `
    <a href="../course-detail/index.html?id=${c.id}" class="course-card">
      <div class="course-card-img">📖</div>
      <div class="course-card-body">
        <div class="course-card-tags">
          <span class="tag tag-category">${categoryMap[c.category_id] || c.category_id}</span>
          <span class="tag tag-level">${levelMap[c.level_id] || c.level_id}</span>
        </div>
        <h3 class="course-card-title">${c.title}</h3>
        <p class="course-card-desc">${c.description || ''}</p>
      </div>
    </a>`).join('')
}

async function logout() {
  await api.users.logout()
  localStorage.removeItem('user')
  location.href = '../../index.html'
}

loadDashboard()