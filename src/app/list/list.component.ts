import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'

import { StorageService } from '../storage.service';
import { HashService } from '../hash.service';
import { Location } from '../Location';
import { Report } from '../Report';
;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    locations:Location[] = new Array()
    reports:Report[] = new Array()
    private locationSubscription:Observable<Object>
    private reportSubscription:Observable<Object>

    // dialog
    modalActive:Boolean = false
    passValidated:Boolean = false
    targetPID:string = ''
    dialogTitle = "Delete report"
    validationMsg:string = "Password was incorrect. Please try again."
    private scrollPosition:Number = 0


    constructor(private router: Router, private storage:StorageService, private hash:HashService) {
        this.reportSubscription = this.storage.getObservable("reports")
        this.locationSubscription = this.storage.getObservable("locations")
    }
    
    ngOnInit(): void {
        this.reportSubscription.subscribe((data:any) => {
            this.reports = JSON.parse(data.data)
        })
        this.locationSubscription.subscribe((data:any) => {
            this.locations = JSON.parse(data.data)
        })
    }


    viewReport(evt: Event) {
        const button = evt.currentTarget as HTMLButtonElement | null
        const div = button?.parentElement as HTMLDivElement | null
        const li = div?.parentElement as HTMLUListElement | null
        var id = li?.id
        
        if(id) {
            this.router.navigate(["report", id])
        }
    }
    
    openDialog(evt:Event) {
        this.dialogTitle = "Delete report"
        this.modalActive = true
        this.disableScroll()

        const button = evt.currentTarget as HTMLButtonElement | null
        const div = button?.parentElement as HTMLDivElement | null
        const li = div?.parentElement as HTMLUListElement | null
        var id = li?.id

        if(id !== null) {
            this.targetPID = String(id)
        }
    }
    
    deleteReport() {
        const pass = document.getElementById('pass') as HTMLInputElement | null
        if(pass !== null) {
            let hashSubscriber = this.hash.MD5Observable(pass.value)
            hashSubscriber.subscribe((data:any) => {
                if(data.Digest === '84892b91ef3bf9d216bbc6e88d74a77c') {
                    var idx = -1
                    for(let i = 0; i < this.reports.length; i++) {
                        if(this.reports[i].rid === this.targetPID) {
                            idx = i
                            break;
                        }
                    }

                    if(idx !== -1) {
                        const location = this.reports[idx].location

                        this.reports.splice(idx, 1)
                        this.storage.updateReports(this.reports)
                        this.updateCases(false, location)
                        this.dialogTitle = 'Success!'
                        this.validationMsg = 'Report (rid: ' + this.targetPID + ') was successfully deleted.'
                    }else {
                        this.dialogTitle = 'Sorry...'
                        this.validationMsg = 'Something went wrong. Refresh the page and try again.'
                    }
                    
                }else {
                    this.dialogTitle = 'Password error'
                    this.validationMsg = "Password was incorrect. Please try again."
                }
                this.passValidated = true
                this.targetPID = ''
            })
        }else {
            this.closeDialog()
        }
    }
    
    closeDialog() {
        this.modalActive = false
        this.passValidated = false
        this.targetPID = ''
        this.enableScroll()
    }


    updateCases(inc: Boolean, location: string) {
        for(let i = 0; i < this.locations.length; i++) {
            if(this.locations[i].name === location) {
                if(inc) {
                    this.locations[i]._cases++
                }else {
                    this.locations[i]._cases--
                }
            }
        }

        this.storage.updateLocations(this.locations)
    }

    // sorts array reports by the given attribute
    sortReportsBy(evt:Event) {
        const select = evt.target as HTMLSelectElement | null
        if(select !== null) {
            const attr = select.value
            
            if(attr === 'location') {
                this.reports.sort((r1:Report, r2:Report) => {
                    if(r1.location < r2.location) {
                        return -1
                    }
                    if(r1.location > r2.location) {
                        return 1
                    }
                    return 0
                })
            }else if(attr === 'reporter') {
                this.reports.sort((r1:Report, r2:Report) => {
                    if(r1.name < r2.name) {
                        return -1
                    }
                    if(r1.name > r2.name) {
                        return 1
                    }
                    return 0
                })
            }else if(attr === 'time') {
                this.reports.sort((r1:Report, r2:Report) => {
                    if(r1.dateTime < r2.dateTime) {
                        return -1
                    }
                    if(r1.dateTime > r2.dateTime) {
                        return 1
                    }
                    return 0
                })
            }
        }
        
    }


    // code adapted from: https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
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
