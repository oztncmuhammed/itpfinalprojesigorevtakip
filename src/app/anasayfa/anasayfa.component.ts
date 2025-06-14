import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GorevService } from '../services/gorev.service';
import { AuthService } from '../services/auth.service';
import { Gorev } from '../models/gorev.model';

@Component({
  selector: 'app-anasayfa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anasayfa.component.html',
  styleUrls: ['./anasayfa.component.css'],
})
export class AnasayfaComponent implements OnInit {
  gorevler: Gorev[] = [];
  yeniGorev = {
    baslik: '',
    aciklama: '',
    kategori: 'genel',
    tarihSaat: '',
  };
  seciliKategori = 'tumu';
  filtreMenuAcik = false;
  kategoriler = [
    { value: 'genel', label: 'Genel', icon: 'fas fa-list' },
    { value: 'is', label: 'İş', icon: 'fas fa-briefcase' },
    { value: 'kisisel', label: 'Kişisel', icon: 'fas fa-user' },
    { value: 'alisveris', label: 'Alışveriş', icon: 'fas fa-shopping-cart' },
    { value: 'diger', label: 'Diğer', icon: 'fas fa-ellipsis-h' },
  ];
  duzenlenenGorev: Gorev | null = null;

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
      console.log('Görevler yükleniyor, User ID:', currentUserId);

      if (!currentUserId) {
        console.log('Kullanıcı giriş yapmamış, görevler yüklenmiyor');
        this.gorevler = [];
        return;
      }

      this.gorevService.getGorevler(currentUserId).subscribe({
        next: (gorevler) => {
          console.log('Görevler yüklendi:', gorevler);
          this.gorevler = gorevler;
        },
        error: (error) => {
          console.error('Görevler yüklenirken hata:', error);
        },
      });
    } catch (error) {
      console.error('Görevler yüklenirken hata:', error);
    }
  }

  async gorevEkle() {
    if (!this.yeniGorev.baslik.trim() || !this.yeniGorev.tarihSaat) {
      alert('Lütfen görev başlığı ve tarih girin!');
      return;
    }

    console.log('Görev ekleme başlıyor...');

    try {
      const currentUserId = await this.authService.getCurrentUserId();
      console.log('Current User ID:', currentUserId);

      if (!currentUserId) {
        alert('Giriş yapmanız gerekiyor!');
        return;
      }

      const yeniGorev: Omit<Gorev, 'id'> = {
        baslik: this.yeniGorev.baslik.trim(),
        aciklama: this.yeniGorev.aciklama.trim(),
        kategori: this.yeniGorev.kategori,
        tamamlandi: false,
        olusturmaTarihi: new Date(this.yeniGorev.tarihSaat),
        kullaniciId: currentUserId,
      };

      console.log('Eklenecek görev:', yeniGorev);

      await this.gorevService.gorevEkle(yeniGorev);
      console.log('Görev başarıyla eklendi!');

      this.gorevleriYukle();
      this.formuTemizle();
      alert('Görev başarıyla eklendi!');
    } catch (error) {
      console.error('Görev eklenirken hata:', error);
      console.error('Hata detayı:', JSON.stringify(error, null, 2));
      alert(
        'Görev eklenirken bir hata oluştu: ' + (error as any)?.message ||
          'Bilinmeyen hata'
      );
    }
  }

  async gorevTamamla(gorev: Gorev) {
    if (!gorev.id) return;

    try {
      await this.gorevService.gorevGuncelle(gorev.id, {
        tamamlandi: !gorev.tamamlandi,
      });
      this.gorevleriYukle();
    } catch (error) {
      console.error('Görev güncellenirken hata:', error);
      alert('Görev güncellenirken bir hata oluştu!');
    }
  }

  async gorevSil(gorevId: string) {
    if (!confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await this.gorevService.gorevSil(gorevId);
      this.gorevler = this.gorevler.filter((g) => g.id !== gorevId);
    } catch (error) {
      console.error('Görev silinirken hata:', error);
      alert('Görev silinirken bir hata oluştu!');
    }
  }

  get filtrelenmisGorevler() {
    if (this.seciliKategori === 'tumu') {
      return this.gorevler;
    }
    return this.gorevler.filter(
      (gorev) => gorev.kategori === this.seciliKategori
    );
  }

  get tamamlananGorevSayisi() {
    return this.filtrelenmisGorevler.filter((g) => g.tamamlandi).length;
  }

  get toplamGorevSayisi() {
    return this.filtrelenmisGorevler.length;
  }

  formuTemizle() {
    this.yeniGorev = {
      baslik: '',
      aciklama: '',
      kategori: 'genel',
      tarihSaat: '',
    };
  }

  kategoriFiltrele(kategori: string) {
    this.seciliKategori = kategori;
  }

  getKategoriIcon(kategori: string): string {
    const kategoriObj = this.kategoriler.find((k) => k.value === kategori);
    return kategoriObj ? kategoriObj.icon : 'fas fa-list';
  }

  getKategoriLabel(kategori: string): string {
    const kategoriObj = this.kategoriler.find((k) => k.value === kategori);
    return kategoriObj ? kategoriObj.label : 'Genel';
  }

  gorevDuzenle(gorev: Gorev) {
    this.duzenlenenGorev = { ...gorev };
    this.yeniGorev = {
      baslik: gorev.baslik,
      aciklama: gorev.aciklama,
      kategori: gorev.kategori,
      tarihSaat: new Date(gorev.olusturmaTarihi).toISOString().slice(0, 16),
    };
  }

  async gorevGuncelle() {
    if (!this.duzenlenenGorev || !this.duzenlenenGorev.id) return;
    try {
      await this.gorevService.gorevGuncelle(this.duzenlenenGorev.id, {
        baslik: this.yeniGorev.baslik,
        aciklama: this.yeniGorev.aciklama,
        kategori: this.yeniGorev.kategori,
        olusturmaTarihi: new Date(this.yeniGorev.tarihSaat),
      });
      this.duzenlenenGorev = null;
      this.formuTemizle();
      this.gorevleriYukle();
    } catch (error) {
      alert('Görev güncellenirken hata oluştu!');
    }
  }
}
