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
export {};
