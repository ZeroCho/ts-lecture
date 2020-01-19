export interface Player {
    hero: HTMLDivElement;
    deck: HTMLDivElement;
    field: HTMLDivElement;
    cost: HTMLDivElement;
    deckData: Sub[];
    heroData: Hero | null;
    fieldData: Sub[];
    chosenCard: HTMLDivElement | null;
    chosenCardData: Card | null;
}
declare const opponent: Player;
declare const me: Player;
interface Card {
    att: number;
    hp: number;
    mine: boolean;
    hero?: boolean;
    cost?: number;
    field?: boolean;
}
declare class Hero implements Card {
    att: number;
    hp: number;
    hero: boolean;
    field: true;
    mine: boolean;
    constructor(mine: boolean);
}
declare class Sub implements Card {
    att: number;
    hp: number;
    field: boolean;
    mine: boolean;
    cost: number;
    constructor(mine: boolean);
}
declare function isSub(data: Card): data is Sub;
declare function isHero(data: Card): data is Hero;
declare const turnButton: HTMLButtonElement;
declare let turn: boolean;
declare function initiate(): void;
declare function createDeck({ mine, count }: {
    mine: boolean;
    count: number;
}): void;
declare function createHero({ mine }: {
    mine: boolean;
}): void;
interface A {
    data: Card;
    DOM: HTMLDivElement;
    hero?: boolean;
}
declare function connectCardDOM({ data, DOM, hero }: A): void;
declare function redrawScreen({ mine }: {
    mine: boolean;
}): void;
declare function redrawHero(target: Player): void;
declare function redrawDeck(target: Player): void;
declare function redrawField(target: Player): void;
declare function deckToField({ data }: {
    data: Sub;
}): boolean;
