import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddInternComponent } from './components/add-intern/add-intern.component';
import { DocInternComponent } from './components/doc-intern/doc-intern.component';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ProgPDFComponent } from './components/prog-pdf/prog-pdf.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { AuthGuard } from './guards/auth.guard';
// import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'programme_pdf', component: ProgPDFComponent, canActivate: [AuthGuard] },
  { path: 'home', component: OverviewComponent, canActivate: [AuthGuard],
    children:
      [{ path: 'programmes', component: ProgramsComponent, canActivate: [AuthGuard] },
      { path: 'ajouter_stagiaire', component: AddInternComponent, canActivate: [AuthGuard] },
      { path: 'documents_stagiaire', component: DocInternComponent, canActivate: [AuthGuard] }]
  },
];

// canActivate: [AuthGuard]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
