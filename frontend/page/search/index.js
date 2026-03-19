const params  = new URLSearchParams(location.search)
const keyword = params.get('q') || ''

if (keyword) {
  document.getElementById('searchBig').value = keyword
  document.getElementById('searchHeading').textContent = `ผลการค้นหา "${keyword}"`
}

async function loadSearch() {
  if (!keyword) {
    document.getElementById('resultsGrid').innerHTML = '<div class="empty-state">กรุณาพิมพ์คำค้นหา</div>'
    return
  }
  try {
    const res = await api.courses.search(keyword)
    const courses = res.data
    const grid = document.getElementById('resultsGrid')
    if (!courses.length) {
      grid.innerHTML = `<div class="empty-state">ไม่พบคอร์สที่ตรงกับ "${keyword}"</div>`
      return
    }
    document.getElementById('searchHeading').textContent = `ผลการค้นหา "${keyword}" (${courses.length} คอร์ส)`
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
  } catch (e) {
    document.getElementById('resultsGrid').innerHTML = '<div class="empty-state">ไม่สามารถค้นหาได้</div>'
  }
}

function doSearch() {
  const q = document.getElementById('searchBig').value.trim()
  if (q) location.href = `index.html?q=${encodeURIComponent(q)}`
}
document.getElementById('searchBig').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch() })

loadSearch()