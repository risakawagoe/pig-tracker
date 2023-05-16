import * as Leaflet from 'leaflet';

const DEFAULT_STATUS:string = "READY FOR PICKUP";

export class Report {
    readonly rid:string
    readonly name:string
    readonly phone:string
    readonly pid:string
    readonly breed:string
    readonly coords:Leaflet.LatLng
    readonly location:string
    readonly dateTime:Date
    readonly notes:string
    _status:string

    constructor(
        rid:string,
        name: string,
        phone:string,
        pid:string,
        breed:string,
        coords:Leaflet.LatLng,
        location:string,
        date:Date,
        notes:string
    ) {
        this.rid = rid
        this.name = name
        this.phone = phone
        this.pid = pid
        this.breed = breed
        this.coords = coords
        this.location = location
        this.dateTime = date
        this.notes = notes
        this._status = DEFAULT_STATUS
    }
}