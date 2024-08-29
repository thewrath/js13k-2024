'use strict';

import * as ls from 'littlejsengine';

export const buildColorGradient = (fromColor: ls.Color, toColor: ls.Color, nstep: number): ls.Color[] => {
    const result = [];
    const percent = 1 / nstep;

    for (let i = 0; i < nstep; i++) {
        result.push(fromColor.lerp(toColor, percent * i));
    }

    return result;
}