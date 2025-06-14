import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class ProfilComponent implements OnInit {
  user: any = null;

  modalType: 'edit' | null = null;

  public toplamGorev: number = 0;
  public tamamlananGorev: number = 0;
  public bekleyenGorev: number = 0;

  editForm = {
    isim: '',
    soyisim: '',
    email: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.editForm = {
        isim: this.user.isim,
        soyisim: this.user.soyisim,
        email: this.user.email,
      };
    }
    this.gorevIstatistikleriniGetir();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/giris']);
  }

  openModal(type: 'edit') {
    this.modalType = type;
  }

  closeModal() {
    this.modalType = null;
  }

  kaydetProfili() {
    this.user.isim = this.editForm.isim;
    this.user.soyisim = this.editForm.soyisim;
    this.user.email = this.editForm.email;
    localStorage.setItem('currentUser', JSON.stringify(this.user));
    this.closeModal();
  }

  gorevIstatistikleriniGetir() {
    const allGorevler = JSON.parse(localStorage.getItem('gorevler') || '[]');
    const kullaniciGorevler = allGorevler.filter(
      (g: any) => g.kullaniciId === this.user.uid
    );
    this.toplamGorev = kullaniciGorevler.length;
    this.tamamlananGorev = kullaniciGorevler.filter(
      (g: any) => g.tamamlandi
    ).length;
    this.bekleyenGorev = kullaniciGorevler.filter(
      (g: any) => !g.tamamlandi
    ).length;
  }
}
