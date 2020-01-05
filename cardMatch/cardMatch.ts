const horizontal = 4;
const vertical = 3;
const colors = ['red', 'red', 'orange', 'orange', 'green', 'green', 'yellow', 'yellow', 'white', 'white', 'pink', 'pink'];
let colorCandidate = colors.slice();
let color = [];
let clickFlag = true;
let clickCard = [];
let completedCard = [];
let startTime;
function shuffle() { // 피셔예이츠 셔플
  for (let i = 0; colorCandidate.length > 0; i += 1) {
    color = color.concat(colorCandidate.splice(Math.floor(Math.random() * colorCandidate.length), 1));
  }
}

function setCard(horizontal, vertical) {
  clickFlag = false;
  for (let i = 0; i < horizontal * vertical; i += 1) {
    const card = document.createElement('div');
    card.className = 'card';
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.style.backgroundColor = color[i];
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    (function (c) { // 클로저 문제 해결
      card.addEventListener('click', function() {
        if (clickFlag && !completedCard.includes(c)) {
          c.classList.toggle('flipped');
          clickCard.push(c);
          if (clickCard.length === 2) {
            if (clickCard[0].querySelector('.card-back').style.backgroundColor === clickCard[1].querySelector('.card-back').style.backgroundColor) {
              completedCard.push(clickCard[0]);
              completedCard.push(clickCard[1]);
              clickCard = [];
              if (completedCard.length === 12) {
                const endTime = new Date().getTime();
                alert('축하합니다! 성공! ' + (endTime - startTime) / 1000 + '초 걸렸습니다.');
                document.querySelector('#wrapper').innerHTML = '';
                colorCandidate = colors.slice();
                color = [];
                completedCard = [];
                startTime = null;
                shuffle();
                setCard(horizontal, vertical);
              }
            } else { // 두 카드의 색깔이 다르면
              clickFlag = false;
              setTimeout(function() {
                clickCard[0].classList.remove('flipped');
                clickCard[1].classList.remove('flipped');
                clickFlag = true;
                clickCard = [];
              }, 1000);
            }
          }
        }
      });
    })(card);
    document.querySelector('#wrapper').appendChild(card);
  }

  document.querySelectorAll('.card').forEach(function (card, index) { // 초반 카드 공개
    setTimeout(function() {
      card.classList.add('flipped');
    }, 1000 + 100 * index);
  });

  setTimeout(function() { // 카드 감추기
    document.querySelectorAll('.card').forEach(function (card) {
      card.classList.remove('flipped');
    });
    clickFlag = true;
    startTime = new Date();
  }, 5000);
}

shuffle();
setCard(horizontal, vertical);
