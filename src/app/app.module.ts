import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailedReportComponent } from './detailed-report/detailed-report.component';
import { HomeComponent } from './home/home.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { MapComponent } from './map/map.component';
import { ListComponent } from './list/list.component';
import { LatlngPipe } from './latlng.pipe';
import { MapDirective } from './map.directive';

@NgModule({
  declarations: [
    AppComponent,
    DetailedReportComponent,
    HomeComponent,
    ReportFormComponent,
    MapComponent,
    ListComponent,
    LatlngPipe,
    MapDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
        {path: '', component: HomeComponent, children: [
            {path: '', redirectTo: 'list', pathMatch: 'full'},
            {path: 'list', component: ListComponent},
            {path: 'map', component: MapComponent}
        ]},
        {path: 'create', component: ReportFormComponent},
        {path: 'report/:rid', component: DetailedReportComponent},
        {path: '**', component: HomeComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
