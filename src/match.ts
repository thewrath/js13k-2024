import * as ls from 'littlejsengine';

type Cell = {
    arcane: Arcane
    index: number
}

enum Arcane {
    Fire,
    Water,
    Earth,
    Air,
    Major
}

export default class Match {

    private readonly minMatchCount = 3;
    private readonly nextCells: Cell[];

    private level: Cell[] = [];
    private levelSize: ls.Vector2;

    public readonly ArcaneColors: Map<Arcane, ls.Color> = new Map([
        [Arcane.Water, ls.randColor()],
        [Arcane.Fire, ls.randColor()],
        [Arcane.Air, ls.randColor()],
        [Arcane.Major, ls.randColor()],
        [Arcane.Earth, ls.randColor()]
    ]);

    constructor(levelSize: ls.Vector2) {
        this.levelSize = levelSize;

        this.nextCells = this.generateCells();

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
            Arcane.Air
        ];

        const cells: Cell[] = [];
        for (const arcane of arcanes.concat(arcanes, Arcane.Major)) {
            for (let i = 14; i--;) {
                cells.push({ arcane: arcane, index: i });
            }
        }

        return cells
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
            ;
    }

    getNextCell(): Cell | undefined {
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

    getVerticalMatch(x: number) {
        const removeTiles = [];
        let runCount = 0;
        let runArcane: Arcane | undefined = undefined;
        let pos = ls.vec2(x, 0);
        for (pos.y = this.levelSize.y; pos.y--;) {
            const cell = this.getCell(pos);
            if (cell != undefined && cell.arcane == runArcane) {
                for (let i = ++runCount; runCount >= this.minMatchCount && i--;)
                    removeTiles[pos.x + (pos.y + i) * this.levelSize.x] = 1;
            }
            else {
                runArcane = cell?.arcane;
                runCount = 1;
            }
        }

        return removeTiles;
    }

    getHorizontalMatch(y: number) {
        const removeTiles = [];
        let runCount = 0;
        let runArcane = 0;
        let pos = ls.vec2(0, y);
        for (pos.x = this.levelSize.x; pos.x--;) {
            const cell = this.getCell(pos);
            if (cell != undefined && cell.arcane == runArcane) {
                for (let i = ++runCount; runCount >= this.minMatchCount && i--;)
                    removeTiles[pos.x + i + pos.y * this.levelSize.x] = 1;
            }
            else {
                runArcane = cell?.arcane;
                runCount = 1;
            }
        }
        return removeTiles;
    }
}