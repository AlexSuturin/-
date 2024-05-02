// получение полей для обновления заказа
const updateCheckFood = document.getElementById('update-check-food')
const updateCheckTrip = document.getElementById('update-check-trip')
const updateTripPeopleCount = document.getElementById('update-trip-people-count')

const updateTripDate = document.getElementById('update-trip-date')
const updateTripDuration = document.getElementById('update-trip-duration')
const updateTripTime = document.getElementById('update-trip-time')

// переменные для обновления заказа (по условию)
let isThisDayOff = false
let isItMorning = false
let isItEvening = false
let numberOfVisitors = 0
let hoursNumber = 0

let updateOrderId = 0

let guidePrice = 0

// если выбрали или убрали чекбокс, обновляем цену
updateCheckFood.addEventListener('change', () => {
  document.getElementById('update-total-modal-price').innerText = getUpdatedPriceWithOption()
})

updateCheckTrip.addEventListener('change', () => {
  document.getElementById('update-total-modal-price').innerText = getUpdatedPriceWithOption()
})

// если изменили количество людей, обновляем цену и проверяем на валидность
// если количество людей меньше 1, выводим сообщение об ошибке и устанавливаем значение в 1 и тп
updateTripPeopleCount.addEventListener('change', () => {
  console.log(currentPrice)
  if (updateTripPeopleCount.value < 1) {
    alert('Количество людей должно быть больше 0')
    updateTripPeopleCount.value = 1
  }
  if (updateTripPeopleCount.value > 20) {
    alert('Количество людей должно не превышать 20')
    updateTripPeopleCount.value = 20
  }

	// обновляем цену в модальном окне
  numberOfVisitors = Number(updateTripPeopleCount.value)
  document.getElementById('update-total-modal-price').innerText = getUpdatedPriceWithOption()
})

// если изменили дату, проверяем является ли день выходным
updateTripDate.addEventListener('change', () => {
  const date = new Date(updateTripDate.value)

	// если день выходной, устанавливаем флаг в true и обновляем цену
  if (!isThisDayOff && (date.getDay() === 0 || date.getDay() === 6)) {
    isThisDayOff = true
    document.getElementById('update-total-modal-price').innerText = getUpdatedPriceWithOption()
  }
	// если день не выходной, устанавливаем флаг в false и обновляем цену
  if (isThisDayOff && date.getDay() !== 0 && date.getDay() !== 6) {
    isThisDayOff = false
    document.getElementById('update-total-modal-price').innerText = getUpdatedPriceWithOption()
  }
})

// если изменили время, проверяем является ли время утренним или вечерним
updateTripTime.addEventListener('change', () => {
	// если время не в диапазоне от 09:00 до 23:00, выводим сообщение об ошибке и устанавливаем значение в 09:00
  if (updateTripTime.value < '09:00' || updateTripTime.value > '23:00') {
    alert('Время экскурсии должно быть в диапазоне от 09:00 до 23:00')
    updateTripTime.value = '09:00'
  }
	// если время утреннее, устанавливаем флаг утреннего времени в true и обновляем цену
  if (!isItMorning && (updateTripTime.value >= '09:00' && updateTripTime.value <= '12:00')) {
    isItMorning = true
    document.getElementById('update-total-modal-price').innerText = Number(document.getElementById('update-total-modal-price').innerText) + 400
  }
  if (isItMorning && (updateTripTime.value < '09:00' || updateTripTime.value > '12:00')) {
    isItMorning = false
    document.getElementById('update-total-modal-price').innerText = Number(document.getElementById('update-total-modal-price').innerText) - 400
  }
	// если время вечернее, устанавливаем флаг вечернего времени в true и обновляем цену
  if (!isItEvening && (updateTripTime.value >= '20:00' && updateTripTime.value <= '23:00')) {
    isItEvening = true
    document.getElementById('update-total-modal-price').innerText = Number(document.getElementById('update-total-modal-price').innerText) + 1000
  }
  if (isItEvening && (updateTripTime.value < '20:00' || updateTripTime.value > '23:00')) {
    isItEvening = false
    document.getElementById('update-total-modal-price').innerText = Number(document.getElementById('update-total-modal-price').innerText) - 1000
  }
})

