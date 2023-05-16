import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Location } from '../Location';
import { StorageService } from '../storage.service';


// map
import * as Leaflet from 'leaflet';

// to fix "marker-shadow.png 404 not found" bug in leaflet
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



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnInit {
    private map:any
    private locations:Location[] = new Array()
    locationSubscription:Observable<Object>

    constructor(private storage:StorageService) {
        this.locationSubscription = this.storage.getLocationsObservable()
    }

    ngOnInit(): void {
        this.locationSubscription.subscribe((data:any) => {
            this.locations = JSON.parse(data.data)
            for(let i in this.locations) {
                if(this.locations[i]._cases > 0) {
                    Leaflet.marker(this.locations[i].coords).addTo(this.map).bindPopup('<b>' + this.locations[i].name + '</b><br>' + this.locations[i]._cases + ' cases reported')
                }
            }
        })
    }

    ngAfterViewInit(): void {
        this.map = Leaflet.map('main-map').setView([49.2, -123], 11)

        Leaflet.tileLayer('https://api.mapbox.com/styles/v1/rkawagoe/clayrbf5w003o15k6q3z6nobe/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicmthd2Fnb2UiLCJhIjoiY2xheW1ocm45MGVtZDN1bW9kYTdwZnc1ZSJ9.Icopje-OCEfHiET66x8KOw', {
            maxZoom: 18,
            attribution: 'Map data&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(this.map)


        for(let i in this.locations) {
            Leaflet.marker(this.locations[i].coords).addTo(this.map).bindPopup('<b>' + this.locations[i].name + '<b/><br>' + this.locations[i]._cases + ' cases reported')
        }
    }
}
