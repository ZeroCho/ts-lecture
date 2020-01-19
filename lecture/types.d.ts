export declare type A = string | number;
export interface Card {
    att: number;
    hp: number;
    mine: boolean;
    field: boolean;
    cost?: number;
    hero?: boolean;
}
export interface Player {
    hero: HTMLDivElement;
    deck: HTMLDivElement;
    field: HTMLDivElement;
    cost: HTMLDivElement;
    deckData: Sub[];
    heroData?: Hero | null;
    fieldData: Sub[];
    chosenCard?: HTMLDivElement | null;
    chosenCardData?: Card | null;
}
export declare class Sub implements Card {
    att: number;
    hp: number;
    cost: number;
    mine: boolean;
    field: boolean;
    constructor(mine: boolean);
}
export declare class Hero implements Card {
    att: number;
    hp: number;
    hero: boolean;
    field: true;
    mine: boolean;
    constructor(mine: boolean);
}
