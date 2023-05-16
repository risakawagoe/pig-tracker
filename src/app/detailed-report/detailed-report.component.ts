import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { StorageService } from '../storage.service';
import { HashService } from '../hash.service';
import { Report } from '../Report';


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
  selector: 'app-detailed-report',
  templateUrl: './detailed-report.component.html',
  styleUrls: ['./detailed-report.component.css']
})
export class DetailedReportComponent implements OnInit {
    rid: string = ''
    idx = -1 // index of report in list of reports
    reports:Report[] = new Array()
    private reportSubscription:Observable<Object>

    // dialog
    passValidated = false
    modalActive = false
    dialogTitle:string = "Change status"
    validationMsg = "Password was incorrect. Please try again."
    private scrollPosition:Number = 0

    // map
    private map:any


    constructor(private ActivatedRoute: ActivatedRoute, private router: Router, private storage:StorageService, private hash:HashService) {
        this.reportSubscription = this.storage.getObservable("reports")
    }


    ngOnInit(): void {
        this.reportSubscription.subscribe((data:any) => {
            this.reports = JSON.parse(data.data)
            this.findReport()

            if(this.idx !== -1) {
                this.map = Leaflet.map('mapid').setView(this.reports[this.idx].coords, 13)
                Leaflet.tileLayer('https://api.mapbox.com/styles/v1/rkawagoe/clayrbf5w003o15k6q3z6nobe/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicmthd2Fnb2UiLCJhIjoiY2xheW1ocm45MGVtZDN1bW9kYTdwZnc1ZSJ9.Icopje-OCEfHiET66x8KOw', {
                    maxZoom: 18,
                    attribution: 'Map data&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a',
                    tileSize: 512,
                    zoomOffset: -1
                }).addTo(this.map)


                const extraNotes = this.reports[this.idx].notes !== null ? this.reports[this.idx].notes: 'not provided'

                Leaflet.marker(this.reports[this.idx].coords).addTo(this.map).bindPopup('<b>' + this.reports[this.idx].location + '</b><br>Extra notes: ' + extraNotes).openPopup()
            }
        })

        const paramRid = this.ActivatedRoute.snapshot.paramMap.get('rid')
        if(paramRid !== null) {
            this.rid = paramRid
        }
    }

    navHome() {
        this.router.navigate(["/"])
    }

    findReport() {
        for(let idx in this.reports) {
            if(this.reports[idx].rid === this.rid) {
                this.idx = Number(idx)
            }
        }
    }

    changeStatus() {
        // prompt password
        const pass = document.getElementById('pass') as HTMLInputElement | null
        if(pass !== null) {
            let hashSubscriber = this.hash.MD5Observable(pass.value)
            hashSubscriber.subscribe((data:any) => {
                if(data.Digest === '84892b91ef3bf9d216bbc6e88d74a77c') {
                    if(this.idx != -1) {
                        if(this.reports[this.idx]._status === 'READY FOR PICKUP') {
                            this.reports[this.idx]._status = 'RETRIEVED'
                        }else if(this.reports[this.idx]._status === 'RETRIEVED') {
                            this.reports[this.idx]._status = 'READY FOR PICKUP'
                        }
                        this.storage.updateReports(this.reports)
                        this.dialogTitle = 'Success!'
                        this.validationMsg = "Status was successfully changed to " + this.reports[this.idx]._status + '.'
                    }else {
                        this.dialogTitle = 'Sorry...'
                        this.validationMsg = "Something went wrong. Refresh the page and try again."
                    }
                }else {
                    this.dialogTitle = 'Password error'
                    this.validationMsg = "Password was incorrect. Please try again."
                }

                this.passValidated = true
            })
        }else {
            this.closeDialog()
        }
    }

    openDialog() {
        this.dialogTitle = "Change status"
        this.modalActive = true
        this.disableScroll()
    }

    closeDialog() {
        this.modalActive = false
        this.passValidated = false
        this.enableScroll()
    }


    // adapted code from: https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
    disableScroll() {
        this.scrollPosition = window.scrollY
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
    }
    enableScroll() {
        document.body.style.position = '';
        window.scrollTo(0, this.scrollPosition as number);
        document.body.style.top = '';
    }
}