// если изменили продолжительность экскурсии, обновляем цену
updateTripDuration.addEventListener('change', () => {
  hoursNumber = Number(updateTripDuration.value)
  document.getElementById('update-total-modal-price').innerText = getUpdatedPriceWithOption()
})

// функция для обновления заказа
function updateOrder (id, route_id, route_name) {
	// ссылка на заказ по id
  const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/' + id + '?api_key=' + API_KEY

	// получение данных о заказе
  fetch(url)
	// преобразование данных в json
    .then(response => response.json())
		// обработка данных
    .then(data => {
      updateOrderId = data.id

      const guideUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides/' + data.guide_id + '?api_key=' + API_KEY
      fetch(guideUrl)
        .then(response => response.json())
        .then(guideData => {
          guidePrice = guideData.pricePerHour
          displayUpdateOrder(data, guideData, route_id, route_name)
        })
    })
}

// функция для отображения данных о заказе
function displayUpdateOrder (data, guideData, route_id, route_name) {
  document.getElementById('update-guide-name').innerText = guideData.name
  document.getElementById('update-route-name').innerText = route_name

  document.getElementById('update-trip-date').value = data.date
  const date = new Date(data.date)
  isThisDayOff = date.getDay() === 0 || date.getDay() === 6

  document.getElementById('update-trip-time').value = data.time
  isItMorning = data.time >= '09:00' && data.time <= '12:00'
  isItEvening = data.time >= '20:00' && data.time <= '23:00'

  document.getElementById('update-trip-duration').value = data.duration
  hoursNumber = data.duration

  document.getElementById('update-trip-people-count').value = data.persons
  numberOfVisitors = data.persons

  document.getElementById('update-check-food').checked = data.optionFirst
  document.getElementById('update-check-trip').checked = data.optionSecond
  document.getElementById('update-total-modal-price').innerText = getUpdatedPriceWithOption()

  currentPrice = getUpdatedPriceWithOption()
}

// функция для обновления заказа (вызывается в account.html)
function updateOrderRequest () {
  console.log(updateOrderId)
	// ссылка на заказ по id
  const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/' + updateOrderId + '?api_key=' + API_KEY

	// создание формы для отправки данных
  const formdata = new FormData()
	// добавление данных в форму
  formdata.append('date', String(document.getElementById('update-trip-date').value))
  formdata.append('time', String(document.getElementById('update-trip-time').value))
  formdata.append('duration', String(document.getElementById('update-trip-duration').value))
  formdata.append('optionFirst', String(Number(document.getElementById('update-check-food').checked)))
  formdata.append('optionSecond', String(Number(document.getElementById('update-check-trip').checked)))
  formdata.append('persons', String(document.getElementById('update-trip-people-count').value))
  formdata.append('price', String(Math.round(Number(document.getElementById('update-total-modal-price').innerText))))

	// вывод данных в консоль
  formdata.forEach((value, key) => {
    console.log(key + ' ' + value)
  })

	// отправка данных на сервер
  fetch(url, {
		// метод запроса - PUT, т.к. обновляем данные
    method: 'PUT',
    body: formdata
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Произошла ошибка')
      }
      return response.json()
    })
		// если все успешно, переходим на страницу account.html
    .then(data => {
      console.log(data)
      window.location.href = 'account.html'
    }
    )
}

//функция для подсчета обновленной цены
const getUpdatedPrice = () => {
  let price = guidePrice

  price *= hoursNumber
  if (isThisDayOff) {
    price *= 1.5
  }
  if (isItMorning) {
    price += 400
  }
  if (isItEvening) {
    price += 1000
  }

  if (numberOfVisitors >= 5 && numberOfVisitors < 10) {
    price += 1000
  }
  if (numberOfVisitors >= 10) {
    price += 1500
  }

  return price
}

//функция для подсчета обновленной цены с учетом опций (по варианту)
const getUpdatedPriceWithOption = () => {
  let price = getUpdatedPrice()

  if (updateCheckTrip.checked) {
    price *= 1.3
  }
  if (updateCheckFood.checked) {
    price += 500 * numberOfVisitors
  }

  console.log(guidePrice, getUpdatedPrice(), price)

  return Math.round(price)
}
