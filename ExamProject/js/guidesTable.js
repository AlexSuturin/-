// получение тега таблицы из html
const guidesTable = document.getElementById('table-guides')
// получение тега маршрута
const routeName = document.getElementById('route-name')
// получение тега выбран ли маршрут
const routeNotSelected = document.getElementById('route-not-selected')

const minWorkExperience = document.getElementById('experience-range-start')
let minWorkExperienceValue = 0
const maxWorkExperience = document.getElementById('experience-range-end')
let maxWorkExperienceValue = 0

let guidesData = []
let startData = []

const langSelect = document.getElementById('lang-select')
const langSet = new Set()

let currentRoute = null
let currentGuide = null
let currentPrice = null

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

  document.getElementById('check-food').checked = false
  document.getElementById('check-trip').checked = false
  document.getElementById('trip-date').value = ''
  document.getElementById('trip-time').value = '12:00'
  document.getElementById('trip-people-count').value = 1
}

// функция для вывода таблицы гидов на страницу
function displayGuideItems (data, name, routeId) {
  if (routeNotSelected.innerText !== '') {
    routeNotSelected.innerText = ''
  }
  if (langSelect.innerText !== '') {
    langSelect.innerHTML = `
        <option value="0">Язык экскурсии</option> 
      `
  }

  guidesTable.innerHTML = `
    <thead class="table-primary" style="background-color: #c76a30;">
      <td class="fw-bold table-a" style="background-color: #c76a30; border-radius: 10px 0 0 0; color: white">ФИО</td>
      <td class="fw-bold" style="background-color: #a66035; color: white">Языки</td>
      <td class="fw-bold" style="background-color: #a66035; color: white">Опыт работы</td>
      <td class="fw-bold" style="background-color: #a66035; color: white">Стоимость услуг в час</td>
      <td style="background-color: #a66035; color: white"></td>
    </thead>
    `

  langSet.clear()
  guidesData = []

  if (Array.isArray(data) && data.length > 0) {
    routeName.innerText = '"' + name + '"'

		// добавляем данные о гидах в массив данных о гидах
    data.forEach(item => {
      guidesData.push(item)

      if (item.workExperience > maxWorkExperienceValue) {
        maxWorkExperienceValue = item.workExperience
      }
      if (item.workExperience < minWorkExperienceValue) {
        minWorkExperienceValue = item.workExperience
      }

      lang = item.language
      langSet.add(lang)
    })
    minWorkExperience.value = minWorkExperienceValue
    maxWorkExperience.value = maxWorkExperienceValue
    startData = guidesData
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
// функция получения данных о гидах
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

  guidesTable.innerHTML = `
    <thead class="table-primary">
      <td class="fw-bold table-a" style="background: #c76a30 !important; border-radius: 10px 0 0 0; color: white">ФИО</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Языки</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Опыт работы</td>
      <td class="fw-bold" style="background: #c76a30 !important; color: white">Стоимость услуг в час</td>
      <td style="background: #c76a30 !important; color: white; border-radius: 0 10px 0 0"></td>
    </thead>
    `
  let filteredGuidesExperiences = []

  console.log(minWorkExperience.value, maxWorkExperience.value, startData)
	// фильтрация данных о гидах по опыту работы
  for (const startDataKey in startData) {
    if (startData[startDataKey].workExperience >= Number(minWorkExperience.value) && startData[startDataKey].workExperience <= Number(maxWorkExperience.value)) {
      filteredGuidesExperiences.push(startData[startDataKey])
    }
  }
  console.log(filteredGuidesExperiences)

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
