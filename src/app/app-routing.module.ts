import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GirisComponent } from './giris/giris.component';
import { GorevlerComponent } from './gorevler/gorevler.component';
import { ProfilComponent } from './profil/profil.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/giris', pathMatch: 'full' },
  { path: 'giris', component: GirisComponent },
  {
    path: 'gorevler',
    component: GorevlerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profil',
    component: ProfilComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
