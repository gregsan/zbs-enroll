async function loadCourses() {
  try {
    const response = await fetch('courses.json');
    const coursesData = await response.json();
    renderCourses(coursesData, 'online'); // Показываем онлайн-курсы по умолчанию
    setupFilters(coursesData);
  } catch (error) {
    console.error('Ошибка загрузки данных курсов:', error);
  }
}

function renderCourses(coursesData, filter = 'all') {
  const coursesContainer = document.getElementById('courses');
  coursesContainer.innerHTML = '';
  const filtered = filter === 'all' ? coursesData : coursesData.filter(course => course.label === filter);

  let lastGroup = null;

  filtered.forEach(course => {
    if (course.monthGroup && course.monthGroup !== lastGroup) {
      lastGroup = course.monthGroup;
      const separator = document.createElement('div');
      separator.className = 'text-lg font-semibold text-gray-700 mt-4 mb-2 border-b border-gray-300 pb-1';
      separator.textContent = course.monthGroup;
      coursesContainer.appendChild(separator);
    }

    const card = document.createElement('div');
    card.className = 'course-card bg-white text-black rounded-xl p-5 shadow-md animate-slideUp hover:scale-[1.01] transition-transform';
    card.innerHTML = `
      <div class="flex justify-between items-center mb-3 text-gray-700">
        <h3 class="text-2xl font-semibold">${course.title}</h3>
        <span class="text-xs px-2 py-1 rounded-full ${course.label === 'online' ? 'bg-online text-white' : 'bg-recorded text-white'}">${course.label}</span>
      </div>
      ${course.label === 'online' ? `
        <p class="text-md mb-1 font-medium text-gray-600">Старт: <span class="font-normal">${course.start}</span></p>
        <p class="text-md mb-1 font-medium text-gray-600">Длительность: <span class="font-normal">${course.duration}</span></p>`
        : `
        <p class="text-md mb-1 font-medium text-gray-600">Занятий: ${course.lessons}</p>
        <p class="text-md mb-1 font-medium text-gray-600">Выпускников: ${course.graduates}</p>`}
      <p class="text-md mb-3 mt-1 leading-relaxed text-gray-600">${course.description}</p>
      <div class="flex gap-2">
        <a href="${course.signupUrl}" class="bg-primary text-white py-1.5 px-4 text-sm rounded-lg hover:opacity-90 transition-all">Записаться</a>
        <a href="${course.detailsUrl}" class="border border-primary text-primary py-1.5 px-4 text-sm rounded-lg hover:bg-primary hover:text-white transition-all">Подробнее</a>
      </div>
    `;
    coursesContainer.appendChild(card);
  });
}

function setupFilters(coursesData) {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('bg-primary', 'text-white'));
      btn.classList.add('bg-primary', 'text-white');
      const filter = btn.getAttribute('data-filter');
      renderCourses(coursesData, filter);
    });
  });

  document.querySelector('[data-filter="online"]').classList.add('bg-primary', 'text-white');
}

document.addEventListener('DOMContentLoaded', loadCourses);