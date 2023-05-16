import { Directive, HostListener, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import * as Leaflet from 'leaflet';

// to fix "marker-shadow.png 404 not found" bug in leaflet (referred to lecture materials)
import { icon, Marker } from 'leaflet';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;


@Directive({
    selector: '[appMap]'
})
export class MapDirective implements OnInit {
    @Output() coords: EventEmitter<Leaflet.LatLng> = new EventEmitter();

    private map:any

    constructor(private elm:ElementRef) { }

    
    ngOnInit(): void {
        // load leafelt map
        this.map = Leaflet.map(this.elm.nativeElement).setView([49.24, -123], 11)
        Leaflet.tileLayer('https://api.mapbox.com/styles/v1/rkawagoe/clayrbf5w003o15k6q3z6nobe/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicmthd2Fnb2UiLCJhIjoiY2xheW1ocm45MGVtZDN1bW9kYTdwZnc1ZSJ9.Icopje-OCEfHiET66x8KOw', {
            maxZoom: 18,
            attribution: 'Map data&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(this.map)


        // pass coords data to ReportFormComponent on map-click
        var marker: Leaflet.Marker | null = null
        this.map.on('click', (evt:Leaflet.LeafletMouseEvent) => {
            if(marker !== null) {
                this.map.removeLayer(marker)
            }
            marker = Leaflet.marker(evt.latlng)
            marker.addTo(this.map)

            this.coords.emit(evt.latlng)
        })
    }
}
