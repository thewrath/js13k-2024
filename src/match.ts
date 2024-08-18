import * as ls from 'littlejsengine';

export default class Match {

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
}