import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gorev } from '../models/gorev.model';
import { GorevService } from '../services/gorev.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-takvim',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './takvim.component.html',
  styleUrls: ['./takvim.component.css'],
})
export class TakvimComponent implements OnInit {
  gorevler: Gorev[] = [];
  seciliGorunum: 'gun' | 'hafta' = 'gun';
  gunler: Date[] = [];
  gunIsimleri: string[] = [
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi',
    'Pazar',
  ];

  constructor(
    private gorevServisi: GorevService,
    private kimlikServisi: AuthService
  ) {}

  async ngOnInit() {
    this.gunleriAyarla();
    const kullaniciId = await this.kimlikServisi.getCurrentUserId();
    if (kullaniciId) {
      this.gorevServisi.getGorevler(kullaniciId).subscribe((gorevler) => {
        this.gorevler = gorevler;
      });
    }
  }

  gorunumDegistir(yeniGorunum: 'gun' | 'hafta') {
    this.seciliGorunum = yeniGorunum;
    this.gunleriAyarla();
  }

  gunleriAyarla() {
    const bugun = new Date();
    const gunler: Date[] = [];
    let baslangicGunu: Date;

    if (this.seciliGorunum === 'gun') {
      gunler.push(new Date(bugun));
    } else {
      const pazartesi = new Date(bugun);
      const gunFarki = pazartesi.getDay() === 0 ? -6 : 1 - pazartesi.getDay();
      pazartesi.setDate(pazartesi.getDate() + gunFarki);
      baslangicGunu = pazartesi;

      for (let i = 0; i < 7; i++) {
        const yeniGun = new Date(baslangicGunu);
        yeniGun.setDate(baslangicGunu.getDate() + i);
        gunler.push(yeniGun);
      }
    }

    this.gunler = gunler;
  }

  gununGorevleri(gun: Date): Gorev[] {
    return this.gorevler.filter((gorev) => {
      const tarih = new Date(gorev.olusturmaTarihi);
      return (
        tarih.getFullYear() === gun.getFullYear() &&
        tarih.getMonth() === gun.getMonth() &&
        tarih.getDate() === gun.getDate()
      );
    });
  }

  getGunIsmi(gun: Date): string {
    const gunler = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    return gunler[gun.getDay()];
  }
}
