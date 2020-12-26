//создается ф, которая принимает Тип данных, на который будет проверят и любое кол-во значений на проверку
//далее эта функция фильтрует все значения и оставляет только те, тип которых совпал с выбранным типом данных
const filterByType = (type, ...values) => values.filter(value => typeof value === type),

	//создаем ф для скрытия всех дивов "dialog__response-block" со страницы
	hideAllResponseBlocks = () => {
		//получаем все варианты дива "dialog__response-block" сразу в виде массива, а не псевдомассива
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		//перебираем все варианты дива "dialog__response-block" и каждый из них скрываем со страницы
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},

	//в зависимости от успеха/неуспеха поиска будем показывать разные блоки, записывая в spanSelector текст с результатами msgText
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		//Сначала скроем все блоки
		hideAllResponseBlocks();
		//найдем элемент по переданному селектору и покажем его на странице
		document.querySelector(blockSelector).style.display = 'block';
		//если был передан spanSelector, то запишем в него переданный 2м аргументом текст
		if (spanSelector) {
			document.querySelector(spanSelector).textContent = msgText;
		}
	},

	//В случае ошибки запускаем ф.showResponseBlock, которая покажет блок .dialog__response-block_error, с текстом, который передадим позже
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),

	//В случае успеха запускаем ф.showResponseBlock, которая покажет блок .dialog__response-block_ok, с текстом, который передадим позже
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),

	//В случае если ничего не было найдено, то показываем блок .dialog__response-block_no-results. В спан ничего записано не будет
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

	//создается ф, которая будет проверят подходят ли данные (values) под выбранный тип (type)
	tryFilterByType = (type, values) => {
		//запускается выполнениие кода 
		try {
			//все значение values сначала проверяются в ф filterByType на совпадение с выбранным типом, в случае прохождения проверки через запятую добавляются в массив valuesArray
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			//формируется информация о результате = в случае, если сопрадения были найденны то будет создана строка `Данные с типом ${type}: ${valuesArray}, где type - это тот тип данный на которые мы проверяли, а valuesArray все значения, которые прошли проверку
			const alertMsg = (valuesArray.length) ?
				`Данные с типом ${type}: ${valuesArray}` :
				//в случае отсутствия совпадениц создается строка `Отсутствуют данные типа ${type}`
				`Отсутствуют данные типа ${type}`;
			//на странице отобразится блок 	.dialog__response-block_ok, в спане будет текст из alertMsg
			showResults(alertMsg);
		//в случае ошибки в коде try будет выводиться блок 	.dialog__response-block_error, а в спан записываться сама ошибка
		} catch (e) {
			showError(`Ошибка: ${e}`);
		}
	};

//находим кнопку Фильтровать на странице
const filterButton = document.querySelector('#filter-btn');

//навешиваем на нее обработчик события по клику
filterButton.addEventListener('click', e => {
	//Находим инпуты Тип данных и Данные
	const typeInput = document.querySelector('#type');
	const dataInput = document.querySelector('#data');

	//проверяем поле Данные на пустоту
	if (dataInput.value === '') {
		//в случае если поле пустое выводим сообщение Поле не должно быть пустым!
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		//Запускаем ф., которая покажет блок .dialog__response-block_no-results
		showNoResults();
		//если инпут не пустой
	} else {
		//обнуляем оповещение Поле не должно быть пустым!
		dataInput.setCustomValidity('');
		//запрещаем стандартное поведение - отправка формы
		e.preventDefault();

		//запускаем ф, передавая туда значения с Тип данный и Данные. Предварительно у значений удаляем возможные пробелы в нчале и конце строки
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});

