import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Report } from './Report';
import { Location } from './Location';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

    private rootCollection:string = "pig-tracker-app"
    locations:Location[] = new Array()
    reports:Report[] = new Array()

    constructor(private http:HttpClient) { }


    getReports():Report[] {
        const url:string = 'https://272.selfip.net/apps/lXJgqEanCq/collections/' + this.rootCollection + '/documents/reports/'
        this.http.get(url).subscribe((data:any) => {
            console.log(data)
            this.reports = JSON.parse(data.data)
        })

        return this.reports
    }
    updateReports(reports:Report[]) {
        this.updateDocument("reports", JSON.stringify(reports))
    }
    
    updateLocations(locations:Location[]) {
        this.updateDocument("locations", JSON.stringify(locations))
    }
    getLocationsObservable():Observable<Object> {
        const url:string = 'https://272.selfip.net/apps/lXJgqEanCq/collections/' + this.rootCollection + '/documents/locations/'
        let obs = this.http.get(url)
        return obs
    }

    getObservable(document:string):Observable<Object> {
        const url:string = 'https://272.selfip.net/apps/lXJgqEanCq/collections/' + this.rootCollection + '/documents/' + document + '/'
        let obs = this.http.get(url)
        return obs
    }




    // basic storage methods ------------------------------------------

    // initial storage structure:
    // pig-tracker-app (collection) _____ locations (document): stores list of locations as arrays
    //                                |
    //                                |__ reports (document): stores list of reports as arrays
    initStorage() {
        // clear all data
        this.deleteCollection(this.rootCollection)
        setTimeout(()=>{}, 1000)
        
        // regenerate root collection and documents
        this.createCollection(this.rootCollection)
        setTimeout(()=>{}, 1000)
        this.createDocument(this.rootCollection, "reports", JSON.stringify(new Array<Report>()))
        this.createDocument(this.rootCollection, "locations", JSON.stringify(new Array<Location>()))
    }

    private updateDocument(document:string, data:string) {
        const url:string = 'https://272.selfip.net/apps/lXJgqEanCq/collections/' + this.rootCollection + '/documents/' + document + '/'

        this.http.put(url, {"key":document, "data": data} ).subscribe((data:any) => {
            console.log(data)
        })
    }

    private createCollection(name: string) {
        const url:string = 'https://272.selfip.net/apps/lXJgqEanCq/collections/'
        
        this.http.post(url, {"key":name, "readers":null, "writers":null}).subscribe((data:any) => {
            console.log(data)
        })
    }

    deleteCollection(name: string) {
        const url:string = 'https://272.selfip.net/apps/lXJgqEanCq/collections/' + name + '/'
        this.http.delete(url).subscribe()
    }

    private createDocument(collection:string, name: string, data:string) {
        const url:string = 'https://272.selfip.net/apps/lXJgqEanCq/collections/' + collection + '/documents/'
        
        this.http.post(url, {"key":name, "data":data} ).subscribe((data:any) => {
            console.log(data)
        })
    }
}
