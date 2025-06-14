import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Gorev, GorevKategori } from '../models/gorev.model';
import { GorevService } from '../services/gorev.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

interface YeniGorevTipi extends Partial<Gorev> {
  tarihSaat?: string;
}

@Component({
  selector: 'app-gorevler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gorevler.component.html',
  styleUrls: ['./gorevler.component.css'],
})
export class GorevlerComponent implements OnInit {
  gorevler$: Observable<Gorev[]> = new Observable();
  yeniGorev: YeniGorevTipi = {
    baslik: '',
    aciklama: '',
    kategori: 'diger',
    tamamlandi: false,
    tarihSaat: '',
  };
  seciliKategori: GorevKategori | 'tumu' = 'tumu';
  kategoriler: (GorevKategori | 'tumu')[] = [
    'tumu',
    'is',
    'kisisel',
    'alısveris',
    'diger',
  ];

  constructor(
    private gorevService: GorevService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.gorevleriYukle();
  }

  async gorevleriYukle() {
    try {
      const currentUserId = await this.authService.getCurrentUserId();
      if (currentUserId) {
        this.gorevler$ = this.gorevService.getGorevler(currentUserId);
      }
    } catch (error) {
      console.error('Görevler yüklenirken hata:', error);
    }
  }

  async gorevEkle() {
    if (
      this.yeniGorev.baslik &&
      this.yeniGorev.kategori &&
      this.yeniGorev.tarihSaat
    ) {
      try {
        const currentUserId = await this.authService.getCurrentUserId();
        if (!currentUserId) {
          alert('Giriş yapmanız gerekiyor!');
          return;
        }

        const gorev: Omit<Gorev, 'id'> = {
          baslik: this.yeniGorev.baslik,
          aciklama: this.yeniGorev.aciklama || '',
          kategori: this.yeniGorev.kategori,
          tamamlandi: false,
          kullaniciId: currentUserId,
          olusturmaTarihi: new Date(this.yeniGorev.tarihSaat!),
        };

        await this.gorevService.gorevEkle(gorev);
        this.formTemizle();
        this.gorevleriYukle();
      } catch (error) {
        console.error('Görev eklenirken hata:', error);
      }
    }
  }

  async gorevTamamla(gorev: Gorev) {
    if (!gorev.id) return;

    try {
      await this.gorevService.gorevGuncelle(gorev.id, {
        ...gorev,
        tamamlandi: !gorev.tamamlandi,
      });
      this.gorevleriYukle();
    } catch (error) {
      console.error('Görev güncellenirken hata:', error);
    }
  }

  async gorevSil(gorev: Gorev) {
    if (!gorev.id) return;

    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      try {
        await this.gorevService.gorevSil(gorev.id);
        this.gorevleriYukle();
      } catch (error) {
        console.error('Görev silinirken hata:', error);
      }
    }
  }

  async kategoriDegistir(kategori: GorevKategori | 'tumu') {
    this.seciliKategori = kategori;
    try {
      const currentUserId = await this.authService.getCurrentUserId();
      if (currentUserId) {
        if (kategori === 'tumu') {
          this.gorevler$ = this.gorevService.getGorevler(currentUserId);
        } else {
          this.gorevler$ = this.gorevService.getGorevlerByKategori(
            currentUserId,
            kategori
          );
        }
      }
    } catch (error) {
      console.error('Kategori değiştirirken hata:', error);
    }
  }

  formTemizle() {
    this.yeniGorev = {
      baslik: '',
      aciklama: '',
      kategori: 'diger',
      tamamlandi: false,
      tarihSaat: '',
    };
  }

  trackByGorev(index: number, gorev: Gorev): string {
    return gorev.id || index.toString();
  }

  getCompletedGorevler(gorevler: Gorev[]): Gorev[] {
    return gorevler.filter((gorev) => gorev.tamamlandi);
  }
}
