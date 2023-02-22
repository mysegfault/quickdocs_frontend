import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ProgPDFComponent } from './components/prog-pdf/prog-pdf.component';
import { ProgramsComponent } from './components/programs/programs.component';
// import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: OverviewComponent },
  { path: 'programmes', component: ProgramsComponent,
    children: [
      { path: 'programme_pdf', component: ProgPDFComponent }
    ]
  }
];

// canActivate: [AuthGuard]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
