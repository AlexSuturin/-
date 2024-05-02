'use strict'

// получение тега таблицы с маршрутами
const routesTable = document.getElementById('table-routes')
// получение тега маршрутов с для вывода пагинации
const routesArticle = document.getElementById('routes')
// получение тега для выбора маршрута
const routeSelect = document.getElementById('route-select')

// количество элементов на странице
const itemsPerPage = 5
// текущая страница
let currentPage = 1
// массив данных о маршрутах
let routesData = []

const API_KEY = '9c1137b1-0cc9-4f15-9def-fb82f3a67bcc'

// функция для вывода маршрутов на страницу
function displayItems (page, data) {
	// начальный индекс элемента на странице
  const startIndex = (page - 1) * itemsPerPage
	// конечный индекс элемента на странице
  const endIndex = startIndex + itemsPerPage

	// получение элементов для текущей страницы(пагинации)
  const paginatedData = data.slice(startIndex, endIndex)

	// очистка таблицы от старых данных
	// и добавление новых данных
	// здесь пишется заголовок таблицы
  routesTable.innerHTML = `
    <thead class="table-primary text-center">
      <td class="fw-bold" style="background-color: #c76c34; color: white; border-radius: 10px 0 0 0">Название</td>
      <td class="fw-bold" style="background-color: #c76c34; color: white">Описание</td>
      <td class="fw-bold" style="background-color: #c76c34; color: white">Основные объекты</td>
      <td style="background-color: #c76c34; color: white; border-radius: 0 10px 0 0"></td>
    </thead>
    `

		// затем для каждого элемента массива данных о маршрутах добавляется строка в таблицу
  paginatedData.forEach(item => {
    routesTable.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>${item.mainObject}</td>
        <td><button class="btn btn-primary align-self-center" onclick="fetchGuides(${item.id}, '${item.name}')">
          Выбрать
        </button></td>
      </tr>
    `
  })
}

// функция для выбора маршрутов (вызывается при изменении значения в поле выбора маршрута в html)
function selectRoutes () {
	// если выбрано значение в поле выбора маршрута
  if (routeSelect.value !== '') {
		// то фильтруем данные о маршрутах по названию маршрута (поиск по названию) и выводим данные на страницу
    let currData = routesData.filter(item => item.name.toLowerCase().includes(routeSelect.value.toLowerCase()))
    console.log(currData)
    currentPage = 1
    displayItems(currentPage, currData)
  }
}

// функция для получения данных о маршрутах
function fetchRoutes () {
	// получение данных о маршрутах с сервера
  fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${API_KEY}`)
	// преобразование данных в json
    .then(response => response.json())
		// обработка данных
    .then(data => {
			// сохранение данных о маршрутах в переменную
      routesData = data
			// вывод данных на страницу
      displayItems(currentPage, data)

			// создание пагинации
			// вычисление общего количества страниц
      const totalPages = Math.ceil(data.length / itemsPerPage)
			// создание контейнера для пагинации
      const paginationContainer = document.createElement('nav')
      paginationContainer.setAttribute('aria-label', '...')

			// создание списка для пагинации
      const paginationList = document.createElement('ul')
      paginationList.classList.add('pagination', 'row')

			// создание кнопки "Назад"
      const previousButton = document.createElement('li')
			// добавление классов для кнопки (для бутстрапа)
      previousButton.classList.add('page-item', 'page-item', 'col-2', 'col-md-auto', 'col-sm-auto', 'm-0', 'p-0', 'text-center')
      const previousLink = document.createElement('a')
      previousLink.classList.add('page-link')
      previousLink.href = '#routes'
      previousLink.innerText = 'Назад'
			// добавление кнопки "Назад" в список
      previousButton.appendChild(previousLink)
      paginationList.appendChild(previousButton)

			// добавление логики для кнопки "Назад"
      previousLink.addEventListener('click', () => {
				// если текущая страница больше 1
        if (currentPage > 1) {
					// уменьшаем текущую страницу на 1
          currentPage--
					// выводим данные на страницу
          displayItems(currentPage, data)

					// для всех элементов пагинации убираем класс "active" (подсвечивание текущей страницы)
          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))

					// добавляем класс "active" для текущей страницы (подсвечиваем текущую страницу)
          const currentPageItem = paginationList.querySelector(`li:nth-child(${currentPage + 1})`)
          currentPageItem.classList.add('active')
        }
      })

			// добавление кнопок для каждой страницы пагинации (1, 2, 3, ...)
      for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li')
        pageItem.classList.add('page-item', 'page-item', 'col-2', 'col-md-auto', 'col-sm-auto', 'm-0', 'p-0', 'text-center')

        const pageLink = document.createElement('a')
        pageLink.classList.add('page-link')
        pageLink.href = '#routes'
        pageLink.innerText = i

				// если текущая страница равна i, то добавляем класс "active" (подсвечиваем текущую страницу)
        if (i === currentPage) {
          pageItem.classList.add('active')
        }

				// добавление логики для кнопки страницы
        pageLink.addEventListener('click', () => {
					// устанавливаем текущую страницу в i
          currentPage = i
					// выводим данные на страницу
          displayItems(currentPage, data)

					// убираем класс "active" у всех элементов пагинации
          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))
					// добавляем класс "active" для текущей страницы
          pageItem.classList.add('active')
        })

				// добавляем кнопку страницы в список
        pageItem.appendChild(pageLink)
        paginationList.appendChild(pageItem)
      }

			// добавление кнопки "Вперед"
      const nextButton = document.createElement('li')
			// добавление классов для кнопки (для бутстрапа)
      nextButton.classList.add('page-item', 'page-item', 'col-2', 'col-md-auto', 'col-sm-auto', 'm-0', 'p-0', 'text-center')
      const nextLink = document.createElement('a')
      nextLink.classList.add('page-link')
      nextLink.href = '#routes'
      nextLink.innerText = 'Вперед'
			// добавление кнопки "Вперед" в список
      nextButton.appendChild(nextLink)
      paginationList.appendChild(nextButton)

			// добавление логики для кнопки "Вперед"
      nextLink.addEventListener('click', () => {
				// если текущая страница меньше последней страницы
        if (currentPage < totalPages) {
					// увеличиваем текущую страницу на 1
          currentPage++
					// выводим данные на страницу
          displayItems(currentPage, data)

					// убираем класс "active" у всех элементов пагинации
          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))

					// добавляем класс "active" для текущей страницы
          const currentPageItem = paginationList.querySelector(`li:nth-child(${currentPage + 1})`)
          currentPageItem.classList.add('active')
        }
      })

			// добавление элементов пагинации на страницу
      paginationContainer.appendChild(paginationList)
      routesArticle.appendChild(paginationContainer)
    })
	// обработка ошибки
    .catch(error => {
      console.error('Ошибка:', error)
    })
}

// вызов функции получения данных о маршрутах при загрузке страницы
window.onload = function () {
  fetchRoutes()
}
