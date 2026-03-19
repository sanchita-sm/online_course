const user   = JSON.parse(localStorage.getItem('user') || '{}')
const params = new URLSearchParams(location.search)
const editId = params.get('edit')

if (!user.id || user.role !== 'teacher') location.href = '../login/index.html'
document.getElementById('navUsername').textContent = `${user.firstname || ''} ${user.lastname || ''}`
if (editId) {
  document.getElementById('pageTitle').textContent = 'แก้ไขคอร์ส'
  document.getElementById('submitBtn').textContent = 'บันทึกการแก้ไข'
}

async function loadDropdowns() {
  const [catRes, levRes] = await Promise.all([api.categories.getAll(), api.levels.getAll()])
  catRes.data.forEach(c => {
    const opt = document.createElement('option')
    opt.value = c.id; opt.textContent = c.category
    document.getElementById('category_id').appendChild(opt)
  })
  levRes.data.forEach(l => {
    const opt = document.createElement('option')
    opt.value = l.id; opt.textContent = l.level
    document.getElementById('level_id').appendChild(opt)
  })
  if (editId) {
    const res = await api.courses.getById(editId)
    const c = res.data
    document.getElementById('title').value       = c.title || ''
    document.getElementById('description').value = c.description || ''
    document.getElementById('category_id').value = c.category_id || ''
    document.getElementById('level_id').value    = c.level_id || ''
  }
}

async function loadMyCourses() {
  const res  = await api.courses.getAll()
  const mine = res.data.filter(c => c.teacher_id == user.id)
  const list = document.getElementById('myCourseList')
  if (!mine.length) { list.innerHTML = '<div class="empty-state" style="padding:24px">ยังไม่มีคอร์ส</div>'; return }
  list.innerHTML = mine.map(c => `
    <div class="manage-course-item ${editId == c.id ? 'active' : ''}">
      <div class="manage-course-info">
        <span class="manage-course-title">${c.title}</span>
      </div>
      <div class="manage-course-btns">
        <a href="../lesson-manage/index.html?course_id=${c.id}" class="manage-btn">📝</a>
        <a href="index.html?edit=${c.id}" class="manage-btn">✏️</a>
        <button class="manage-btn manage-btn-del" onclick="deleteCourse(${c.id})">🗑️</button>
      </div>
    </div>
  `).join('')
}

document.getElementById('courseForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const btn   = document.getElementById('submitBtn')
  const errEl = document.getElementById('alertError')
  const sucEl = document.getElementById('alertSuccess')
  errEl.style.display = 'none'; sucEl.style.display = 'none'
  btn.disabled = true; btn.textContent = 'กำลังบันทึก...'

  const data = {
    title:       document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    category_id: parseInt(document.getElementById('category_id').value),
    level_id:    parseInt(document.getElementById('level_id').value),
    teacher_id:  user.id
  }

  try {
    const res = editId ? await api.courses.update(editId, data) : await api.courses.create(data)
    sucEl.textContent = editId ? 'แก้ไขคอร์สสำเร็จ!' : 'สร้างคอร์สสำเร็จ!'
    sucEl.style.display = 'block'
    loadMyCourses()
    if (!editId) {
      document.getElementById('courseForm').reset()
      const newId = res.data?.data?.insertId
      if (newId) setTimeout(() => location.href = `../lesson-manage/index.html?course_id=${newId}`, 1200)
    }
  } catch (err) {
    errEl.textContent = err.response?.data?.errors?.join(', ') || err.response?.data?.message || 'เกิดข้อผิดพลาด'
    errEl.style.display = 'block'
  }
  btn.disabled = false
  btn.textContent = editId ? 'บันทึกการแก้ไข' : 'บันทึกคอร์ส'
})

async function deleteCourse(id) {
  if (!confirm('ต้องการลบคอร์สนี้?')) return
  await api.courses.remove(id)
  loadMyCourses()
  if (editId == id) location.href = 'index.html'
}

async function logout() { await api.users.logout(); localStorage.removeItem('user'); location.href = '../../index.html' }

loadDropdowns()
loadMyCourses()