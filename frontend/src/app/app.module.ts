import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


import { MAT_DATE_LOCALE } from '@angular/material/core';

import { MainComponent } from './main/main.component';
import { AboutComponent } from './about/about.component';
import { NavComponent } from './nav/nav.component';
import { TipComponent } from './tip/tip.component';



@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AboutComponent,
    NavComponent,
    TipComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDialogModule
  ],
  providers: [{
    // Ставлю локализацию для календаря
    provide: MAT_DATE_LOCALE, useValue: 'ru-RU'
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
