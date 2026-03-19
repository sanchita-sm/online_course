const params = new URLSearchParams(location.search)
const courseId = params.get('id')

async function loadDetail() {
  if (!courseId) { location.href = '../courses/index.html'; return }
  try {
    const [courseRes, lessonRes] = await Promise.all([
      api.courses.getById(courseId),
      api.lessons.getByCourse(courseId)
    ])
    const course  = courseRes.data
    const lessons = lessonRes.data
    renderDetail(course, lessons)
  } catch (e) {
    document.getElementById('detailHero').innerHTML = '<div class="empty-state">ไม่สามารถโหลดข้อมูลได้</div>'
  }
}

function renderDetail(course, lessons) {
  document.title = `${course.title} - MyCourse`
  document.getElementById('breadcrumbTitle').textContent = course.title
  document.getElementById('detailHero').innerHTML = `
    <div class="detail-tags">
      <span class="tag tag-category">${course.category_id}</span>
      <span class="tag tag-level">${course.level_id}</span>
    </div>
    <h1 class="detail-title">${course.title}</h1>
    <p class="detail-desc">${course.description || 'ไม่มีคำอธิบาย'}</p>
    <div class="detail-meta">
      <span>📅 สร้างเมื่อ ${new Date(course.created_at).toLocaleDateString('th-TH')}</span>
      <span>📚 ${lessons.length} บทเรียน</span>
    </div>
  `
  if (lessons.length) {
    document.getElementById('lessonList').innerHTML = lessons.map((l, i) => `
      <div class="lesson-item">
        <span class="lesson-num">${i + 1}</span>
        <div class="lesson-info">
          <span class="lesson-title">${l.title}</span>
          <span class="lesson-desc">${l.description || ''}</span>
        </div>
        <span class="lesson-lock">🔒</span>
      </div>
    `).join('')
    document.getElementById('detailLessons').style.display = 'block'
  }
  document.getElementById('enrollLessonCount').textContent = `${lessons.length} บทเรียน`
  document.getElementById('enrollCard').style.display = 'flex'
}

function handleEnroll() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.id) { location.href = '../login/index.html'; return }
  location.href = `../lesson-view/index.html?course_id=${courseId}`
}

loadDetail()