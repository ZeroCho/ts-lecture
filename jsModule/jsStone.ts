const opponent: Player = {
  hero: document.getElementById('rival-hero') as HTMLDivElement,
  deck: document.getElementById('rival-deck') as HTMLDivElement,
  field: document.getElementById('rival-cards') as HTMLDivElement,
  cost: document.getElementById('rival-cost') as HTMLDivElement,
  deckData: [],
  heroData: null,
  fieldData: [],
  chosenCard: null,
  chosenCardData: null,
};

const me: Player = {
  hero: document.getElementById('my-hero') as HTMLDivElement,
  deck: document.getElementById('my-deck') as HTMLDivElement,
  field: document.getElementById('my-cards') as HTMLDivElement,
  cost: document.getElementById('my-cost') as HTMLDivElement,
  deckData: [],
  heroData: null,
  fieldData: [],
  chosenCard: null,
  chosenCardData: null,
};

class Hero implements Card {
  public att: number;
  public hp: number;
  public mine: boolean;
  public field: boolean;
  constructor(mine: boolean) {
    this.att = Math.ceil(Math.random() * 2);
    this.hp = Math.ceil(Math.random() * 5) + 25;
    this.mine = mine;
    this.field = true;
  }
}

class Sub implements Card {
  public att: number;
  public hp: number;
  public field: boolean;
  public cost: number;
  public mine: boolean;
  constructor(mine: boolean) {
    this.att = Math.ceil(Math.random() * 5);
    this.hp = Math.ceil(Math.random() * 5);
    this.cost = Math.floor((this.att + this.hp) / 2);
    this.mine = mine;
    this.field = false;
  }
}

const isSub = function(data: Card): data is Sub {
  if (data.cost) {
    return true;
  }
  return false;
}

const turnButton = document.getElementById('turn-btn') as HTMLButtonElement;
let turn = true; // true면 내턴, false면 상대 턴

function initiate() {
  [opponent, me].forEach(function (item) {
    item.deckData = [];
    item.heroData = null;
    item.fieldData = [];
    item.chosenCard = null;
    item.chosenCardData = null;
  });
  createDeck({ mine: false, count: 5 }); // 상대 덱 생성
  createDeck({ mine: true, count: 5 }); // 내 덱 생성
  createHero({ mine: false }); // 상대 영웅 그리기
  createHero({ mine: true }); // 내 영웅 그리기
  redrawScreen({ mine: false }); // 상대화면
  redrawScreen({ mine: true }); // 내화면
}

initiate(); // 진입점

function createDeck({ mine, count }: { mine: boolean; count: number }) {
  const player = mine ? me : opponent;
  for (let i = 0; i < count; i++) {
    player.deckData.push(new Sub(mine));
  }
  redrawDeck(player);
}

function createHero({ mine }: { mine: boolean }) {
  const player = mine ? me : opponent;
  player.heroData = new Hero(mine);
  connectCardDOM(player.heroData, player.hero, true);
}

function redrawScreen({ mine }: { mine: boolean }) {
  const player = mine ? me : opponent;
  redrawField(player);
  redrawDeck(player);
  redrawHero(player);
}

function redrawField(target: Player) {
  target.field.innerHTML = '';
  target.fieldData.forEach(function(data) {
    connectCardDOM(data, target.field);
  });
}
function redrawDeck(target: Player) {
  target.deck.innerHTML = '';
  target.deckData.forEach(function(data) {
    connectCardDOM(data, target.deck);
  });
}
function redrawHero(target: Player) {
  if (!target.heroData) {
    console.error(target);
    throw new Error('heroData가 없습니다');
  }
  target.hero.innerHTML = '';
  connectCardDOM(target.heroData, target.hero, true);
}

function connectCardDOM(data: Card, DOM: HTMLElement, hero?: boolean) {
  const cardEl = document.querySelector('.card-hidden .card')!.cloneNode(true) as HTMLDivElement;
  cardEl.querySelector('.card-att')!.textContent = String(data.att);
  cardEl.querySelector('.card-hp')!.textContent = String(data.hp);
  if (hero) {
    (cardEl.querySelector('.card-cost') as HTMLDivElement).style.display = 'none';
    const name = document.createElement('div');
    name.textContent = '영웅';
    cardEl.appendChild(name)
  } else {
    cardEl.querySelector('.card-cost')!.textContent = String(data.cost);
  }
  cardEl.addEventListener('click', function() {
    if (isSub(data) && data.mine === turn && !data.field) { // 자신의 덱에 있는 쫄병이면
      if (!deckToField({ data })) { // 쫄병을 하나 뽑았으면
        createDeck({ mine: turn, count: 1 });
      }
    }
    turnAction({ cardEl, data });
  });
  DOM.appendChild(cardEl);
}

function deckToField({ data }: { data: Sub }): boolean {
  const target = turn ? me : opponent; // 조건 ? 참 : 거짓;
  const currentCost = Number(target.cost.textContent);
  if (currentCost < data.cost) { // 코스트가 모자르면 종료
    alert('코스트가 모자릅니다.');
    return true;
  }
  data.field = true;
  const idx = target.deckData.indexOf(data);
  target.deckData.splice(idx, 1);
  target.fieldData.push(data);
  redrawField(target);
  redrawDeck(target);
  target.cost.textContent = String(currentCost - data.cost); // 남은 코스트 줄이기
  return false;
}

function turnAction({ cardEl, data }: { cardEl: HTMLDivElement, data: Card }) {
  const team = turn ? me : opponent; // 지금 턴의 편
  const enemy = turn ? opponent : me; // 그 상대 편

  if (cardEl.classList.contains('card-turnover')) { // 턴이 끝난 카드면 아무일도 일어나지 않음
    return;
  }

  const enemyCard = turn ? !data.mine : data.mine;
  if (enemyCard && team.chosenCardData) { // 선택한 카드가 있고 적군 카드를 클릭한 경우 공격 수행
    data.hp = data.hp - team.chosenCardData.att;
    if (data.hp <= 0) { // 카드가 죽었을 때
      if (isSub(data)) { // 쫄병이 죽었을 때
        const index = enemy.fieldData.indexOf(data);
        enemy.fieldData.splice(index, 1);
      } else { // 영웅이 죽었을 때
        alert('승리하셨습니다!');
        initiate();
      }
    }
    redrawScreen({ mine: !turn }); // 상대 화면 다시 그리기
    if (team.chosenCard) { // 클릭 해제 후 카드 행동 종료
      team.chosenCard.classList.remove('card-selected');
      team.chosenCard.classList.add('card-turnover');
    }
    team.chosenCard = null;
    team.chosenCardData = null;
    return;
  } else if (enemyCard) { // 상대 카드면
    return;
  }
  if (data.field) { // 카드가 필드에 있으면
    //  영웅 부모와 필드카드의 부모가 다르기때문에 document에서 모든 .card를 검색한다
    // 카드.parentNode.querySelectorAll('.card').forEach(function (card) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.classList.remove('card-selected');
    });
    console.log(cardEl);
    cardEl.classList.add('card-selected');
    team.chosenCard = cardEl;
    team.chosenCardData = data;
  }
}

turnButton.addEventListener('click', function() {
  const target = turn ? me : opponent;
  document.getElementById('rival')!.classList.toggle('turn');
  document.getElementById('my')!.classList.toggle('turn');
  redrawField(target);
  redrawHero(target);
  turn = !turn; // 턴을 넘기는 코드
  if (turn) {
    me.cost.textContent = '10';
  } else {
    opponent.cost.textContent = '10';
  }
});

