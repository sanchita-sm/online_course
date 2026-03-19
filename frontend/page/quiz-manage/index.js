const user     = JSON.parse(localStorage.getItem('user') || '{}')
const params   = new URLSearchParams(location.search)
const lessonId = params.get('lesson_id')

if (!user.id || user.role !== 'teacher') location.href = '../login/index.html'
if (!lessonId) location.href = '../teacher-dashboard/index.html'
document.getElementById('navUsername').textContent = `${user.firstname || ''} ${user.lastname || ''}`

async function init() {
  const res    = await api.lessons.getById(lessonId)
  const lesson = res.data
  document.getElementById('lessonTitle').textContent      = `Quiz: ${lesson.title}`
  document.getElementById('breadcrumbLesson').textContent = lesson.title
  document.getElementById('breadcrumbLesson').href        = `../lesson-manage/index.html?course_id=${lesson.course_id}`
  loadQuizzes()
}

async function loadQuizzes() {
  const res    = await api.quiz.getByLesson(lessonId)
  const quizzes = res.data
  const wrap   = document.getElementById('quizListWrap')
  if (!quizzes.length) { wrap.innerHTML = '<div class="empty-state">ยังไม่มีคำถาม</div>'; return }
  wrap.innerHTML = `<div class="quiz-manage-list">${quizzes.map((q, i) => `
    <div class="quiz-manage-item">
      <div class="quiz-manage-header">
        <span class="quiz-num">ข้อที่ ${i + 1}</span>
        <div class="quiz-manage-actions">
          <button class="manage-btn" onclick='editQuiz(${JSON.stringify(q)})'>✏️ แก้ไข</button>
          <button class="manage-btn manage-btn-del" onclick="deleteQuiz(${q.id})">🗑️ ลบ</button>
        </div>
      </div>
      <p class="quiz-question-text">${q.question}</p>
      <div class="quiz-choices-preview">
        ${(q.choices || []).map(c => `<span class="quiz-choice-tag ${c.is_correct ? 'choice-correct' : ''}">${c.is_correct ? '✓' : '○'} ${c.choice_text}</span>`).join('')}
      </div>
    </div>
  `).join('')}</div>`
}

let choiceCount = 0
function addChoice(text = '', isCorrect = false) {
  choiceCount++
  const id  = `choice_${choiceCount}`
  const div = document.createElement('div')
  div.className = 'choice-row'; div.id = `row_${id}`
  div.innerHTML = `
    <input type="radio" name="correctChoice" value="${id}" ${isCorrect ? 'checked' : ''} class="choice-radio"/>
    <input type="text" id="${id}" class="form-input choice-input" placeholder="ตัวเลือก..." value="${text}" required/>
    <button type="button" class="choice-del" onclick="document.getElementById('row_${id}').remove()">✕</button>
  `
  document.getElementById('choicesWrap').appendChild(div)
}

function openQuizModal(quiz = null) {
  document.getElementById('quizModal').style.display    = 'flex'
  document.getElementById('quizModalError').style.display = 'none'
  document.getElementById('choicesWrap').innerHTML = ''
  choiceCount = 0
  if (quiz) {
    document.getElementById('quizModalTitle').textContent  = 'แก้ไขคำถาม'
    document.getElementById('quizSubmitBtn').textContent   = 'บันทึกการแก้ไข'
    document.getElementById('quizQuestion').value = quiz.question
    document.getElementById('quizEditId').value   = quiz.id
    ;(quiz.choices || []).forEach(c => addChoice(c.choice_text, c.is_correct))
  } else {
    document.getElementById('quizModalTitle').textContent = 'เพิ่มคำถาม'
    document.getElementById('quizSubmitBtn').textContent  = 'บันทึก'
    document.getElementById('quizQuestion').value = ''
    document.getElementById('quizEditId').value   = ''
    addChoice(); addChoice(); addChoice(); addChoice()
  }
}
function editQuiz(quiz) { openQuizModal(quiz) }
function closeQuizModal() { document.getElementById('quizModal').style.display = 'none' }
function closeModal(e) { if (e.target.id === 'quizModal') closeQuizModal() }

document.getElementById('quizForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const editId  = document.getElementById('quizEditId').value
  const errEl   = document.getElementById('quizModalError')
  errEl.style.display = 'none'
  const rows      = document.querySelectorAll('.choice-row')
  const correctId = document.querySelector('input[name="correctChoice"]:checked')?.value
  const choices   = Array.from(rows).map(row => {
    const inputId = row.id.replace('row_', '')
    return { choice_text: document.getElementById(inputId)?.value.trim(), is_correct: inputId === correctId }
  }).filter(c => c.choice_text)
  if (!choices.some(c => c.is_correct)) {
    errEl.textContent = 'กรุณาเลือกคำตอบที่ถูกต้องอย่างน้อย 1 ข้อ'
    errEl.style.display = 'block'; return
  }
  try {
    const data = { lesson_id: parseInt(lessonId), question: document.getElementById('quizQuestion').value.trim(), choices }
    if (editId) await api.quiz.update(editId, data)
    else        await api.quiz.create(data)
    closeQuizModal(); loadQuizzes()
  } catch (err) {
    errEl.textContent = err.response?.data?.message || 'เกิดข้อผิดพลาด'
    errEl.style.display = 'block'
  }
})

async function deleteQuiz(id) {
  if (!confirm('ต้องการลบคำถามนี้?')) return
  await api.quiz.remove(id); loadQuizzes()
}

async function logout() { await api.users.logout(); localStorage.removeItem('user'); location.href = '../../index.html' }
init()