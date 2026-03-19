const user = JSON.parse(localStorage.getItem('user') || '{}')
if (!user.id || user.role !== 'teacher') location.href = '../login/index.html'

document.getElementById('navUsername').textContent = `${user.firstname || ''} ${user.lastname || ''}`
document.getElementById('welcomeText').textContent = `ยินดีต้อนรับ, ${user.firstname || 'ครู'} 👋`

let categoryMap = {}
let levelMap    = {}

async function loadDashboard() {
  try {
    const [courseRes, catRes, levRes] = await Promise.all([
      api.courses.getAll(),
      api.categories.getAll(),
      api.levels.getAll()
    ])
    catRes.data.forEach(c => categoryMap[c.id] = c.category)
    levRes.data.forEach(l => levelMap[l.id]    = l.level)

    const myCourses = courseRes.data.filter(c => c.teacher_id == user.id)
    document.getElementById('statCourses').textContent = myCourses.length

    let totalLessons = 0, totalStudents = 0
    await Promise.all(myCourses.map(async c => {
      const [lRes, sRes] = await Promise.all([
        api.lessons.getByCourse(c.id),
        api.enrollments.getByCourse(c.id)
      ])
      totalLessons  += Array.isArray(lRes.data) ? lRes.data.length : 0
      totalStudents += Array.isArray(sRes.data) ? sRes.data.length : 0
    }))
    document.getElementById('statLessons').textContent  = totalLessons
    document.getElementById('statStudents').textContent = totalStudents

    renderCourses(myCourses)
  } catch (e) {
    document.getElementById('teacherCoursesGrid').innerHTML = '<div class="empty-state">ไม่สามารถโหลดข้อมูลได้</div>'
  }
}

function renderCourses(courses) {
  const grid = document.getElementById('teacherCoursesGrid')
  if (!courses.length) {
    grid.innerHTML = '<div class="empty-state">ยังไม่มีคอร์ส คลิก "สร้างคอร์สใหม่" เพื่อเริ่มต้น</div>'
    return
  }
  grid.innerHTML = courses.map(c => `
    <div class="course-card teacher-course-card">
      <div class="course-card-img">📖</div>
      <div class="course-card-body">
        <div class="course-card-tags">
          <span class="tag tag-category">${categoryMap[c.category_id] || c.category_id}</span>
          <span class="tag tag-level">${levelMap[c.level_id] || c.level_id}</span>
        </div>
        <h3 class="course-card-title">${c.title}</h3>
        <p class="course-card-desc">${c.description || 'ไม่มีคำอธิบาย'}</p>
        <div class="teacher-card-actions">
          <a href="../lesson-manage/index.html?course_id=${c.id}" class="btn-card-action btn-card-lessons">📝 บทเรียน</a>
          <a href="../course-manage/index.html?edit=${c.id}" class="btn-card-action btn-card-edit">✏️ แก้ไข</a>
        </div>
      </div>
    </div>
  `).join('')
}

async function logout() {
  await api.users.logout()
  localStorage.removeItem('user')
  location.href = '../../index.html'
}

loadDashboard()