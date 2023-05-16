import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    listView:Boolean = true
    
    constructor(private router: Router) {}

    ngOnInit(): void {
        if(this.router.url === '/map') {
            this.listView = false
        }
    }

    navCreate() {
        this.router.navigate(["/create"])
    }

    toggleView() {
        this.listView = !this.listView
        if(this.listView) {
            this.router.navigate(["./list"])
        }else {
            this.router.navigate(["./map"])
        }
    }
}
