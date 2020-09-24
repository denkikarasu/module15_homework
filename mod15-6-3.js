const wsUri = "wss://echo.websocket.org/";

let output;
let btnSend;
let btnGeo;
let inputMsg;
let websocket;

window.onload = function () {
  // нужные ноды
  output = document.querySelector('.output');
  btnSend = document.querySelector('.btn-send');
  btnGeo = document.querySelector('.btn-geo');

  // открытие соединения при загрузке
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) {
    console.log("CONNECTED");
    btnSend.disabled = false;
  };
  websocket.onclose = function(evt) {
    console.log("DISCONNECTED");
    btnSend.disabled = true;
  };
  websocket.onerror = function(evt) {
    printMsg(
      '<span style="color: red;">ERROR:</span> ' + evt.data, "out"
    );
  };
  websocket.onmessage = function(evt) {
    // Вывод входящего сообщения (если не содержит геолокацию)
    // console.log(evt.data);
    if(!evt.data.includes('Location')) {
      printMsg(evt.data, "in");  
    }
  };

  // Обработчик кнопки "Отправить"
  btnSend.addEventListener('click', () => {
    const inputMsg = document.querySelector('.input-message').value;
    // Вывод исходящего сообщения
    printMsg(inputMsg, "out");
    websocket.send(inputMsg);
    
    
  });

  // Обработчик кнопки "Геолокация"
  btnGeo.addEventListener('click', () => {
    // устранение бага codepen.io
    // if(event) {event.preventDefault();}

    if (!navigator.geolocation) {
      message = 'Geolocation не поддерживается вашим браузером';
      printMsg(message,"out");
    } else {
      message = 'Определение местоположения…';
      printMsg(message, "out");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  });

};

// Вывод сообщений в чате
function printMsg(message, direction) {
  // устранение бага codepen.io
  // if(event) {event.preventDefault();}
  
  if (direction === "geo") {
    direction = "out";
    output.removeChild(output.lastChild);
  } 

  let printMsg = document.createElement("div");
  printMsg.className = `message ${direction}`;
  printMsg.innerHTML = message;
  output.appendChild(printMsg);

  // Очистка формы
  document.querySelector('form').reset();
}


// При ошибке определения геолокации
const error = () => {
  message = 'Невозможно получить ваше местоположение';
  printMsg(message,"out");
};

// При успешном получении геолокации
const success = (position) => {
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log('position', latitude, longitude);
  message = `<a href="https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}" target="_blank">Геолокация</a>`;
  websocket.send(`Location: ${latitude},${longitude}`);
  printMsg(message,"geo");
};



// В codepen.io:
// https://codepen.io/denkikarasu/pen/rNeQpYJ

// В codepen вылетает ошибка "Bad Path /boomboom/v2/index.html"
// По рекомендациям из сети добавлено event.preventDefault();
// Точки добавления инструкции и конкретный формат определены эмпирически (если добавить без проверки event, вылетает ошибка "Cannot read property 'preventDefault' of undefined" либо на отправке сообщения, либо на геолокации).

// Как ни странно, в браузере тоже без этих строк начинаются сбои (показанные сообщения сразу же исчезают), это объяснить не могу.


// На карту добавлен  маркер, кнопка "Отправить" неактивна при отсутствии соединения, форма очищается после отправки сообщения.

// Добавлено временное сообщение о процессе поиска геолокации.


/*****/

// Ошибка происходила из-за того, что у формы (элемент form) не был указан атрибут action, в котором обычно указывается ссылка на серверный скрипт, отвечающий за обработку формы. Если этот атрибут не указать, то попытка отправить форму (а клик на кнопку считается попыткой отправить форму) вызовет перезагрузку страницы. Т.е. сообщения не стирались, а просто перезагружалась вся страница. В html я добавила "заглушку" в атрибут action, это помогло решить проблему
// Также исправила в JS коде небольшой недочёт - websocket.onmessage лучше определять на том же уровне, что и оставльные события websocket. В вашем варианте функция-обработчик заново переопределялась при каждом клике на кнопку, что не имеет смысла, т.к. функция всегда одна и та же и никак не зависит от события клика