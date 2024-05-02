// функция для получения информации о заказе по его id
function infoOrder (id, routeId, currRouteName) {
	// создание ссылки для запроса
  const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/' + id + '?api_key=' + API_KEY

	// отправка запроса на сервер
  fetch(url)
	// обработка ответа
    .then(response => response.json())
		// обработка данных
    .then(data => {
			// получение данных о гиде по id гида
      const guideUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides/' + data.guide_id + '?api_key=' + API_KEY
			// отправка запроса на сервер
      fetch(guideUrl)
			// обработка ответа
        .then(response => response.json())
				// обработка данных
        .then(guideData => {
					// вывод информации о заказе
          displayOrder(data, guideData, routeId, currRouteName)
        })
    })
}

// функция для вывода информации о заказе
function displayOrder (data, guideData, routeId, currRouteName) {
  console.log(data)
	// заполнение информации о заказе в окне информации о заказе
  document.getElementById('info-order-id').innerText = data.id
  document.getElementById('info-guide-name').innerText = guideData.name
  document.getElementById('info-route-name').innerText = currRouteName
  document.getElementById('info-date').innerText = data.date
  document.getElementById('info-time').innerText = data.time
  document.getElementById('info-duration').innerText = data.duration
  document.getElementById('info-people').innerText = data.persons

	// если опция "Питание" включена, то выводим "Включено", иначе "Не включено"
  if (data.optionFirst) {
    document.getElementById('info-food').innerText = 'Включено'
  } else {
    document.getElementById('info-food').innerText = 'Не включено'
  }

	// если опция "Экскурсия" включена, то выводим "Включено", иначе "Не включено"
  if (data.optionSecond) {
    document.getElementById('info-guide').innerText = 'Включено'
  } else {
    document.getElementById('info-guide').innerText = 'Не включено'
  }
  document.getElementById('info-price').innerText = data.price
}
