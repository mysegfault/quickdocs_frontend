import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ProgRectoComponent } from './components/prog-recto/prog-recto.component';
import { ProgVersoComponent } from './components/prog-verso/prog-verso.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: OverviewComponent, canActivate:[AuthGuard],
    children:
      [{ path: 'programmes', component: ProgramsComponent, canActivate:[AuthGuard]}]
  }
];

// ,
// children:
// [{ path: 'programme_recto', component: ProgRectoComponent, canActivate:[AuthGuard] },
// { path: 'programme_verso', component: ProgVersoComponent, canActivate:[AuthGuard] }]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
