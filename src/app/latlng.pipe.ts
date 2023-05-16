import { Pipe, PipeTransform } from '@angular/core';
import * as Leaflet from 'leaflet';

@Pipe({
    name: 'latlng'
})
export class LatlngPipe implements PipeTransform {

    transform(coords: Leaflet.LatLng|null): string {
        if(coords === null) {
            return "(latitude, longitude)";
        }
        return '(' + coords.lat + ', ' + coords.lng + ')';
    }
}
