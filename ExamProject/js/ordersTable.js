'use strict'

// получение тега таблицы с заказами
const ordersTable = document.getElementById('table-orders')
const ordersArticle = document.getElementById('orders')

// количество элементов на странице для пагинации
const itemsPerPage = 5
let currentPage = 1
let i = 1

// id текущего заказа ()
let currentOrderId = null

const API_KEY = '9c1137b1-0cc9-4f15-9def-fb82f3a67bcc'

// функция для получения заказов
function fetchOrders () {
	// получение данных о заказах
  fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
			// сортировка заказов по убыванию id
      data.sort((a, b) => b.id - a.id)

			// вывод заказов на страницу
      displayOrders(data)

// пагинация
// количество страниц
      const totalPages = Math.ceil(data.length / itemsPerPage)
			// контейнер для пагинации
      const paginationContainer = document.createElement('nav')
      paginationContainer.setAttribute('aria-label', '...')

			// создание списка для пагинации
      const paginationList = document.createElement('ul')
      paginationList.classList.add('pagination')

			// кнопка "Назад"
      const previousButton = document.createElement('li')
      previousButton.classList.add('page-item')
      const previousLink = document.createElement('a')
      previousLink.classList.add('page-link')
      previousLink.href = '#routes'
      previousLink.innerText = 'Назад'
      previousButton.appendChild(previousLink)
      paginationList.appendChild(previousButton)

			// логика для кнопки "Назад"
      previousLink.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--
          displayOrders(data)

          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))

          const currentPageItem = paginationList.querySelector(`li:nth-child(${currentPage + 1})`)
          currentPageItem.classList.add('active')
        }
      })

			// кнопки для каждой страницы пагинации (1, 2, 3, ...)
      for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li')
        pageItem.classList.add('page-item')

        const pageLink = document.createElement('a')
        pageLink.classList.add('page-link')
        pageLink.href = '#routes'
        pageLink.innerText = i

				// подсветка текущей страницы
        if (i === currentPage) {
          pageItem.classList.add('active')
        }

				// логика для кнопок страниц
        pageLink.addEventListener('click', () => {
          currentPage = i
          displayOrders(data)

          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))
          pageItem.classList.add('active')
        })

        pageItem.appendChild(pageLink)
        paginationList.appendChild(pageItem)
      }

			// кнопка "Вперед"
      const nextButton = document.createElement('li')
      nextButton.classList.add('page-item')
      const nextLink = document.createElement('a')
      nextLink.classList.add('page-link')
      nextLink.href = '#routes'
      nextLink.innerText = 'Вперед'
      nextButton.appendChild(nextLink)
      paginationList.appendChild(nextButton)

			// логика для кнопки "Вперед"
      nextLink.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++
          displayOrders(data)

          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))

          const currentPageItem = paginationList.querySelector(`li:nth-child(${currentPage + 1})`)
          currentPageItem.classList.add('active')
        }
      })

			// добавление пагинации на страницу
      paginationContainer.appendChild(paginationList)
      ordersArticle.appendChild(paginationContainer)
    })
    .catch(e => console.log(e))
}

// функция для вывода заказов на страницу
function displayOrders (data) {
	// начальный и конечный индексы для пагинации
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
	// данные для текущей страницы
  const paginatedData = data.slice(startIndex, endIndex)

	// индекс для нумерации заказов
  i = startIndex + 1

	// если заказов нет
	// выводим сообщение "Нет заказов"
  if (paginatedData.length === 0) {
    ordersTable.innerHTML = `
    <thead class="table-primary">
      <td class="fw-bold" style="background: #c76a30 !important; color: white;border-radius: 10px 0 0 0">№</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Название маршрута</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Дата</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Стоимость</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white;border-radius: 0 10px 0 0"></td>
    </thead>
    `
    ordersTable.innerHTML += `
      <tr>
        <td colspan="5" class="text-center"><h4 class="mb-0">Нет заказов</h4></td>
      </tr>
    `
    return
  }

	// вывод заказов на страницу
	// вывод сначала заголовков таблицы
  ordersTable.innerHTML = `
    <thead class="table-primary">
      <td class="fw-bold" style="background: #c76a30 !important; color: white;border-radius: 10px 0 0 0">№</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Название маршрута</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Дата</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Стоимость</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white;border-radius: 0 10px 0 0"></td>
    </thead>
    `

		// затем для каждого заказа добавляется строка в таблицу
  const routeIds = new Set()
  data.forEach(item => {
    routeIds.add(item.route_id)
  })

	// объект для хранения названий маршрутов
  const routeNames = {}
	// запросы для получения названий маршрутов
  const requests = Array.from(routeIds).map(id =>
    fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/' + id + '?api_key=' + API_KEY)
      .then(response => response.json())
      .then(data => {
				// сохранение названий маршрутов в объект
        routeNames[id] = data.name
      })
      .catch(e => console.log(e))
  )

	// ожидание завершения всех запросов
  Promise.all(requests)
	// вывод заказов на страницу
    .then(() => {
			// вывод заказов на страницу (строки таблицы)
      paginatedData.forEach(item => {
				//выводится информация во 2 столбце, а в 3 столбце - кнопки для просмотра, редактирования и удаления заказа
        ordersTable.innerHTML += `
          <tr>
            <td>${item.id}</td>
            <td>${routeNames[item.route_id]}</td>
            <td>${item.date}</td>
            <td>${item.price}</td>
            <td>
            <button class="border-0 bg-transparent align-self-center" data-bs-toggle="modal" data-bs-target="#info-order-modal" onclick="infoOrder(${item.id}, ${item.route_id}, '${routeNames[item.route_id]}')">
                <img src="../img/icons/show.png" alt="Информация" class="img-order">
            </button>
            <button class="border-0 bg-transparent align-self-center" data-bs-toggle="modal" data-bs-target="#update-order-modal" onclick="updateOrder(${item.id}, ${item.route_id}, '${routeNames[item.route_id]}')">
                <img src="../img/icons/pen.png" alt="Редактировать" class="img-order">
            </button>
            <button class="border-0 bg-transparent align-self-center" data-bs-toggle="modal" data-bs-target="#delete-order-modal" onclick="currentOrderId = ${item.id};">
                <img src="../img/icons/bin.png" alt="Удалить" class="img-order">
            </button>
            </td>
          </tr>
        `
        i++
      })
    })
}

window.onload = function () {
  fetchOrders()
}
