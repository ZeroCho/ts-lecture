interface Card {
  att: number;
  hp: number;
  mine: boolean;
  field: boolean;
  cost?: number;
  hero?: boolean;
}

class Hero implements Card {
  public att: number; // number | undefined
  public hp: number;
  public hero: boolean;
  public field: true;
  public mine: boolean;
  constructor(mine: boolean) {
    this.mine = mine;
    this.att = Math.ceil(Math.random() * 2);
    this.hp = Math.ceil(Math.random() * 5) + 25;
    this.hero = true;
    this.field = true;
  }
}

class Sub implements Card {
  public att: number; // number | undefined
  public hp: number;
  public field: boolean = false;
  public mine: boolean;
  public cost: number;
  constructor(mine: boolean) {
    this.mine = mine;
    this.att = Math.ceil(Math.random() * 5);
    this.hp = Math.ceil(Math.random() * 5);
    this.cost = Math.floor((this.att + this.hp) / 2);
  }
}

interface Player {
  hero: HTMLDivElement
  deck: HTMLDivElement
  field: HTMLDivElement
  cost: HTMLDivElement
  deckData: Sub[]
  heroData?: Hero | null
  fieldData: Sub[]
  chosenCard?: HTMLDivElement | null
  chosenCardData?: Card | null
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

const turnButton = document.getElementById('turn-btn') as HTMLButtonElement;
let turn = true; // true면 내 턴, false면 상대 턴

function initiate() {
  [opponent, me].forEach((item) => {
      item.deckData = [];
      item.heroData = null;
      item.fieldData = [];
      item.chosenCard = null;
      item.chosenCardData = null;
  }); // 초기화
  createEnemyDeck(5); // 상대 랜덤 카드 5장
  createMyDeck(5); // 내 랜덤 카드 5장
  createEnemyHero(); // 상대 영웅 생성
  createMyHero(); // 내 영웅 생성
  redrawScreen(true); // 상대 화면 그리기
  redrawScreen(false); // 내 화면 그리기
}

initiate(); // 진입점

function createEnemyDeck(count: number) {
  for (let i: number = 0; i < count; i++) {
    opponent.deckData.push(new Sub(false));
  }
  redrawDeck(opponent);
}

function createMyDeck(count: number) {
  console.log(count);
  for (let i: number = 0; i < count; i++) {
    me.deckData.push(new Sub(true));
  }
  redrawDeck(me);
}

function createEnemyHero() {
  opponent.heroData = new Hero(false);
  connectCardDOM(opponent.heroData, opponent.hero, true);
}

function createMyHero() {
  me.heroData = new Hero(true);
  connectCardDOM(me.heroData, me.hero, true);
}

function redrawScreen(enemy: boolean) {
  const target = enemy ? opponent : me;
  redrawField(target); // 필드 그리기
  redrawDeck(target); // 덱 그리기
  redrawHero(target); // 영웅 그리기
}

function redrawField(target: Player) {
  target.field.innerHTML = '';
  target.fieldData.forEach((data) => {
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
    throw new Error('heroData가 없습니다.');
  }
  target.hero.innerHTML = '';
  connectCardDOM(target.heroData, target.hero, true);
}

function connectCardDOM(data: Card, DOM: HTMLDivElement, hero?: boolean) {
  const cardEl = document.querySelector('.card-hidden .card')!.cloneNode(true) as HTMLDivElement;
  cardEl.querySelector('.card-cost')!.textContent = String(data.cost);
  cardEl.querySelector('.card-att')!.textContent = String(data.att);
  cardEl.querySelector('.card-hp')!.textContent = String(data.hp);
  if (hero) {
    (cardEl.querySelector('.card-cost') as HTMLDivElement).style.display = 'none';
    const name = document.createElement('div');
    name.textContent = '영웅';
    cardEl.appendChild(name);
  }
  cardEl.addEventListener('click', () => {
    if (!data.field) { // 덱에 있는 카드를 클릭했을 때
      if (deckToField(data, turn) !== 'end') {
        console.log('clicked', turn);
        turn ? createMyDeck(1) : createEnemyDeck(1); // 카드 한 장 필드로 옮겼으면 한 장 덱에 추가
      }
    } else {
      turnAction(cardEl, data, turn);
    }
  })
  DOM.appendChild(cardEl);
}

function turnAction(cardEl: HTMLDivElement, data: Card, turn: boolean) {
  // 턴이 끝난 카드면 아무일도 일어나지 않음
  const team = turn ? me: opponent;
  const enemy = turn ? opponent : me;
  if (cardEl.classList.contains('card-turnover')) {
    return; // 행동한 카드는 다시 행동할 수 없음.
  }
  // 적군 카드면서 아군 카드가 선택되어 있고, 또 그게 턴이 끝난 카드가 아니면 공격
  const enemyCard = turn ? !data.mine : data.mine;
  if (enemyCard && team.chosenCardData) {
    data.hp = data.hp - team.chosenCardData.att;
    if (data.hp <= 0) { // 카드가 죽었을 때
      const index = enemy.fieldData.indexOf(data as Sub);
      if (index > -1) { // 쫄병이 죽은 경우
        enemy.fieldData.splice(index, 1);
      } else {
        alert('승리하셨습니다!');
        initiate();
      }
    }
    redrawScreen(!turn);
    if (team.chosenCard) { // 이미 행동한 카드임을 표시
      team.chosenCard.classList.remove('card-selected');
      team.chosenCard.classList.add('card-turnover');
    }
    team.chosenCard = null;
    team.chosenCardData = null;
    return;
  } else if (enemyCard) { // 상대 카드면 리턴
    return;
  }
  // 영웅의 부모와 필드카드의 부모가 다르기 때문에 document에서 모든 .card 검색
  document.querySelectorAll('.card').forEach((card) => {
    card.classList.remove('card-selected');
  });
  cardEl.classList.add('card-selected');
  team.chosenCard = cardEl;
  team.chosenCardData = data;
}

function deckToField(data: Card, turn: boolean) { // 덱에서 필드로 옮김
  const target = turn ? me : opponent;
  const currentCost = Number(target.cost.textContent);
  if (currentCost < data.cost!) {
    return 'end';
  }
  const idx = target.deckData.indexOf(data as Sub);
  target.deckData.splice(idx, 1);
  target.fieldData.push(data as Sub);
  redrawField(target);
  redrawDeck(target);
  data.field = true;
  target.cost.textContent = String(currentCost - data.cost!);
}