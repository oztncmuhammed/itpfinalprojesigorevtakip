import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-giris',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './giris.component.html',
  styleUrls: ['./giris.component.css'],
})
export class GirisComponent {
  email: string = '';
  password: string = '';
  isim: string = '';
  soyisim: string = '';
  isLogin: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.isLogin) {
      if (this.email && this.password) {
        this.authService
          .login(this.email, this.password)
          .pipe(
            catchError((err) => {
              this.errorMessage = this.getErrorMessage(err);
              return of(null);
            })
          )
          .subscribe((user) => {
            if (user) {
              this.router.navigate(['/']);
            }
          });
      } else {
        this.errorMessage = 'Lütfen tüm alanları doldurun!';
      }
    } else {
      if (this.email && this.password && this.isim && this.soyisim) {
        this.authService
          .register(this.email, this.password, this.isim, this.soyisim)
          .pipe(
            catchError((err) => {
              this.errorMessage = this.getErrorMessage(err);
              return of(null);
            })
          )
          .subscribe((user) => {
            if (user) {
              this.successMessage =
                'Kayıt başarılı! Şimdi giriş yapabilirsiniz.';
              this.isLogin = true;
              this.email = '';
              this.password = '';
              this.isim = '';
              this.soyisim = '';
            }
          });
      } else {
        this.errorMessage = 'Lütfen tüm alanları doldurun!';
      }
    }
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.successMessage = '';
    this.email = '';
    this.password = '';
    this.isim = '';
    this.soyisim = '';
  }

  getErrorMessage(error: any): string {
    if (!error || !error.code) return 'Bir hata oluştu!';
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'E-posta veya şifre hatalı!';
      case 'auth/email-already-in-use':
        return 'Bu e-posta adresi zaten kayıtlı!';
      case 'auth/invalid-email':
        return 'Geçersiz e-posta adresi!';
      case 'auth/weak-password':
        return 'Şifre en az 6 karakter olmalı!';
      default:
        return error.message || 'Bir hata oluştu!';
    }
  }
}
