import * as ls from 'littlejsengine';

export default class Match {

    private readonly minMatchCount = 3;

    private level: number[] = [];
    private levelSize: ls.Vector2;

    constructor(levelSize: ls.Vector2, tiles: ls.Color[]) {
        this.levelSize = levelSize;

        // randomize level
        const pos = ls.vec2();
        for (pos.x = this.levelSize.x; pos.x--;)
            for (pos.y = this.levelSize.y; pos.y--;)
                this.setTile(pos, ls.randInt(tiles.length));
    }

    getTile(pos: ls.Vector2): number {
        return this.level[pos.x + pos.y * this.levelSize.x];
    }

    setTile(pos: ls.Vector2, data: number): void {
        this.level[pos.x + pos.y * this.levelSize.x] = data;
    }

    getVerticalMatch(x: number) {
        const removeTiles = [];
        let runCount = 0;
        let runData = 0;
        let pos = ls.vec2(x, 0);
        for (pos.y = this.levelSize.y; pos.y--;) {
            const data = this.getTile(pos);
            if (data >= 0 && data == runData) {
                for (let i = ++runCount; runCount >= this.minMatchCount && i--;)
                    removeTiles[pos.x + (pos.y + i) * this.levelSize.x] = 1;
            }
            else {
                runData = data;
                runCount = 1;
            }
        }

        return removeTiles;
    }

    getHorizontalMatch(y: number) {
        const removeTiles = [];
        let runCount = 0;
        let runData = 0;
        let pos = ls.vec2(0, y);
        for (pos.x = this.levelSize.x; pos.x--;) {
            const data = this.getTile(pos);
            if (data >= 0 && data == runData) {
                for (let i = ++runCount; runCount >= this.minMatchCount && i--;)
                    removeTiles[pos.x + i + pos.y * this.levelSize.x] = 1;
            }
            else {
                runData = data;
                runCount = 1;
            }
        }
        return removeTiles;
    }
}