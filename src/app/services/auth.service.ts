import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';

interface User {
  uid: string;
  email: string;
  isim: string;
  soyisim: string;
}

interface StoredUser {
  uid: string;
  email: string;
  isim: string;
  soyisim: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();
  private currentUser: User | null = null;

  constructor() {
    this.checkStoredLogin();
  }

  private checkStoredLogin(): void {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.loggedIn.next(true);
        console.log('AuthService: Stored user found:', this.currentUser?.email);
      }
    } catch (error) {
      console.error('AuthService: Stored login kontrol hatası:', error);
      this.logout();
    }
  }

  async getCurrentUserId(): Promise<string> {
    try {
      console.log('AuthService: getCurrentUserId çağrıldı');
      console.log(
        'AuthService: Current user:',
        this.currentUser?.uid || 'null'
      );
      return this.currentUser ? this.currentUser.uid : '';
    } catch (error) {
      console.error('AuthService: getCurrentUserId hatası:', error);
      return '';
    }
  }

  login(email: string, password: string): Observable<User | null> {
    console.log('AuthService: Login attempt for:', email);

    try {
      const usersData = localStorage.getItem('users');
      const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        this.currentUser = {
          uid: user.uid,
          email: user.email,
          isim: user.isim,
          soyisim: user.soyisim,
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.loggedIn.next(true);
        console.log('AuthService: Login successful for:', email);
        return of(this.currentUser);
      } else {
        console.log('AuthService: Login failed - invalid credentials');
        return throwError(() => ({
          code: 'auth/wrong-password',
          message: 'E-posta veya şifre hatalı!',
        }));
      }
    } catch (error) {
      console.error('AuthService: Login error:', error);
      return throwError(() => ({
        code: 'auth/unknown-error',
        message: 'Giriş yapılırken hata oluştu!',
      }));
    }
  }

  register(
    email: string,
    password: string,
    isim: string,
    soyisim: string
  ): Observable<User | null> {
    console.log('AuthService: Register attempt for:', email);

    try {
      const usersData = localStorage.getItem('users');
      const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];

      if (users.some((u) => u.email === email)) {
        console.log('AuthService: Register failed - email already exists');
        return throwError(() => ({
          code: 'auth/email-already-in-use',
          message: 'Bu e-posta adresi zaten kayıtlı!',
        }));
      }

      const newUser: StoredUser = {
        uid:
          'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        email: email,
        isim: isim,
        soyisim: soyisim,
        password: password,
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      console.log('AuthService: Register successful for:', email);
      return of({
        uid: newUser.uid,
        email: newUser.email,
        isim: newUser.isim,
        soyisim: newUser.soyisim,
      });
    } catch (error) {
      console.error('AuthService: Register error:', error);
      return throwError(() => ({
        code: 'auth/unknown-error',
        message: 'Kayıt olurken hata oluştu!',
      }));
    }
  }

  logout(): Promise<void> {
    console.log('AuthService: Logout');
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false);
    return Promise.resolve();
  }
}
