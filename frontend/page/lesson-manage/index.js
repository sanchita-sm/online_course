const user     = JSON.parse(localStorage.getItem('user') || '{}')
const params   = new URLSearchParams(location.search)
const courseId = params.get('course_id')

if (!user.id || user.role !== 'teacher') location.href = '../login/index.html'
if (!courseId) location.href = '../teacher-dashboard/index.html'
document.getElementById('navUsername').textContent = `${user.firstname || ''} ${user.lastname || ''}`

async function init() {
  const res = await api.courses.getById(courseId)
  const course = res.data
  document.getElementById('courseTitle').textContent = `บทเรียน: ${course.title}`
  document.getElementById('breadcrumbCourse').textContent = course.title
  loadLessons()
}

async function loadLessons() {
  const res     = await api.lessons.getByCourse(courseId)
  const lessons = res.data
  const wrap    = document.getElementById('lessonListWrap')
  if (!lessons.length) { wrap.innerHTML = '<div class="empty-state">ยังไม่มีบทเรียน</div>'; return }
  wrap.innerHTML = `<div class="lesson-manage-list">${lessons.map(l => `
    <div class="lesson-manage-item">
      <div class="lesson-manage-pos">${l.position}</div>
      <div class="lesson-manage-info">
        <span class="lesson-manage-title">${l.title}</span>
        <span class="lesson-manage-desc">${l.description || ''}</span>
        <span class="lesson-manage-url">🎬 ${l.video_url}</span>
      </div>
      <div class="lesson-manage-actions">
        <a href="../quiz-manage/index.html?lesson_id=${l.id}" class="manage-btn">🧩 Quiz</a>
        <button class="manage-btn" onclick='editLesson(${JSON.stringify(l)})'>✏️</button>
        <button class="manage-btn manage-btn-del" onclick="deleteLesson(${l.id})">🗑️</button>
      </div>
    </div>
  `).join('')}</div>`
}

function openLessonModal(lesson = null) {
  document.getElementById('lessonModal').style.display = 'flex'
  document.getElementById('modalError').style.display  = 'none'
  if (lesson) {
    document.getElementById('modalTitle').textContent      = 'แก้ไขบทเรียน'
    document.getElementById('lessonSubmitBtn').textContent = 'บันทึกการแก้ไข'
    document.getElementById('lessonTitle').value    = lesson.title
    document.getElementById('lessonDesc').value     = lesson.description || ''
    document.getElementById('lessonVideo').value    = lesson.video_url
    document.getElementById('lessonPosition').value = lesson.position
    document.getElementById('lessonEditId').value   = lesson.id
  } else {
    document.getElementById('modalTitle').textContent      = 'เพิ่มบทเรียน'
    document.getElementById('lessonSubmitBtn').textContent = 'บันทึก'
    document.getElementById('lessonForm').reset()
    document.getElementById('lessonEditId').value = ''
  }
}
function editLesson(lesson) { openLessonModal(lesson) }
function closeLessonModal() { document.getElementById('lessonModal').style.display = 'none' }
function closeModal(e) { if (e.target.id === 'lessonModal') closeLessonModal() }

document.getElementById('lessonForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const editId = document.getElementById('lessonEditId').value
  const errEl  = document.getElementById('modalError')
  errEl.style.display = 'none'
  const data = {
    course_id:   parseInt(courseId),
    title:       document.getElementById('lessonTitle').value.trim(),
    description: document.getElementById('lessonDesc').value.trim(),
    video_url:   document.getElementById('lessonVideo').value.trim(),
    position:    parseInt(document.getElementById('lessonPosition').value)
  }
  try {
    if (editId) await api.lessons.update(editId, data)
    else        await api.lessons.create(data)
    closeLessonModal()
    loadLessons()
  } catch (err) {
    errEl.textContent = err.response?.data?.message || 'เกิดข้อผิดพลาด'
    errEl.style.display = 'block'
  }
})

async function deleteLesson(id) {
  if (!confirm('ต้องการลบบทเรียนนี้?')) return
  await api.lessons.remove(id)
  loadLessons()
}

async function logout() { await api.users.logout(); localStorage.removeItem('user'); location.href = '../../index.html' }
init()