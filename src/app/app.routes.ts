import { Routes } from '@angular/router';
import { GirisComponent } from './giris/giris.component';
import { AnasayfaComponent } from './anasayfa/anasayfa.component';
import { ProfilComponent } from './profil/profil.component';
import { AuthGuard } from './guards/auth.guard';
import { TakvimComponent } from './takvim/takvim.component';

export const routes: Routes = [
  { path: 'giris', component: GirisComponent },
  { path: '', component: AnasayfaComponent, canActivate: [AuthGuard] },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  { path: 'takvim', component: TakvimComponent, canActivate: [AuthGuard] },
];
