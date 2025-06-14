import { RenderMode, ServerRoute } from '@angular/ssr';
import { GirisComponent } from './giris/giris.component';
import { GorevlerComponent } from './gorevler/gorevler.component';
import { ProfilComponent } from './profil/profil.component';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
