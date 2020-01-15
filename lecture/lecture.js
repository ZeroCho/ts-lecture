"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Card = /** @class */ (function () {
    function Card(mine) {
        this.mine = false;
        this.att = 0;
        this.hp = 0;
        if (mine) {
            this.mine = true;
        }
    }
    return Card;
}());
var Hero = /** @class */ (function (_super) {
    __extends(Hero, _super);
    function Hero(mine) {
        var _this = _super.call(this, mine) || this;
        _this.att = Math.ceil(Math.random() * 2);
        _this.hp = Math.ceil(Math.random() * 5) + 25;
        _this.hero = true;
        _this.field = true;
        return _this;
    }
    return Hero;
}(Card));
var Sub = /** @class */ (function (_super) {
    __extends(Sub, _super);
    function Sub(mine) {
        var _this = _super.call(this, mine) || this;
        _this.field = false;
        _this.att = Math.ceil(Math.random() * 5);
        _this.hp = Math.ceil(Math.random() * 5);
        _this.cost = Math.floor((_this.att + _this.hp) / 2);
        return _this;
    }
    return Sub;
}(Card));
var opponent = {
    hero: document.getElementById('rival-hero'),
    deck: document.getElementById('rival-deck'),
    field: document.getElementById('rival-cards'),
    cost: document.getElementById('rival-cost'),
    deckData: [],
    heroData: null,
    fieldData: [],
    chosenCard: null,
    chosenCardData: null
};
var me = {
    hero: document.getElementById('my-hero'),
    deck: document.getElementById('my-deck'),
    field: document.getElementById('my-cards'),
    cost: document.getElementById('my-cost'),
    deckData: [],
    heroData: null,
    fieldData: [],
    chosenCard: null,
    chosenCardData: null
};
var turnButton = document.getElementById('turn-btn');
var turn = true; // true면 내 턴, false면 상대 턴
function initiate() {
    [opponent, me].forEach(function (item) {
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
function createEnemyDeck(count) {
    for (var i = 0; i < count; i++) {
        opponent.deckData.push(new Sub(false));
    }
    redrawDeck(opponent);
}
function createMyDeck(count) {
    console.log(count);
    for (var i = 0; i < count; i++) {
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
function redrawScreen(enemy) {
    var target = enemy ? opponent : me;
    redrawField(target); // 필드 그리기
    redrawDeck(target); // 덱 그리기
    redrawHero(target); // 영웅 그리기
}
function redrawField(target) {
    target.field.innerHTML = '';
    target.fieldData.forEach(function (data) {
        connectCardDOM(data, target.field);
    });
}
function redrawDeck(target) {
    target.deck.innerHTML = '';
    target.deckData.forEach(function (data) {
        connectCardDOM(data, target.deck);
    });
}
function redrawHero(target) {
    if (!target.heroData) {
        throw new Error('heroData가 없습니다.');
    }
    target.hero.innerHTML = '';
    connectCardDOM(target.heroData, target.hero, true);
}
function connectCardDOM(data, DOM, hero) {
    var cardEl = document.querySelector('.card-hidden .card').cloneNode(true);
    cardEl.querySelector('.card-cost').textContent = String(data.cost);
    cardEl.querySelector('.card-att').textContent = String(data.att);
    cardEl.querySelector('.card-hp').textContent = String(data.hp);
    if (hero) {
        cardEl.querySelector('.card-cost').style.display = 'none';
        var name_1 = document.createElement('div');
        name_1.textContent = '영웅';
        cardEl.appendChild(name_1);
    }
    cardEl.addEventListener('click', function () {
        if (!data.field) { // 덱에 있는 카드를 클릭했을 때
            if (deckToField(data, turn) !== 'end') {
                console.log('clicked', turn);
                turn ? createMyDeck(1) : createEnemyDeck(1); // 카드 한 장 필드로 옮겼으면 한 장 덱에 추가
            }
        }
        else {
            turnAction(cardEl, data, turn);
        }
    });
    DOM.appendChild(cardEl);
}
function turnAction(cardEl, data, turn) {
    // 턴이 끝난 카드면 아무일도 일어나지 않음
    var team = turn ? me : opponent;
    var enemy = turn ? opponent : me;
    if (cardEl.classList.contains('card-turnover')) {
        return; // 행동한 카드는 다시 행동할 수 없음.
    }
    // 적군 카드면서 아군 카드가 선택되어 있고, 또 그게 턴이 끝난 카드가 아니면 공격
    var enemyCard = turn ? !data.mine : data.mine;
    if (enemyCard && team.chosenCardData) {
        data.hp = data.hp - team.chosenCardData.att;
        if (data.hp <= 0) { // 카드가 죽었을 때
            var index = enemy.fieldData.indexOf(data);
            if (index > -1) { // 쫄병이 죽은 경우
                enemy.fieldData.splice(index, 1);
            }
            else {
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
    }
    else if (enemyCard) { // 상대 카드면 리턴
        return;
    }
    // 영웅의 부모와 필드카드의 부모가 다르기 때문에 document에서 모든 .card 검색
    document.querySelectorAll('.card').forEach(function (card) {
        card.classList.remove('card-selected');
    });
    cardEl.classList.add('card-selected');
    team.chosenCard = cardEl;
    team.chosenCardData = data;
}
function deckToField(data, turn) {
    var target = turn ? me : opponent;
    var currentCost = Number(target.cost.textContent);
    if (currentCost < data.cost) {
        return 'end';
    }
    var idx = target.deckData.indexOf(data);
    target.deckData.splice(idx, 1);
    target.fieldData.push(data);
    redrawField(target);
    redrawDeck(target);
    data.field = true;
    target.cost.textContent = String(currentCost - data.cost);
}
