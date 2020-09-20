window.onload = function () {
    btn = document.querySelector('.j-btn-screen');
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    
    btn.addEventListener('click', () => {
      alert(`Ширина экрана ${screenWidth} пикселей\nВысота экрана ${screenHeight} пикселей`);
    });
  }
  
  

// В codepen:
// https://codepen.io/denkikarasu/pen/WNwYbaO

