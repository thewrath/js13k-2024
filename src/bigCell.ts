import * as ls from 'littlejsengine';

export type BigCell = {
    name: string,
}

export const bigCells: (BigCell | undefined) [] = [
    undefined,
    { name: "The Fool" },
    { name: "The Magician" },
    { name: "The High Priestess" },
    { name: "The Empress" },
    { name: "The Emperor" },
    { name: "The Hierophant" },
    { name: "The Lovers" },
    { name: "The Chariot" },
    { name: "Justice" },
    { name: "The Hermit" },
    { name: "Wheel of Fortune" },
    { name: "Strength" },
    { name: "The Hanged Man" },
    { name: "Death" },
    { name: "Temperance" },
    { name: "The Devil" },
    { name: "The Tower" },
    { name: "The Star" },
    { name: "The Moon" },
    { name: "The Sun" },
    { name: "Judgement" },
    { name: "The World" },
];

export class BigCellHand {

    private readonly bigCells: BigCell[];
    private readonly newBigCellTimer: ls.Timer;

    constructor() {
        this.bigCells = [];
        this.newBigCellTimer = new ls.Timer();
    }

    draw() {
        const lastCell = this.bigCells[this.bigCells.length - 1];
        if (lastCell && !this.newBigCellTimer.elapsed()) {
            ls.drawText(lastCell.name, ls.cameraPos.add(ls.vec2(0, 0)), .9, ls.hsl(), .1);
        }
    }

    add(bigCell: BigCell) {
        this.bigCells.push(bigCell);
        this.newBigCellTimer.set(2);
    }

}