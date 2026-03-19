const user     = JSON.parse(localStorage.getItem('user') || '{}')
const params   = new URLSearchParams(location.search)
const courseId = params.get('course_id')
let currentLessonId = params.get('lesson_id') || null
let lessons = [], progressMap = {}

if (!user.id || user.role !== 'student') location.href = '../login/index.html'
if (!courseId) location.href = '../my-courses/index.html'
document.getElementById('navUsername').textContent = `${user.firstname || ''} ${user.lastname || ''}`

async function init() {
  const [courseRes, lessonRes, progressRes] = await Promise.all([
    api.courses.getById(courseId),
    api.lessons.getByCourse(courseId),
    api.progress.getLessonProgress(user.id, courseId)
  ])
  const course   = courseRes.data
  lessons        = lessonRes.data
  const progress = progressRes.data

  document.title = `${course.title} - MyCourse`
  document.getElementById('sidebarCourseTitle').textContent = course.title
  progress.forEach(p => { progressMap[p.id] = p.completed })
  renderSidebar()
  if (!currentLessonId && lessons.length) currentLessonId = lessons[0].id
  if (currentLessonId) loadLesson(currentLessonId)
}

function renderSidebar() {
  document.getElementById('lessonSidebarList').innerHTML = lessons.map(l => `
    <div class="sidebar-lesson-item ${l.id == currentLessonId ? 'active' : ''}" id="sidebar_${l.id}" onclick="loadLesson(${l.id})">
      <span class="sidebar-lesson-check">${progressMap[l.id] ? '✅' : '○'}</span>
      <span class="sidebar-lesson-title">${l.title}</span>
    </div>`).join('')
}

async function loadLesson(lessonId) {
  currentLessonId = lessonId
  document.querySelectorAll('.sidebar-lesson-item').forEach(el => el.classList.remove('active'))
  const si = document.getElementById(`sidebar_${lessonId}`)
  if (si) si.classList.add('active')
  document.getElementById('lessonMain').innerHTML = '<div class="loading-state" style="padding:80px">กำลังโหลด...</div>'
  const [lessonRes, quizRes] = await Promise.all([api.lessons.getById(lessonId), api.quiz.getByLesson(lessonId)])
  const lesson  = lessonRes.data
  const quizzes = quizRes.data
  const isCompleted = !!progressMap[lessonId]
  const lessonIdx   = lessons.findIndex(l => l.id == lessonId)
  const prevLesson  = lessonIdx > 0 ? lessons[lessonIdx - 1] : null
  const nextLesson  = lessonIdx < lessons.length - 1 ? lessons[lessonIdx + 1] : null
  document.getElementById('lessonMain').innerHTML = `
    <div class="lesson-content">
      <div class="lesson-content-header">
        <h1 class="lesson-content-title">${lesson.title}</h1>
        <span class="lesson-complete-badge ${isCompleted ? 'badge-done' : 'badge-pending'}">${isCompleted ? '✅ เรียนแล้ว' : '○ ยังไม่เรียน'}</span>
      </div>
      <div class="video-wrap"><iframe src="${lesson.video_url}" frameborder="0" allowfullscreen class="video-frame"></iframe></div>
      ${lesson.description ? `<div class="lesson-desc-box"><p>${lesson.description}</p></div>` : ''}
      ${quizzes.length ? `
        <div class="quiz-section">
          <h2 class="quiz-section-title">🧩 แบบทดสอบ (${quizzes.length} ข้อ)</h2>
          ${quizzes.map((q, i) => `
            <div class="quiz-item" id="quiz_${q.id}">
              <p class="quiz-q-text">ข้อที่ ${i + 1}: ${q.question}</p>
              <div class="quiz-choices">
                ${(q.choices || []).map(c => `
                  <label class="quiz-choice-label" id="label_${c.id}">
                    <input type="radio" name="quiz_${q.id}" value="${c.id}" onchange="selectChoice(${q.id}, ${c.id})"/>
                    <span class="quiz-choice-text">${c.choice_text}</span>
                  </label>`).join('')}
              </div>
              <div class="quiz-result" id="result_${q.id}" style="display:none"></div>
            </div>`).join('')}
        </div>` : ''}
      <div class="lesson-nav">
        ${prevLesson ? `<button class="btn-nav" onclick="loadLesson(${prevLesson.id})">← ${prevLesson.title}</button>` : '<span></span>'}
        ${!isCompleted ? `<button class="btn-primary" style="padding:12px 28px" onclick="markComplete(${lessonId})">✓ บันทึกว่าเรียนแล้ว</button>` : `<span class="badge-done" style="padding:10px 20px;border-radius:999px">✅ เรียนแล้ว</span>`}
        ${nextLesson ? `<button class="btn-nav" onclick="loadLesson(${nextLesson.id})">บทถัดไป: ${nextLesson.title} →</button>` : '<span></span>'}
      </div>
    </div>`
}

async function selectChoice(quizId, choiceId) {
  const resultEl = document.getElementById(`result_${quizId}`)
  resultEl.style.display = 'none'
  try {
    const res  = await api.quiz.submit({ quiz_id: quizId, student_id: user.id, selected_choice_id: choiceId })
    const json = res.data
    resultEl.style.display = 'block'
    resultEl.className = `quiz-result ${json.is_correct ? 'quiz-result-correct' : 'quiz-result-wrong'}`
    resultEl.textContent = json.is_correct ? '✅ ถูกต้อง!' : '❌ ไม่ถูกต้อง ลองใหม่ได้'
    const selectedLabel = document.getElementById(`label_${choiceId}`)
    if (selectedLabel) selectedLabel.classList.add(json.is_correct ? 'choice-correct-selected' : 'choice-wrong-selected')
  } catch (e) {
    resultEl.style.display = 'block'
    resultEl.textContent = 'ไม่สามารถส่งคำตอบได้'
  }
}

async function markComplete(lessonId) {
  await api.progress.markComplete({ student_id: user.id, lesson_id: lessonId })
  progressMap[lessonId] = 1
  renderSidebar()
  loadLesson(lessonId)
}

async function logout() { await api.users.logout(); localStorage.removeItem('user'); location.href = '../../index.html' }
init()