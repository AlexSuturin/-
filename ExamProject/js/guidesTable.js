// получение тега таблицы из html
const guidesTable = document.getElementById('table-guides')
// получение тега маршрута
const routeName = document.getElementById('route-name')
// получение тега выбран ли маршрут
const routeNotSelected = document.getElementById('route-not-selected')

// получение минимального значения опыта работы
const minWorkExperience = document.getElementById('experience-range-start')
let minWorkExperienceValue = 0
// получение максимального значения опыта работы
const maxWorkExperience = document.getElementById('experience-range-end')
let maxWorkExperienceValue = 0

// массив данных о гидах
let guidesData = []
// массив данных о гидах в начале
let startData = []

// получение тега выбора языка
const langSelect = document.getElementById('lang-select')
// создание множества языков
// множество - это коллекция уникальных значений
// типа множество от 1, 2, 2, 3, 3, 3 будет 1, 2, 3 (что-то вроде массива, но без повторяющихся значений)
const langSet = new Set()

// текущие значения о гиде, маршруте и цене (пока не выбраны)
let currentRoute = null
let currentGuide = null
let currentPrice = null

// вывод данных о возрасте гида в зависимости от числа
function getYearString (year) {
  if (year % 10 === 1 && year !== 11) {
    return 'год'
  }
  if (year % 10 >= 2 && year % 10 <= 4 && (year < 10 || year > 20)) {
    return 'года'
  }
  return 'лет'
}

// функция для установки данных о гиде в модальное окно (вызывается при нажатии на кнопку "Выбрать" в таблице гидов)
function setModalData (id, name, language, workExperience, pricePerHour, route) {
	// заполнение формы данными о гиде
  currentGuide = id
  guideModalName.innerText = name
  guideOrderPrice = pricePerHour
  routeModalName.innerText = routeName.innerText
  currentRoute = Number(route)
  tripDuration.value = workExperience + ' ' + getYearString(workExperience)
  document.getElementById('total-modal-price').innerText = pricePerHour
  currentPrice = pricePerHour

	// очистка формы от предыдущих данных
  document.getElementById('check-food').checked = false
  document.getElementById('check-trip').checked = false
  document.getElementById('trip-date').value = ''
  document.getElementById('trip-time').value = '12:00'
  document.getElementById('trip-people-count').value = 1
}

// функция для вывода таблицы гидов на страницу
function displayGuideItems (data, name, routeId) {
	// если маршрут не выбран, то ничего не делаем
  if (routeNotSelected.innerText !== '') {
    routeNotSelected.innerText = ''
  }
	// очищаем выбор языка
  if (langSelect.innerText !== '') {
    langSelect.innerHTML = `
        <option value="0">Язык экскурсии</option> 
      `
  }

	// очищаем таблицу от предыдущих данных и добавляем заголовок таблицы
  guidesTable.innerHTML = `
    <thead class="table-primary" style="background-color: #c76a30;">
      <td class="fw-bold table-a" style="background-color: #c76a30; border-radius: 10px 0 0 0; color: white">ФИО</td>
      <td class="fw-bold" style="background-color: #a66035; color: white">Языки</td>
      <td class="fw-bold" style="background-color: #a66035; color: white">Опыт работы</td>
      <td class="fw-bold" style="background-color: #a66035; color: white">Стоимость услуг в час</td>
      <td style="background-color: #a66035; color: white"></td>
    </thead>
    `

	// очищаем множество языков
  langSet.clear()
  guidesData = []

	// если данные о гидах получены и их количество больше 0
  if (Array.isArray(data) && data.length > 0) {
		// выводим название маршрута
    routeName.innerText = '"' + name + '"'

		// добавляем данные о гидах в массив данных о гидах
    data.forEach(item => {
      guidesData.push(item)

			// если опыт работы гида больше максимального значения, то обновляем максимальное значение
      if (item.workExperience > maxWorkExperienceValue) {
        maxWorkExperienceValue = item.workExperience
      }
			// если опыт работы гида меньше минимального значения, то обновляем минимальное значение
      if (item.workExperience < minWorkExperienceValue) {
        minWorkExperienceValue = item.workExperience
      }

			// добавляем язык гида в множество языков
      lang = item.language
      langSet.add(lang)
    })
		// устанавливаем значения опыта работы
    minWorkExperience.value = minWorkExperienceValue
    maxWorkExperience.value = maxWorkExperienceValue
    startData = guidesData
		// выводим таблицу гидов
    setExperienceTable()

    langSet.forEach(item => {
      langSelect.innerHTML += `
          <option value="${item}">${item}</option>
        `
    })
  } else {
    console.error('Ошибка: Некорректные данные')
  }
}

function fetchGuides (id, name) {
  if (routeName.innerText !== '') {
    routeName.innerText = ''
  }

  fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${id}/guides?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      displayGuideItems(data, name, id)
    })
}

langSelect.addEventListener('change', () => {
  setExperienceTable()
})

minWorkExperience.addEventListener('change', () => {
  setExperienceTable()
})

maxWorkExperience.addEventListener('change', () => {
  setExperienceTable()
})

// функция для установки таблицы гидов на страницу
function setExperienceTable () {
	// получение выбранного языка
  const selectedLang = langSelect.value

	// очистка таблицы от предыдущих данных и добавление заголовка таблицы
  guidesTable.innerHTML = `
    <thead class="table-primary">
      <td class="fw-bold table-a" style="background: #c76a30 !important; border-radius: 10px 0 0 0; color: white">ФИО</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Языки</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Опыт работы</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Стоимость услуг в час</td>
      <td style="background: #c76a30 !important; color: white; border-radius: 0 10px 0 0"></td>
    </thead>
    `
		// создание массива для отфильтрованных данных о гидах
  let filteredGuidesExperiences = []

  console.log(minWorkExperience.value, maxWorkExperience.value, startData)
	// фильтрация данных о гидах по опыту работы
  for (const startDataKey in startData) {
		// если опыт работы гида больше или равен минимальному значению и меньше или равен максимальному значению
		// то добавляем данные о гиде в массив отфильтрованных данных
    if (startData[startDataKey].workExperience >= Number(minWorkExperience.value) && startData[startDataKey].workExperience <= Number(maxWorkExperience.value)) {
      filteredGuidesExperiences.push(startData[startDataKey])
    }
  }
  console.log(filteredGuidesExperiences)

	// если выбран язык то фильтруем данные о гидах по языку
  if (selectedLang !== '0') {
    filteredGuidesExperiences = filteredGuidesExperiences.filter(item => item.language === selectedLang)
  }

  console.log(filteredGuidesExperiences)

	// вывод данных о гидах на страницу
  filteredGuidesExperiences.forEach(item => {
    guidesTable.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.language}</td>
        <td>${item.workExperience} ${getYearString(item.workExperience)}</td>
        <td>${item.pricePerHour}/час</td>
        <td><button class="btn btn-primary align-self-center" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="setModalData(${item.id}, '${item.name}', '${item.language}', ${item.workExperience}, ${item.pricePerHour}, ${item.route_id})">Выбрать</button></td>
      </tr>
    `
  })
}
