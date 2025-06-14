import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Gorev, GorevKategori } from '../models/gorev.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GorevService {
  private gorevlerSubject = new BehaviorSubject<Gorev[]>([]);
  private gorevler: Gorev[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('gorevler');
      if (saved) {
        this.gorevler = JSON.parse(saved);

        this.gorevler.forEach((gorev) => {
          gorev.olusturmaTarihi = new Date(gorev.olusturmaTarihi);
        });
        this.gorevlerSubject.next(this.gorevler);
        console.log("LocalStorage'dan görevler yüklendi:", this.gorevler);
      }
    } catch (error) {
      console.error("LocalStorage'dan görevler yüklenirken hata:", error);
      this.gorevler = [];
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('gorevler', JSON.stringify(this.gorevler));
      console.log("Görevler LocalStorage'a kaydedildi");
    } catch (error) {
      console.error("LocalStorage'a kaydederken hata:", error);
    }
  }

  private generateId(): string {
    return (
      'gorev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  getGorevler(kullaniciId: string): Observable<Gorev[]> {
    console.log('Service: getGorevler çağrıldı, kullaniciId:', kullaniciId);

    return this.gorevlerSubject.pipe(
      map((gorevler) =>
        gorevler.filter((gorev) => gorev.kullaniciId === kullaniciId)
      )
    );
  }

  async gorevEkle(gorev: Omit<Gorev, 'id'>): Promise<void> {
    console.log('Service: gorevEkle çağrıldı', gorev);
    try {
      const yeniGorev: Gorev = {
        ...gorev,
        id: this.generateId(),
        olusturmaTarihi: new Date(),
      };

      this.gorevler.push(yeniGorev);
      this.saveToLocalStorage();
      this.gorevlerSubject.next(this.gorevler);

      console.log('Service: Görev eklendi, ID:', yeniGorev.id);
    } catch (error) {
      console.error('Service: Görev eklenemedi:', error);
      throw error;
    }
  }

  async gorevGuncelle(id: string, guncelGorev: Partial<Gorev>): Promise<void> {
    console.log('Service: gorevGuncelle çağrıldı, ID:', id, guncelGorev);
    try {
      const index = this.gorevler.findIndex((gorev) => gorev.id === id);
      if (index !== -1) {
        this.gorevler[index] = { ...this.gorevler[index], ...guncelGorev };
        this.saveToLocalStorage();
        this.gorevlerSubject.next(this.gorevler);
        console.log('Service: Görev güncellendi');
      } else {
        throw new Error('Görev bulunamadı');
      }
    } catch (error) {
      console.error('Service: Görev güncellenemedi:', error);
      throw error;
    }
  }

  async gorevSil(id: string): Promise<void> {
    console.log('Service: gorevSil çağrıldı, ID:', id);
    try {
      const index = this.gorevler.findIndex((gorev) => gorev.id === id);
      if (index !== -1) {
        this.gorevler.splice(index, 1);
        this.saveToLocalStorage();
        this.gorevlerSubject.next(this.gorevler);
        console.log('Service: Görev silindi');
      } else {
        throw new Error('Görev bulunamadı');
      }
    } catch (error) {
      console.error('Service: Görev silinemedi:', error);
      throw error;
    }
  }

  getGorevlerByKategori(
    kullaniciId: string,
    kategori: GorevKategori
  ): Observable<Gorev[]> {
    console.log(
      'Service: getGorevlerByKategori çağrıldı, kullaniciId:',
      kullaniciId,
      'kategori:',
      kategori
    );
    return this.gorevlerSubject.pipe(
      map((gorevler) =>
        gorevler.filter(
          (gorev) =>
            gorev.kullaniciId === kullaniciId && gorev.kategori === kategori
        )
      )
    );
  }
}
