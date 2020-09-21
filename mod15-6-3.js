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

  // Обработчик кнопки "Отправить"
  btnSend.addEventListener('click', () => {
    const inputMsg = document.querySelector('.input-message').value;
    // Вывод исходящего сообщения
    printMsg(inputMsg, "out");
    websocket.send(inputMsg);
    
    websocket.onmessage = function(evt) {
      // Вывод входящего сообщения
      printMsg(evt.data, "in");
    };
  });

  // Обработчик кнопки "Геолокация"
  btnGeo.addEventListener('click', () => {
    // устранение бага codepen.io
    if(event) {event.preventDefault();}

    if (!navigator.geolocation) {
      message = 'Geolocation не поддерживается вашим браузером';
    } else {
      console.log('Определение местоположения…');
      navigator.geolocation.getCurrentPosition(success, error);
    }
  });

};

// Вывод сообщений в чате
function printMsg(message, direction) {
  // устранение бага codepen.io
  if(event) {event.preventDefault();}
  
  let printMsg = document.createElement("div");
  let cssFloat = "";
  printMsg.style.width = "100%";
  if (direction === "out") {
    cssFloat = "right";
  } else if (direction === "in") {
    cssFloat = "left";
  }
  printMsg.innerHTML = `<p class='message' style='display: block; float: ${cssFloat}'>${message}</p>`;
  output.appendChild(printMsg);
  const lineBreak = document.createElement("div");
  lineBreak.className = "break";
  output.appendChild(lineBreak);
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
  printMsg(message,"out");
};



// В codepen.io:
// https://codepen.io/denkikarasu/pen/rNeQpYJ
// В codepen вылетает ошибка "Bad Path /boomboom/v2/index.html"
// По рекомендациям из сети добавлено event.preventDefault();
// Точки добавления инструкции и конкретный формат определены эмпирически (если добавить без проверки event, вылетает ошибка "Cannot read property 'preventDefault' of undefined" либо на отправке сообщения, либо на геолокации).

// Не разобралась, как выводить сообщения, чтобы они шли сразу одно под другим, а не распределялись по вертикали.

// На карту добавила маркер для наглядности.
