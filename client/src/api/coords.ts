import {HexTile} from "./map";

export type Point = {
    x: number;
    y: number;
};

export type HexCoord = {
    p: number;
    q: number;
};

export class TileStore {
    private container: {[key: string]: HexTile};

    constructor() {
        this.container = {};
    }

    _makeKey(coord: HexCoord): string {
        return `${coord.p},${coord.q}`;
    }

    set(coord: HexCoord, tile: HexTile) {
        this.container[this._makeKey(coord)] = tile;
    }

    get(coord: HexCoord): HexTile {
        return this.container[this._makeKey(coord)];
    }

    values(): HexTile[] {
        return Object.values(this.container);
    }
}

export function hexToPixel(hex: HexCoord, hexRadius: number): Point {
    return {
        x: hexRadius * (Math.sqrt(3) * hex.p + Math.sqrt(3)/2 * hex.q),
        y: hexRadius * 3./2 * hex.q,
    };
}

export function pixelToHex(point: Point, hexRadius: number): HexCoord {
    return {
        p: (Math.sqrt(3)/3 * point.x - 1./3 * point.y) / hexRadius,
        q: 2./3 * point.y / hexRadius,
    }
}

export function hexCentre(hex: HexCoord): HexCoord {
    return {
        p: Math.round(hex.p),
        q: Math.round(hex.q),
    }
}

export function hexVec(a: HexCoord, b: HexCoord): HexCoord {
    return {
        p: b.p - a.p,
        q: b.q - a.q,
    }
}
