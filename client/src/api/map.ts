// A class that handles the API calls to the backend for the map
// Let there be an API /apt/tiles that takes two extent points and returns the tiles within that extent
// The API will return a list of tiles, each tile represented by a list of coordinates
// The coordinates are in axial coordinates

import {TileStore, HexCoord, hexToPixel, pixelToHex, hexCentre} from './coords';
import axios from "axios";

export interface HexTile {
    p: number;
    q: number;
    elevation: number;
    type: string;
    notes: string;
}

export class MapClient {
    apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async getTiles(centre: HexCoord, width: number, height: number): Promise<HexTile[]> {
        return axios.get(`${this.apiUrl}/tiles`, {
            params: {
                p: centre.p,
                q: centre.q,
                width: width,
                height: height
            }
        }).then(response => {
            let hexes = new TileStore(); // this._getEmptyGrid(centre, width, height);
            response.data.forEach((hex: HexTile) => hexes.set({p: hex.p, q: hex.q}, hex));
            return hexes.values();
        });
    }

    _getEmptyGrid(centre: HexCoord, width: number, height: number): TileStore {
        let hexes: TileStore = new TileStore();
        const centrePx = hexToPixel(centre, 1);
        for (let x = centrePx.x - width / 2; x <= centrePx.x + width / 2; x++) {
            for (let y = centrePx.y - height / 2; y <= centrePx.y + height / 2; y++) {
                let hexCoord = hexCentre(pixelToHex({x, y}, 1));
                console.log(`${x}, ${y} => ${hexCoord.p}, ${hexCoord.q}`);
                hexes.set(
                    hexCoord,
                    {p: hexCoord.p, q: hexCoord.q, elevation: 0, type: `#aaa`, notes: ''}
                );
            }
        }
        return hexes;
    }
}
