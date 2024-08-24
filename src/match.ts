import * as ls from 'littlejsengine';

type Cell = {
    arcane: Arcane
    index: number
}

export enum Arcane {
    Fire,
    Water,
    Earth,
    Air,
    Major
}

type CellMatcher = (cellA: Cell, cellB: Cell, runCount: number) => boolean;

const minorColor = ls.randColor();
const majorColor = ls.randColor();

export default class Match {

    private readonly minMatchCount = 3;
    private nextCells: Cell[];

    private level: Cell[] = [];
    private levelSize: ls.Vector2;

    public readonly ArcaneColors: Map<Arcane, ls.Color> = new Map([
        [Arcane.Water, minorColor.lerp(ls.rgb(1), 0.9)],
        [Arcane.Fire, minorColor.lerp(ls.rgb(1), 0.6)],
        [Arcane.Air, minorColor.lerp(ls.rgb(1), 0.3)],
        [Arcane.Earth, minorColor.lerp(ls.rgb(1), 0.0)],
        [Arcane.Major, majorColor]
    ]);

    constructor(levelSize: ls.Vector2) {
        this.levelSize = levelSize;

        this.nextCells = this.generateCells();
        this.shuffleNextCells();

        console.log(JSON.stringify([...this.ArcaneColors]));

        // randomize level
        const pos = ls.vec2();
        for (pos.x = this.levelSize.x; pos.x--;)
            for (pos.y = this.levelSize.y; pos.y--;)
                this.setCell(pos, this.getNextCell());
    }

    generateCells(): Cell[] {
        let arcanes = [
            Arcane.Fire,
            Arcane.Water,
            Arcane.Earth,
            Arcane.Air,
            Arcane.Major
        ];

        // Todo generate major arcanes

        const cells: Cell[] = [];
        for (let i = 0; i < arcanes.length * 2; i++)
            for (let i = 14; i--;)
                cells.push({ arcane: arcanes[i % arcanes.length], index: i % 7});

        return cells;
    }

    private shuffleNextCells() {
        this.nextCells = this.nextCells
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
            ;
    }

    getNextCell(): Cell | undefined {
        // TODO perf
        this.shuffleNextCells();
        return this.nextCells.shift();
    }

    getCell(pos: ls.Vector2): Cell {
        return this.level[pos.x + pos.y * this.levelSize.x];
    }

    setCell(pos: ls.Vector2, cell: (Cell | undefined), keepCell = false): void {
        const cellIndex = pos.x + pos.y * this.levelSize.x;
        if (cell) {
            this.level[cellIndex] = cell;
        } else {
            const oldCell = this.level[cellIndex];
            if (oldCell && keepCell) {
                this.nextCells.push(oldCell);
            }
            delete this.level[cellIndex];
        }
    }

    getMatch() {
        let removeTiles: number[] = [];

        const colorMatch = (cellA: Cell, cellB: Cell, runCount: number): boolean => {
            return cellA.arcane == cellB.arcane;
        };

        for (const match of [colorMatch]) {
            for (let y = this.levelSize.y; y--;) {
                removeTiles = removeTiles.concat(this.getHorizontalMatch(y, match))
            }

            for (let x = this.levelSize.x; x--;) {
                removeTiles = removeTiles.concat(this.getVerticalMatch(x, match))
            }
        }

        return removeTiles;
    }

    private getVerticalMatch(x: number, cellMatcher: CellMatcher) {
        const removeTiles = [];
        let runCount = 0;
        let runCell: Cell | undefined;
        let pos = ls.vec2(x, 0);
        for (pos.y = this.levelSize.y; pos.y--;) {
            const cell = this.getCell(pos);
            if (cell && runCell && cellMatcher(runCell, cell, runCount)) {
                for (let i = ++runCount; runCount >= this.minMatchCount && i--;)
                    removeTiles[pos.x + (pos.y + i) * this.levelSize.x] = 1;
            }
            else {
                runCell = cell;
                runCount = 1;
            }
        }

        return removeTiles;
    }

    private getHorizontalMatch(y: number, cellMatcher: CellMatcher) {
        const removeTiles = [];
        let runCount = 0;
        let runCell: Cell | undefined;
        let pos = ls.vec2(0, y);
        for (pos.x = this.levelSize.x; pos.x--;) {
            const cell = this.getCell(pos);
            if (cell && runCell && cellMatcher(runCell, cell, runCount + 1)) {
                for (let i = ++runCount; runCount >= this.minMatchCount && i--;)
                    removeTiles[pos.x + i + pos.y * this.levelSize.x] = 1;
            }
            else {
                runCell = cell;
                runCount = 1;
            }
        }
        return removeTiles;
    }
}