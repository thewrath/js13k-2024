'use strict';

// import ressources
import tiles from './tiles.png';

// import module
import * as ls from 'littlejsengine';

function gameInit()
{
  
}

function gameUpdate()
{

}

function gameUpdatePost()
{

}

function gameRender()
{
  
}

function gameRenderPost()
{
  ls.drawTextScreen('Hello JS13K!', ls.mainCanvasSize.scale(.5), 80);
}

ls.engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [tiles]);