let allCourses = []

async function loadCourses() {
  try {
    const res = await api.courses.getAll()
    allCourses = res.data
    filterCourses()
  } catch (e) {
    document.getElementById('coursesGrid').innerHTML = '<div class="empty-state">ไม่สามารถโหลดคอร์สได้</div>'
  }
}

function renderCourses(courses) {
  const grid = document.getElementById('coursesGrid')
  document.getElementById('coursesCount').textContent = `พบ ${courses.length} คอร์ส`
  if (!courses.length) {
    grid.innerHTML = '<div class="empty-state">ไม่พบคอร์สที่ค้นหา</div>'
    return
  }
  grid.innerHTML = courses.map(c => `
    <a href="../course-detail/index.html?id=${c.id}" class="course-card">
      <div class="course-card-img">📖</div>
      <div class="course-card-body">
        <div class="course-card-tags">
          <span class="tag tag-category">${c.category_id}</span>
          <span class="tag tag-level">${c.level_id}</span>
        </div>
        <h3 class="course-card-title">${c.title}</h3>
        <p class="course-card-desc">${c.description || 'ไม่มีคำอธิบาย'}</p>
      </div>
    </a>
  `).join('')
}

function filterCourses() {
  const category = document.querySelector('input[name="category"]:checked')?.value || ''
  const level    = document.querySelector('input[name="level"]:checked')?.value || ''
  const keyword  = document.getElementById('searchInput').value.toLowerCase()
  const sort     = document.getElementById('sortSelect').value

  let filtered = allCourses.filter(c => {
    const matchCat  = !category || String(c.category_id) === category
    const matchLvl  = !level    || String(c.level_id)    === level
    const matchKey  = !keyword  || c.title.toLowerCase().includes(keyword)
    return matchCat && matchLvl && matchKey
  })

  if (sort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title, 'th'))
  renderCourses(filtered)
}

function doSearch() {
  const q = document.getElementById('searchInput').value.trim()
  if (q) location.href = `../search/index.html?q=${encodeURIComponent(q)}`
}

document.getElementById('searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch() })
document.querySelectorAll('input[name="category"], input[name="level"]').forEach(el => el.addEventListener('change', filterCourses))
document.getElementById('sortSelect').addEventListener('change', filterCourses)

loadCourses()
