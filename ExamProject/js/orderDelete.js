// функция удаления заказа
function deleteOrder () {
	// создаем ссылку на текущий заказ
  const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/' + currentOrderId + '?api_key=' + API_KEY

	// отправляем запрос на сервер для удаления заказа
	// метод запроса - DELETE
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
	// обработка ответа
    .then(response => {
			// если ответ не успешный, то выводим сообщение об ошибке
      if (!response.ok) {
        throw new Error('Произошла ошибка')
      }
      return response.json()
    })
		// выводим ответ на консоль
    .then(data => {
      console.log(data)
			// переходим на страницу аккаунта
      window.location.href = 'account.html'
    })
}
