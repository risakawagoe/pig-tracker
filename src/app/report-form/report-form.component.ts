import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
// uuid generator from: https://www.npmjs.com/package/angular-uuid

import { StorageService } from '../storage.service';
import { Location } from '../Location';
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
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnInit {
    locations:Location[] = new Array()
    reports:Report[] = new Array()
    locationSubscription:Observable<Object>
    reportSubscription:Observable<Object>
    
    form:FormGroup
    coords:Leaflet.LatLng | null = null
    new_location:string = ""

    // form state
    submittedE = false // submitted with existing location chosen
    submittedN = false // submitted with new location chosen
    existingLocationValid = false
    newLocationValid = false
    fromExisting = true

    // error message
    locationNameErrMsg:string = "Please enter a valid name for the location."



    constructor(private router: Router, private http: HttpClient, private storage:StorageService) { 
        this.locationSubscription = this.storage.getObservable("locations")
        this.reportSubscription = this.storage.getObservable("reports")

        let formControls = {
            name: new FormControl('',[
              Validators.required,
              this.notBlank
            ]),
            phone: new FormControl('', [
                Validators.required,
                this.possiblePhoneNumber
            ]),
            pid: new FormControl('', [
                Validators.required,
                this.positiveInteger
            ]),
            breed: new FormControl('', [
                Validators.required,
                this.notBlank
            ]),
            location: new FormControl(),
            newLocation: new FormControl(),
            dateTime: new FormControl('', [
                Validators.required
            ]),
            notes: new FormControl()
        }

        this.form = new FormGroup(formControls)
    }



    ngOnInit(): void {
        this.locationSubscription.subscribe((data:any) => {
            this.locations = JSON.parse(data.data)
            this.fromExisting = this.locations.length > 0 ? true : false
        })
        this.reportSubscription.subscribe((data:any) => {
            this.reports = JSON.parse(data.data)
        })
    }

    onLocationSelectChange(evt:Event) {
        var select = evt.target as HTMLSelectElement

        if(select.selectedIndex === 0) {
            this.existingLocationValid = false
        }else {
            this.existingLocationValid = true
        }
    }

    onNewLocationInput() {
        if(this.new_location.length === 0 || this.new_location.trim().length === 0) {
            this.locationNameErrMsg = "Please enter a valid name for the location."
            this.newLocationValid = false
        }else if(this.locations.find(el => el.name === this.new_location.trim())) {
            this.locationNameErrMsg = this.new_location + " is already used. Please choose another name for the location."
            this.newLocationValid = false
        }else {
            this.newLocationValid = true
        }
    }

    toggleBar() {
        this.fromExisting = !this.fromExisting
    }

    navHome() {
        this.router.navigate(["/"])
    }

    onCoordsUpdate(update:Leaflet.LatLng) {
        this.coords = update
    }

    onSubmit() {
        var result:Boolean = this.form.valid

        if(this.fromExisting) {
            this.submittedE = true
            result = result && this.existingLocationValid
        }else {
            this.submittedN = true
            const pin = this.checkPin()
            result = result && this.newLocationValid && pin
        }

        if(result) {
            this.createReport()
            this.navHome()
        }
    }

    createReport():void {
        const rid = uuid.v4()
        const location = this.fromExisting ? this.locations.find(el => (el.coords === this.form.controls['location'].value))! : this.addLocation()

        const notes:string = this.form.controls['notes'].value === null || this.form.controls['notes'].value.trim().length === 0 
                            ? 'not provided' : this.form.controls['notes'].value

        var report = new Report(
            rid,
            this.form.controls['name'].value,
            this.form.controls['phone'].value,
            this.form.controls['pid'].value,
            this.form.controls['breed'].value,
            location.coords,
            location.name,
            this.form.controls['dateTime'].value,
            notes
        )


        this.reports.push(report)
        this.storage.updateReports(this.reports)
        this.updateCases(true, location.name)
    }

    addLocation():Location {
        let location = new Location(this.coords!, this.new_location.trim())
        this.locations.push(location)
        this.storage.updateLocations(this.locations)
        this.new_location=""
        return location
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

    

    // Custom validators
    notBlank(control:FormControl){
        if(control.value.trim().length === 0) {
            return { name_error: "Invalid name. Make sure it isn't empty or blank."}// invalid
        }
        return null // pass
    }
    possiblePhoneNumber(control:FormControl) {
        if(/^[0-9]+$/.test(control.value) && control.value.length === 10) {
            return null // pass
        }
        return { phone_error: "Invalid phone number. Make sure it consists of only numbers with no spaces."}
    }
    positiveInteger(control:FormControl) {
        if(/^[0-9]+$/.test(control.value) && Number.isInteger(control.value) && control.value > 0) {
            return null // pass
        }
        return { pid_error: "Invalid PID. Make sure it is a positive integer"}
    }

    // validates if a location on the map is selected appropriately
    checkPin():Boolean {
        var pinValid = true
        if(this.coords === null) {
            alert("Please click on the map to select a location.")
            pinValid = false
        }else if(this.locations.find(el => (el.coords === this.coords))) {
            alert("Latitude: " + this.coords.lat + ', Longitude: ' + this.coords.lng + " already exists. Please select another location on the map.")
            pinValid = false
        }
        return pinValid
    }
}
