import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoginComponent } from './components/login/login.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { ProgRectoComponent } from './components/prog-recto/prog-recto.component';
import { ProgVersoComponent } from './components/prog-verso/prog-verso.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProgramsComponent,
    ProgRectoComponent,
    ProgVersoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
