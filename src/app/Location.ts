import * as Leaflet from 'leaflet';

export class Location {
    readonly coords:Leaflet.LatLng
    readonly name:string
    _cases:number

    constructor(coords:Leaflet.LatLng, name:string) {
        this.coords = coords
        this.name = name
        this._cases = 0
    }
}