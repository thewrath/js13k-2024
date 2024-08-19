import * as ls from 'littlejsengine';

export default class Lap {

    private readonly betDuration: number;
    private readonly matchDuration: number;

    private readonly betTimer: ls.Timer;
    private readonly matchTimer: ls.Timer;

    private isPaused: boolean = true;

    constructor(betDuration: number, matchDuration: number) {
        this.betDuration = betDuration;
        this.matchDuration = matchDuration;

        this.betTimer = new ls.Timer;
        this.matchTimer = new ls.Timer;
    }

    update() {

        if (this.isPaused && ls.mouseIsDown(0)) {
            this.betTimer.set(this.betDuration);
            this.isPaused = false;
        }

        if (this.betTimer.isSet() && this.betTimer.elapsed()) {
            this.matchTimer.set(this.matchDuration);
            this.betTimer.unset();
        }

        if (this.matchTimer.isSet() && this.matchTimer.elapsed()) {
            this.betTimer.set(this.betDuration);
            this.matchTimer.unset();
        }
    }

    isBetTime() {
        return this.betTimer.active();
    }

    isMatchTime() {
        return true;
       //return this.matchTimer.active();
    }

    isPauseTime() {
        return this.isPaused;
    }

    drawLapHud() {
        if (this.isPauseTime()) {
            ls.drawText(`Tap to start`, ls.cameraPos.add(ls.vec2(0, 0)), .9, ls.hsl(), .1);
            return;
        }

        // ls.drawText(`Bet timer:`, ls.cameraPos.add(ls.vec2(-1, -6.5)), .9, ls.hsl(), .1);
        // ls.drawText(`${Math.abs(this.betTimer.get()).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, ls.cameraPos.add(ls.vec2(2.7, -6.5)), .9, ls.hsl(), .1);

        // ls.drawText(`Match timer:`, ls.cameraPos.add(ls.vec2(-.5, -7.5)), .9, ls.hsl(), .1);
        // ls.drawText(`${Math.abs(this.matchTimer.get()).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, ls.cameraPos.add(ls.vec2(2.7, -7.5)), .9, ls.hsl(), .1);
    }
}