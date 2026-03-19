document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const btn = document.getElementById('submitBtn')
  const errEl = document.getElementById('alertError')
  const sucEl = document.getElementById('alertSuccess')
  errEl.style.display = 'none'
  sucEl.style.display = 'none'
  btn.textContent = 'กำลังสมัคร...'
  btn.disabled = true

  try {
    await api.users.register({
      firstname: document.getElementById('firstname').value.trim(),
      lastname:  document.getElementById('lastname').value.trim(),
      email:     document.getElementById('email').value.trim(),
      password:  document.getElementById('password').value,
      role:      document.querySelector('input[name="role"]:checked').value
    })
    sucEl.textContent = 'สมัครสมาชิกสำเร็จ! กำลังไปหน้าเข้าสู่ระบบ...'
    sucEl.style.display = 'block'
    setTimeout(() => location.href = '../login/index.html', 1500)
  } catch (err) {
    errEl.textContent = err.response?.data?.errors?.join(', ') || err.response?.data?.message || 'เกิดข้อผิดพลาด'
    errEl.style.display = 'block'
  }

  btn.textContent = 'สมัครสมาชิก'
  btn.disabled = false
})
