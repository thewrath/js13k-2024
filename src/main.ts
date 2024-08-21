'use strict';

// import ressources
import tiles from './tiles.png';

// import module
import * as ls from 'littlejsengine';

import Match from './match';
import Lap from './lap';

ls.setShowSplashScreen(false);
ls.setCanvasPixelated(true);
ls.setCanvasFixedSize(ls.vec2(720, 1280));
ls.setCameraScale(16*7);

const fallTime = .2;
const highScoreKey = 'puzzleBestScore';

// sound effects
const sound_goodMove = new ls.Sound([.4, .2, 250, .04, , .04, , , 1, , , , , 3]);
const sound_badMove = new ls.Sound([, , 700, , , .07, , , , 3.7, , , , 3, , , .1]);
const sound_fall = new ls.Sound([.2, , 1900, , , .01, , 1.4, , 91, , , , , , , , , , .7]);

let match: Match;
let lap: Lap;

let levelFall: number[];
let levelSize: ls.Vector2 = ls.vec2(6, 10);
let fallTimer: ls.Timer;
let dragStartPos: ls.Vector2 | undefined;
let comboCount: number;
let score: number;
let bestScore: number;

let season: number;

function gameInit() {
  // setup canvas
  ls.mainCanvas.style.background = "black";

  // load high score
  bestScore = localStorage[highScoreKey] || 0;

  match = new Match(levelSize);
  lap = new Lap(13, 10);

  // setup game
  ls.setCameraPos(levelSize.scale(.5));
  // ls.setCameraScale(64);
  ls.setGravity(-.004);
  fallTimer = new ls.Timer;
  comboCount = score = 0;

  season = 0;
}

function gameUpdate() {
  lap.update();

  // Match
  if (lap.isMatchTime()) {
    if (fallTimer.isSet()) {
      // update falling tiles
      if (fallTimer.elapsed()) {
        // add more blocks in the top
        for (let x = 0; x < levelSize.x; ++x) {
          if (match.getCell(ls.vec2(x, levelSize.y)) != undefined) continue;
          const cell = match.getNextCell();
          cell && match.setCell(ls.vec2(x, levelSize.y), cell);
        }
      }

      // allow blocks to fall
      if (!fallTimer.active()) {
        // check if there is more to fall
        levelFall = [];
        let keepFalling = 0;
        const pos = ls.vec2();
        for (pos.x = levelSize.x; pos.x--;)
          for (pos.y = 0; pos.y < levelSize.y; pos.y++) {
            const cell = match.getCell(pos);
            const abovePos = pos.add(ls.vec2(0, 1));
            const aboveCell = match.getCell(abovePos);
            if (cell == undefined && aboveCell != undefined) {
              match.setCell(pos, aboveCell);
              match.setCell(abovePos, undefined);
              levelFall[pos.x + pos.y * levelSize.x] = keepFalling = 1;
            }
          }

        if (keepFalling) {
          const p = ls.percent(comboCount, 9, 0);
          fallTimer.set(fallTime * p);
          sound_fall.play();
        }
        else
          fallTimer.unset();
      }
    }
    else {
      // try to clear matches
      clearMatches();
      if (!fallTimer.isSet()) {
        // mouse/touch control
        const mouseTilePos = ls.mousePos.floor();
        if (!ls.mousePos.arrayCheck(levelSize)) {
          // cancel drag if mouse is not in the level bounds
          dragStartPos = undefined;
        }
        else if (ls.mouseWasPressed(0) && !dragStartPos) {
          // start drag
          dragStartPos = mouseTilePos.copy();
        }
        else if (ls.mouseIsDown(0) && dragStartPos) {
          // if dragging to a neighbor tile
          const dx = ls.abs(dragStartPos.x - mouseTilePos.x);
          const dy = ls.abs(dragStartPos.y - mouseTilePos.y);
          if (dx == 1 && dy == 0 || dx == 0 && dy == 1) {
            const startCell = match.getCell(dragStartPos);
            const endCell = match.getCell(mouseTilePos);
            if (startCell != undefined && endCell != undefined) {
              // swap tiles
              match.setCell(mouseTilePos, startCell);
              match.setCell(dragStartPos, endCell);

              // try to clear matches
              clearMatches();

              // undo if no matches
              if (!fallTimer.isSet()) {
                sound_badMove.play();
                match.setCell(mouseTilePos, endCell);
                match.setCell(dragStartPos, startCell);
              }
              else {
                sound_goodMove.play();
              }
              dragStartPos = undefined;
            }
          }
        }
        else
          dragStartPos = undefined;
      }
    }

    if (score > bestScore) {
      // update high score
      bestScore = score;
      localStorage[highScoreKey] = bestScore;
    }
  }
}

