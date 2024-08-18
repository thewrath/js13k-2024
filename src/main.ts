'use strict';

// import ressources
import tiles from './tiles.png';

// import module
import * as ls from 'littlejsengine';

import Match from './match';

ls.setShowSplashScreen(false);
ls.setCanvasPixelated(false);

const fallTime = .2;
const cameraOffset = ls.vec2(0, -.5);
const backgroundColor = ls.hsl(0, 0, 0);
const minMatchCount = 3;
const highScoreKey = 'puzzleBestScore';

// sound effects
const sound_goodMove = new ls.Sound([.4, .2, 250, .04, , .04, , , 1, , , , , 3]);
const sound_badMove = new ls.Sound([, , 700, , , .07, , , , 3.7, , , , 3, , , .1]);
const sound_fall = new ls.Sound([.2, , 1900, , , .01, , 1.4, , 91, , , , , , , , , , .7]);

let match: Match;
let levelFall: number[];
let levelSize: ls.Vector2 = ls.vec2(6, 12);
let fallTimer: ls.Timer;
let dragStartPos: ls.Vector2 | undefined;
let comboCount: number;
let score: number;
let bestScore: number;

// tiles
const tileColors =
  [
    ls.rgb(1, 0, 0),
    ls.rgb(1, 1, 1),
    ls.rgb(1, 1, 0),
    ls.rgb(0, 1, 0),
    ls.rgb(0, .6, 1),
    ls.rgb(.6, 0, 1),
    ls.rgb(.5, .5, .5),
  ];

const tileTypeCount = tileColors.length;

function gameInit() {
  // setup canvas
  ls.mainCanvas.style.background = "black";

  // load high score
  bestScore = localStorage[highScoreKey] || 0;

  match = new Match(levelSize, tileColors);

  // setup game
  ls.setCameraPos(levelSize.scale(.5).add(cameraOffset));
  ls.setCameraScale(64);
  ls.setGravity(-.004);
  fallTimer = new ls.Timer;
  comboCount = score = 0;
}

function gameUpdate() {
  if (fallTimer.isSet()) {
    // update falling tiles
    if (fallTimer.elapsed()) {
      // add more blocks in the top
      for (let x = 0; x < levelSize.x; ++x)
        match.setTile(ls.vec2(x, levelSize.y), ls.randInt(tileTypeCount));
    }

    // allow blocks to fall
    if (!fallTimer.active()) {
      // check if there is more to fall
      levelFall = [];
      let keepFalling = 0;
      const pos = ls.vec2();
      for (pos.x = levelSize.x; pos.x--;)
        for (pos.y = 0; pos.y < levelSize.y; pos.y++) {
          const data = match.getTile(pos);
          const abovePos = pos.add(ls.vec2(0, 1));
          const aboveData = match.getTile(abovePos);
          if (data == -1 && aboveData >= 0) {
            match.setTile(pos, aboveData);
            match.setTile(abovePos, -1);
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
          const startTile = match.getTile(dragStartPos);
          const endTile = match.getTile(mouseTilePos);
          if (startTile >= 0 && endTile >= 0) {
            // swap tiles
            match.setTile(mouseTilePos, startTile);
            match.setTile(dragStartPos, endTile);

            // try to clear matches
            clearMatches();

            // undo if no matches
            if (!fallTimer.isSet()) {
              sound_badMove.play();
              match.setTile(mouseTilePos, endTile);
              match.setTile(dragStartPos, startTile);
            }
            else
              sound_goodMove.play();
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

function gameUpdatePost() {

}

function gameRender() {
  // draw a black square for the background
  ls.drawRect(ls.cameraPos.subtract(cameraOffset), levelSize, ls.hsl(0, 0, 0));

  // draw the blocks
  let dragingBlockColor: ls.Color | undefined;
  const pos = ls.vec2();
  for (pos.x = levelSize.x; pos.x--;)
    for (pos.y = levelSize.y; pos.y--;) {
      const data = match.getTile(pos);
      if (data == -1)
        continue;

      const color = tileColors[data];

      // highlight drag start
      const drawPos = pos.add(ls.vec2(0.5));
      if (dragStartPos && pos.x == dragStartPos.x && pos.y == dragStartPos.y) {
        ls.drawRect(drawPos, ls.vec2(1.05));
        dragingBlockColor = color;
      }

      // make pieces fall gradually
      if (fallTimer.active() && levelFall[pos.x + pos.y * levelSize.x])
        drawPos.y += 1 - fallTimer.getPercent();

      // draw background
      ls.drawRect(drawPos, ls.vec2(.9), color);
    }

  if (dragingBlockColor)
    ls.drawRect(ls.mousePos, ls.vec2(1), dragingBlockColor);

  // draw a grey square at top to cover up incomming tiles
  ls.drawRect(ls.cameraPos.subtract(cameraOffset).add(ls.vec2(0, levelSize.y)), levelSize, backgroundColor);
}

function gameRenderPost() {
  // draw text on top of everything
  // ls.drawText('Score: ' + score, ls.cameraPos.add(ls.vec2(-3, -3.1)), .9, ls.hsl(), .1);
  // ls.drawText('Best: ' + bestScore, ls.cameraPos.add(ls.vec2(3, -3.1)), .9, ls.hsl(), .1);
}

///////////////////////////////////////////////////////////////////////////////
// find and remove all runs of 3 or higher
function clearMatches() {
  // horizontal match check
  const removeTiles = [], pos = ls.vec2();
  for (pos.y = levelSize.y; pos.y--;) {
    let runCount = 0;
    let runData = 0;
    for (pos.x = levelSize.x; pos.x--;) {
      const data = match.getTile(pos);
      if (data >= 0 && data == runData) {
        for (let i = ++runCount; runCount >= minMatchCount && i--;)
          removeTiles[pos.x + i + pos.y * levelSize.x] = 1;
      }
      else {
        runData = data;
        runCount = 1;
      }
    }
  }

  // vertical match check
  for (pos.x = levelSize.x; pos.x--;) {
    let runCount = 0;
    let runData = 0;
    for (pos.y = levelSize.y; pos.y--;) {
      const data = match.getTile(pos);
      if (data >= 0 && data == runData) {
        for (let i = ++runCount; runCount >= minMatchCount && i--;)
          removeTiles[pos.x + (pos.y + i) * levelSize.x] = 1;
      }
      else {
        runData = data;
        runCount = 1;
      }
    }
  }

  // remove tiles all at once like this to handle shapes like L or T
  let removedCount = 0;
  for (pos.x = levelSize.x; pos.x--;)
    for (pos.y = levelSize.y; pos.y--;) {
      if (removeTiles[pos.x + pos.y * levelSize.x]) {
        // remove tile
        ++removedCount;
        const data = match.getTile(pos);
        match.setTile(pos, -1);

        // spawn particles
        const color1 = tileColors[data];
        const color2 = color1.lerp(ls.hsl(), .5);
        new ls.ParticleEmitter(
          pos.add(ls.vec2(.5)), 0,  // pos, angle
          .5, .1, 200, ls.PI,       // emitSize, emitTime, emitRate, emiteCone
          ls.tile(0),                     // tileInfo
          color1, color2,                      // colorStartA, colorStartB
          color1.scale(1, 0), color2.scale(1, 0),// colorEndA, colorEndB
          .5, .3, .2, .05, .05, // particleTime, sizeStart, sizeEnd, speed, angleSpeed
          .99, 1, 1, ls.PI, .05,   // damp, angleDamp, gravityScale, particleCone, fadeRate
          .5, false, true              // randomness, collide, additive, colorLinear, renderOrder
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