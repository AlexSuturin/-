'use strict'

// получение тега таблицы с маршрутами
const routesTable = document.getElementById('table-routes')
// получение тега маршрутов с для вывода пагинации
const routesArticle = document.getElementById('routes')
// получение тега для выбора маршрута
const routeSelect = document.getElementById('route-select')

const itemsPerPage = 5
let currentPage = 1
let routesData = []

const API_KEY = '9c1137b1-0cc9-4f15-9def-fb82f3a67bcc'

// функция для вывода маршрутов на страницу
function displayItems (page, data) {
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

	// получение элементов для текущей страницы(пагинации)
  const paginatedData = data.slice(startIndex, endIndex)

  routesTable.innerHTML = `
    <thead class="table-primary text-center">
      <td class="fw-bold" style="background-color: #c76c34; color: white; border-radius: 10px 0 0 0">Название</td>
      <td class="fw-bold" style="background-color: #c76c34; color: white">Описание</td>
      <td class="fw-bold" style="background-color: #c76c34; color: white">Основные объекты</td>
      <td style="background-color: #c76c34; color: white; border-radius: 0 10px 0 0"></td>
    </thead>
    `

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
  if (routeSelect.value !== '') {
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
    .then(response => response.json())
    .then(data => {
      routesData = data
      displayItems(currentPage, data)

			// создание пагинации
			// вычисление общего количества страниц
      const totalPages = Math.ceil(data.length / itemsPerPage)
      const paginationContainer = document.createElement('nav')
      paginationContainer.setAttribute('aria-label', '...')

      const paginationList = document.createElement('ul')
      paginationList.classList.add('pagination', 'row')

			// создание кнопки "Назад"
      const previousButton = document.createElement('li')
      previousButton.classList.add('page-item', 'page-item', 'col-2', 'col-md-auto', 'col-sm-auto', 'm-0', 'p-0', 'text-center')
      const previousLink = document.createElement('a')
      previousLink.classList.add('page-link')
      previousLink.href = '#routes'
      previousLink.innerText = 'Назад'
      previousButton.appendChild(previousLink)
      paginationList.appendChild(previousButton)

			// добавление логики для кнопки "Назад"
      previousLink.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--
          displayItems(currentPage, data)
          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))

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
        if (i === currentPage) {
          pageItem.classList.add('active')
        }

				// добавление логики для кнопки страницы
        pageLink.addEventListener('click', () => {
          currentPage = i
          displayItems(currentPage, data)

          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))
          pageItem.classList.add('active')
        })
        pageItem.appendChild(pageLink)
        paginationList.appendChild(pageItem)
      }

			// добавление кнопки "Вперед"
      const nextButton = document.createElement('li')
      nextButton.classList.add('page-item', 'page-item', 'col-2', 'col-md-auto', 'col-sm-auto', 'm-0', 'p-0', 'text-center')
      const nextLink = document.createElement('a')
      nextLink.classList.add('page-link')
      nextLink.href = '#routes'
      nextLink.innerText = 'Вперед'
      nextButton.appendChild(nextLink)
      paginationList.appendChild(nextButton)

			// добавление логики для кнопки "Вперед"
      nextLink.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++
          displayItems(currentPage, data)

          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))

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
