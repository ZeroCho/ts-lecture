interface Player {
  hero: HTMLDivElement
  deck: HTMLDivElement
  field: HTMLDivElement
  cost: HTMLDivElement
  deckData: Card[]
  heroData: Card | null;
  fieldData: Card[]
  chosenCard: HTMLDivElement | null
  chosenCardData: Card | null
}

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

const turnButton = document.getElementById('turn-btn')!;
let turn = true; // true면 내턴, false면 니턴

function deckToField(data: Card, turn: boolean) {
  const target = turn ? me : opponent; // 조건 ? 참 : 거짓;
  const currentCost = Number(target.cost.textContent);
  if (currentCost < data.cost) {
    return 'end';
  }
  const idx = target.deckData.indexOf(data);
  target.deckData.splice(idx, 1);
  target.fieldData.push(data);
  redrawField(target);
  redrawDeck(target);
  data.field = true;
  target.cost.textContent = currentCost - data.cost;
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

function redrawScreen(turn: boolean) {
  const target = turn ? me : opponent; // 조건 ? 참 : 거짓;
  redrawField(target);
  redrawDeck(target);
  redrawHero(target);
}

function turnAction(cardEl: HTMLDivElement, data: Card, turn: boolean) {
  // 턴이 끝난 카드면 아무일도 일어나지 않음
  const team = turn ? me : opponent;
  const enemy = turn ? opponent : me;
  if (cardEl.classList.contains('card-turnover')) {
    return;
  }
  // 적군 카드면서 아군 카드가 선택되어 있고, 또 그게 턴이 끝난 카드가 아니면 공격
  const enemyCard = turn ? !data.mine : data.mine;
  if (enemyCard && team.chosenCardData) {
    data.hp = data.hp - team.chosenCardData.att;
    if (data.hp <= 0) { // 카드가 죽었을 때
      const index = enemy.fieldData.indexOf(data);
      if (index > -1 ) { // 쫄병이 죽었을 때
        enemy.fieldData.splice(index, 1);
      } else { // 영웅이 죽었을 때
        alert('승리하셨습니다!');
        initiate();
      }
    }
    redrawScreen(!turn);
    if (team.chosenCard) {
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
    cardEl.classList.add('card-selected');
    team.chosenCard = cardEl;
    team.chosenCardData = data;
  } else { // 덱이 있으면
    if (deckToField(data, turn) !== 'end') {
      turn ? createMyDeck(1) : createEnemyDeck(1);
    }
  }
}

function connectCardDOM(data: Card, DOM: HTMLElement, hero?: boolean) {
  const cardEl = document.querySelector('.card-hidden .card')!.cloneNode(true) as HTMLDivElement;
  cardEl.querySelector('.card-cost')!.textContent = String(data.cost);
  cardEl.querySelector('.card-att')!.textContent = String(data.att);
  cardEl.querySelector('.card-hp')!.textContent = String(data.hp);
  if (hero) {
    (cardEl.querySelector('.card-cost') as HTMLDivElement).style.display = 'none';
    const name = document.createElement('div');
    name.textContent = '영웅';
    cardEl.appendChild(name)
  }
  cardEl.addEventListener('click', function() {
    turnAction(cardEl, data, turn);
  });
  DOM.appendChild(cardEl);
}
function createEnemyDeck(count: number) {
  for (let i = 0; i < count; i++) {
    opponent.deckData.push(new Card());
  }
  redrawDeck(opponent);
}
function createMyDeck(count: number) {
  for (let i = 0; i < count; i++) {
    me.deckData.push(new Card(false, true));
  }
  redrawDeck(me);
}
function createMyHero() {
  me.heroData = new Card(true, true);
  connectCardDOM(me.heroData, me.hero, true);
}
function createEnemyHero() {
  opponent.heroData = new Card(true);
  connectCardDOM(opponent.heroData, opponent.hero, true);
}

class Card {
  private hero?: boolean;
  public att: number;
  public hp: number;
  public field?: boolean;
  public cost?: number;
  public mine?: boolean;
  constructor(hero?: boolean, mine?: boolean) {
    if (hero) {
      this.att = Math.ceil(Math.random() * 2);
      this.hp = Math.ceil(Math.random() * 5) + 25;
      this.hero = true;
      this.field = true;
    } else {
      this.att = Math.ceil(Math.random() * 5);
      this.hp = Math.ceil(Math.random() * 5);
      this.cost = Math.floor((this.att + this.hp) / 2);
    }
    if (mine) {
      this.mine = true;
    }
  }
}

function initiate() {
  [opponent, me].forEach(function (item) {
    item.deckData = [];
    item.heroData = null;
    item.fieldData = [];
    item.chosenCard = null;
    item.chosenCardData = null;
  });
  createEnemyDeck(5);
  createMyDeck(5);
  createMyHero();
  createEnemyHero();
  redrawScreen(true); // 상대화면
  redrawScreen(false); // 내화면
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

initiate(); // 진입점
