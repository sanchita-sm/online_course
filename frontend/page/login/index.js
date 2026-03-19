document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const btn = document.getElementById('submitBtn')
  const errEl = document.getElementById('alertError')
  errEl.style.display = 'none'
  btn.textContent = 'กำลังเข้าสู่ระบบ...'
  btn.disabled = true

  try {
    const res = await api.users.login({
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value
    })
    const user = res.data.data
    localStorage.setItem('user', JSON.stringify(user))
    if (user.role === 'teacher') {
      location.href = '../teacher-dashboard/index.html'
    } else {
      location.href = '../student-dashboard/index.html'
    }
  } catch (err) {
    errEl.textContent = err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
    errEl.style.display = 'block'
  }

  btn.textContent = 'เข้าสู่ระบบ'
  btn.disabled = false
})
