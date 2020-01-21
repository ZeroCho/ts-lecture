const horizontal: number = 4;
const vertical: number = 3;
const colors: string[] = ['red', 'red', 'orange', 'orange', 'green', 'green', 'yellow', 'yellow', 'white', 'white', 'pink', 'pink'];

let colorCandidate: string[] = colors.slice();
let color: string[] = [];
let clickFlag: boolean = true;
let clickCard: HTMLDivElement[] = [];
let completedCard: HTMLDivElement[] = [];
let startTime: Date | null = null;

function shuffle(): void {
  for (let i: number = 0; colorCandidate.length > 0; i += 1) {
    color = color.concat(colorCandidate.splice(Math.floor(Math.random() * colorCandidate.length), 1));
  }
}

function setCard(horizontal: number, vertical: number) {
  clickFlag = false;
  for (let i: number = 0; i < horizontal * vertical; i++) {
    const card: HTMLDivElement = document.createElement('div');
    card.className = 'card';
    const cardInner: HTMLDivElement = document.createElement('div');
    cardInner.className = 'card-inner';
    const cardFront: HTMLDivElement = document.createElement('div');
    cardFront.className = 'card-front';
    const cardBack: HTMLDivElement = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.style.backgroundColor = color[i];
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', function (this: HTMLDivElement) {
      if (clickFlag && !completedCard.includes(this)) {
        this.classList.toggle('flipped');
        clickCard.push(this);
        if (clickCard.length === 2) {
          const firstBackground: string = (clickCard[0].querySelector('.card-back') as HTMLDivElement).style.backgroundColor;
          const secondBackground: string = (clickCard[1].querySelector('.card-back') as HTMLDivElement).style.backgroundColor;
          if (firstBackground === secondBackground) {
            completedCard.push(clickCard[0]);
            completedCard.push(clickCard[1]);
            clickCard = [];
            if (completedCard.length === horizontal * vertical) {
              const endTime: number = new Date().getTime();
              alert(`축하합니다! ${(endTime - startTime!.getTime()) / 1000}초 걸렸습니다!`);
              (document.querySelector('#wrapper') as HTMLDivElement).innerHTML = '';
              colorCandidate = colors.slice();
              color = [];
              completedCard = [];
              startTime = null;
              shuffle();
              setCard(horizontal, vertical);
            }
          } else {
            clickFlag = false;
            setTimeout(() => {
              clickCard[0].classList.remove('flipped');
              clickCard[1].classList.remove('flipped');
              clickFlag = true;
              clickCard = [];
            }, 1000);
          }
        }
      }
    });  

    (document.querySelector('#wrapper') as HTMLDivElement).appendChild(card);
  }

  Array.prototype.forEach.call<HTMLCollectionOf<Element>, [(card: HTMLDivElement, index: number) => void], void>(document.getElementsByClassName('card'), (card, index) => {
    setTimeout(() => {
      card.classList.add('flipped');
    }, 1000 + 100 * index);
  });

  setTimeout(() => {
    Array.prototype.forEach.call<HTMLCollectionOf<Element>, [(card: HTMLDivElement, index: number) => void], void>(document.getElementsByClassName('card'), (card, index) => {
      card.classList.remove('flipped');
    });
    clickFlag = true;
    startTime = new Date();
  }, 5000);
}

shuffle();
setCard(horizontal, vertical);