function gameUpdatePost() {

}

function gameRender() {
  // draw a black square for the background
  ls.drawRect(ls.cameraPos, levelSize, ls.hsl(0, 0, 0));

  // draw the blocks
  let dragingBlockColor: ls.Color | undefined;
  const pos = ls.vec2();
  for (pos.x = levelSize.x; pos.x--;)
    for (pos.y = levelSize.y; pos.y--;) {
      const cell = match.getCell(pos);
      if (cell == undefined)
        continue;

      const color = match.ArcaneColors.get(cell.arcane);

      // highlight drag start
      const drawPos = pos.add(ls.vec2(0.5));
      let isDragged = false;
      if (dragStartPos && pos.x == dragStartPos.x && pos.y == dragStartPos.y) {
        dragingBlockColor = color;
        isDragged = true;
      }

      // make pieces fall gradually
      if (fallTimer.active() && levelFall[pos.x + pos.y * levelSize.x])
        drawPos.y += 1 - fallTimer.getPercent();

      // draw background
      !isDragged && ls.drawTile(drawPos, ls.vec2(.9), ls.tile(season), color);
      !isDragged && ls.drawTile(drawPos, ls.vec2(.5), ls.tile(22, 8), match.ArcaneColors.get(1));
      // !isDragged && ls.drawText((cell.index + 1).toString(), drawPos, .5, ls.rgb(1));
    }

  if (dragingBlockColor)
    ls.drawTile(ls.mousePos, ls.vec2(1), ls.tile(season), dragingBlockColor);

  // draw a grey square at top to cover up incomming tiles
  ls.drawRect(ls.cameraPos.add(ls.vec2(0, levelSize.y)), levelSize, ls.rgb(0, 0, 0));
}

function gameRenderPost() {
  lap.drawLapHud();
}

///////////////////////////////////////////////////////////////////////////////
// find and remove all runs of 3 or higher
function clearMatches() {
  let removeTiles: number[] = [];

  for (let y = levelSize.y; y--;) {
    removeTiles = removeTiles.concat(match.getHorizontalMatch(y))
  }

  for (let x = levelSize.x; x--;) {
    removeTiles = removeTiles.concat(match.getVerticalMatch(x))
  }

  // remove tiles all at once like this to handle shapes like L or T
  let removedCount = 0;
  let pos = ls.vec2(0);
  for (pos.x = levelSize.x; pos.x--;)
    for (pos.y = levelSize.y; pos.y--;) {
      if (removeTiles[pos.x + pos.y * levelSize.x]) {
        // remove tile
        ++removedCount;
        const cell = match.getCell(pos);
        if (cell == undefined) continue;
        match.setCell(pos, undefined, true);

        // spawn particles
        const color1 = match.ArcaneColors.get(cell.arcane);
        new ls.ParticleEmitter(
          pos.add(ls.vec2(.5)), 0,  // pos, angle
          .5, .1, 200, ls.PI,       // emitSize, emitTime, emitRate, emiteCone
          ls.tile(0),                     // tileInfo
          color1, color1,                      // colorStartA, colorStartB
          color1, color1,// colorEndA, colorEndB
          .5, .3, .2, .05, .05, // particleTime, sizeStart, sizeEnd, speed, angleSpeed
          .99, 1, 1, ls.PI, .05,   // damp, angleDamp, gravityScale, particleCone, fadeRate
          .5, true, true              // randomness, collide, additive, colorLinear, renderOrder
        );
      }
    }

  if (removedCount) {
    score += ++comboCount * removedCount;
    fallTimer.set();
    levelFall = [];
  }
  else
    comboCount = 0;
}

ls.engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [tiles]);