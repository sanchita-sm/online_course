const user     = JSON.parse(localStorage.getItem('user') || '{}')
const params   = new URLSearchParams(location.search)
const courseId = params.get('course_id')
let currentLessonId = params.get('lesson_id') || null
let lessons = [], progressMap = {}

if (!user.id || user.role !== 'student') location.href = '../login/index.html'
if (!courseId) location.href = '../my-courses/index.html'
document.getElementById('navUsername').textContent = `${user.firstname || ''} ${user.lastname || ''}`

function getEmbedUrl(url) {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const gdMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`
  return url
}

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

  const lessonRes = await api.lessons.getById(lessonId)
  const lesson    = lessonRes.data

  // โหลด quiz
  let quizzes = []
  try {
    const quizRes = await api.quiz.getByLesson(lessonId)
    quizzes = quizRes.data
  } catch (e) { quizzes = [] }

  // โหลดประวัติการตอบของนักเรียน { quiz_id: { selected_choice_id, is_correct } }
  let attempts = {}
  if (quizzes.length) {
    try {
      const attRes = await api.quiz.getMyAttempts(lessonId, user.id)
      attRes.data.forEach(a => { attempts[a.quiz_id] = a })
    } catch (e) {}
  }

  // คำนวณคะแนน
  const attempted   = Object.values(attempts)
  const correct     = attempted.filter(a => a.is_correct).length
  const allAnswered = quizzes.length > 0 && attempted.length >= quizzes.length

  const scoreHtml = allAnswered ? `
    <div class="quiz-score-box">
      🎯 คะแนนของคุณ: <strong>${correct} / ${quizzes.length}</strong> ข้อ
      ${correct === quizzes.length
        ? '&nbsp;🎉 ยอดเยี่ยม!'
        : correct >= quizzes.length / 2
          ? '&nbsp;👍 ดีมาก!'
          : '&nbsp;💪 สู้ต่อไป!'}
    </div>` : ''

  const embedUrl    = getEmbedUrl(lesson.video_url)
  const isCompleted = !!progressMap[lessonId]
  const lessonIdx   = lessons.findIndex(l => l.id == lessonId)
  const prevLesson  = lessonIdx > 0 ? lessons[lessonIdx - 1] : null
  const nextLesson  = lessonIdx < lessons.length - 1 ? lessons[lessonIdx + 1] : null

  const quizHtml = quizzes.length ? `
    <div class="quiz-section">
      <h2 class="quiz-section-title">🧩 แบบทดสอบ (${quizzes.length} ข้อ)</h2>
      ${quizzes.map((q, i) => {
        const myAttempt  = attempts[q.id]
        const isAnswered = !!myAttempt
        return `
          <div class="quiz-item" id="quiz_${q.id}">
            <p class="quiz-q-text">ข้อที่ ${i + 1}: ${q.question}</p>
            <div class="quiz-choices">
              ${(q.choices || []).map(c => {
                let labelClass = 'quiz-choice-label'
                if (isAnswered) {
                  if (c.id === myAttempt.selected_choice_id) {
                    labelClass += myAttempt.is_correct ? ' choice-correct-selected' : ' choice-wrong-selected'
                  }
                  if (c.is_correct) labelClass += ' choice-show-answer'
                }
                return `
                  <label class="${labelClass}" id="label_${c.id}">
                    <input type="radio" name="quiz_${q.id}" value="${c.id}"
                      ${isAnswered
                        ? `disabled ${c.id === myAttempt.selected_choice_id ? 'checked' : ''}`
                        : `onchange="selectChoice(${q.id}, ${c.id})"`}/>
                    <span class="quiz-choice-text">${c.choice_text}</span>
                    ${isAnswered && c.is_correct
                      ? '<span style="color:#16a34a;font-size:12px;font-weight:600;margin-left:6px;">✓ เฉลย</span>'
                      : ''}
                  </label>`
              }).join('')}
            </div>
            ${isAnswered
              ? `<div class="quiz-result ${myAttempt.is_correct ? 'quiz-result-correct' : 'quiz-result-wrong'}">
                   ${myAttempt.is_correct ? '✅ ถูกต้อง!' : '❌ ไม่ถูกต้อง'}
                 </div>`
              : `<div class="quiz-result" id="result_${q.id}" style="display:none"></div>`}
          </div>`
      }).join('')}
      ${scoreHtml}
    </div>` : ''

  document.getElementById('lessonMain').innerHTML = `
    <div class="lesson-content">
      <div class="lesson-content-header">
        <h1 class="lesson-content-title">${lesson.title}</h1>
        <span class="lesson-complete-badge ${isCompleted ? 'badge-done' : 'badge-pending'}">
          ${isCompleted ? '✅ เรียนแล้ว' : '○ ยังไม่เรียน'}
        </span>
      </div>
      <div class="video-wrap">
        <iframe src="${embedUrl}" frameborder="0" allowfullscreen class="video-frame"></iframe>
      </div>
      ${lesson.description ? `<div class="lesson-desc-box"><p>${lesson.description}</p></div>` : ''}
      ${quizHtml}
      <div class="lesson-nav">
        ${prevLesson ? `<button class="btn-nav" onclick="loadLesson(${prevLesson.id})">← ${prevLesson.title}</button>` : '<span></span>'}
        ${!isCompleted
          ? `<button class="btn-primary" style="padding:12px 28px" onclick="markComplete(${lessonId})">✓ บันทึกว่าเรียนแล้ว</button>`
          : `<span class="badge-done" style="padding:10px 20px;border-radius:999px">✅ เรียนแล้ว</span>`}
        ${nextLesson ? `<button class="btn-nav" onclick="loadLesson(${nextLesson.id})">บทถัดไป: ${nextLesson.title} →</button>` : '<span></span>'}
      </div>
    </div>`
}

async function selectChoice(quizId, choiceId) {
  const resultEl = document.getElementById(`result_${quizId}`)
  resultEl.style.display = 'none'

  // disable radio ทันทีเพื่อป้องกันกดซ้ำ
  document.querySelectorAll(`input[name="quiz_${quizId}"]`).forEach(el => el.disabled = true)

  try {
    const res  = await api.quiz.submit({ quiz_id: quizId, student_id: user.id, selected_choice_id: choiceId })
    const json = res.data

    resultEl.style.display = 'block'
    resultEl.className  = `quiz-result ${json.is_correct ? 'quiz-result-correct' : 'quiz-result-wrong'}`
    resultEl.textContent = json.is_correct ? '✅ ถูกต้อง!' : '❌ ไม่ถูกต้อง'

    const selectedLabel = document.getElementById(`label_${choiceId}`)
    if (selectedLabel) selectedLabel.classList.add(json.is_correct ? 'choice-correct-selected' : 'choice-wrong-selected')
    
    if (!json.is_correct) {
      const quizRes = await api.quiz.getByLesson(currentLessonId)
      const quiz    = quizRes.data.find(q => q.id == quizId)
      if (quiz) {
        quiz.choices.forEach(c => {
          if (c.is_correct) {
            const lbl = document.getElementById(`label_${c.id}`)
            if (lbl) {
              lbl.classList.add('choice-show-answer')
              if (!lbl.querySelector('.answer-tag')) {
                lbl.insertAdjacentHTML('beforeend',
                  '<span class="answer-tag" style="color:#16a34a;font-size:12px;font-weight:600;margin-left:6px;">✓ เฉลย</span>')
              }
            }
          }
        })
      }
    }

    checkAndShowScore()

  } catch (e) {
    document.querySelectorAll(`input[name="quiz_${quizId}"]`).forEach(el => el.disabled = false)
    resultEl.style.display = 'block'
    resultEl.className  = 'quiz-result'
    resultEl.textContent = 'ไม่สามารถส่งคำตอบได้'
  }
}

function checkAndShowScore() {
  const allItems    = document.querySelectorAll('.quiz-item')
  const answeredItems = document.querySelectorAll('.quiz-result.quiz-result-correct, .quiz-result.quiz-result-wrong')

  if (answeredItems.length < allItems.length) return

  // นับคะแนน
  const correct = document.querySelectorAll('.quiz-result.quiz-result-correct').length
  const total   = allItems.length
  const msg     = correct === total ? '🎉 ยอดเยี่ยม!' : correct >= total / 2 ? '👍 ดีมาก!' : '💪 สู้ต่อไป!'

  if (!document.getElementById('scoreBox')) {
    const quizSection = document.querySelector('.quiz-section')
    if (quizSection) {
      quizSection.insertAdjacentHTML('beforeend', `
        <div class="quiz-score-box" id="scoreBox">
          🎯 คะแนนของคุณ: <strong>${correct} / ${total}</strong> ข้อ &nbsp;${msg}
        </div>`)
    }
  }
}

async function markComplete(lessonId) {
  await api.progress.markComplete({ student_id: user.id, lesson_id: lessonId })
  progressMap[lessonId] = 1
  renderSidebar()
  loadLesson(lessonId)
}

async function logout() {
  await api.users.logout()
  localStorage.removeItem('user')
  location.href = '../../index.html'
}

init()