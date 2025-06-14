import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnasayfaComponent } from './anasayfa.component';
import { GorevService } from '../services/gorev.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { Gorev } from '../models/gorev.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('AnasayfaComponent', () => {
  let component: AnasayfaComponent;
  let fixture: ComponentFixture<AnasayfaComponent>;
  let gorevServiceSpy: jasmine.SpyObj<GorevService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockGorevler: Gorev[] = [
    {
      id: '1',
      baslik: 'Test Görevi',
      aciklama: 'Test Açıklama',
      kategori: 'is',
      tamamlandi: false,
      olusturmaTarihi: new Date(),
      kullaniciId: 'test-user',
    },
  ];

  beforeEach(async () => {
    const gorevSpy = jasmine.createSpyObj('GorevService', [
      'getGorevler',
      'gorevEkle',
      'gorevSil',
      'gorevGuncelle',
    ]);
    const authSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'getCurrentUserId',
    ]);

    gorevSpy.getGorevler.and.returnValue(of(mockGorevler));
    gorevSpy.gorevEkle.and.returnValue(of({ ...mockGorevler[0], id: '2' }));
    gorevSpy.gorevSil.and.returnValue(of(void 0));
    gorevSpy.gorevGuncelle.and.returnValue(
      of({ ...mockGorevler[0], tamamlandi: true })
    );
    authSpy.getCurrentUser.and.returnValue({
      id: 'test-user',
      ad: 'Test User',
      email: 'test@test.com',
    });
    authSpy.getCurrentUserId.and.returnValue('test-user');

    await TestBed.configureTestingModule({
      imports: [AnasayfaComponent, FormsModule, CommonModule],
      providers: [
        { provide: GorevService, useValue: gorevSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    gorevServiceSpy = TestBed.inject(
      GorevService
    ) as jasmine.SpyObj<GorevService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnasayfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load gorevler on init', () => {
    expect(gorevServiceSpy.getGorevler).toHaveBeenCalled();
    expect(component.gorevler).toEqual(mockGorevler);
  });

  it('should add new gorev', () => {
    const yeniGorev = {
      baslik: 'Yeni Görev',
      aciklama: 'Yeni Açıklama',
      kategori: 'kisisel',
      tarihSaat: new Date().toISOString(),
      tamamlandi: false,
      kullaniciId: 'test-user',
      olusturmaTarihi: new Date(),
    };

    component.yeniGorev = {
      baslik: yeniGorev.baslik,
      aciklama: yeniGorev.aciklama,
      kategori: yeniGorev.kategori,
      tarihSaat: yeniGorev.tarihSaat,
    };

    component.gorevEkle();

    expect(gorevServiceSpy.gorevEkle).toHaveBeenCalledWith({
      baslik: yeniGorev.baslik,
      aciklama: yeniGorev.aciklama,
      kategori: yeniGorev.kategori,
      tamamlandi: false,
      kullaniciId: 'test-user',
      olusturmaTarihi: jasmine.any(Date),
    });

    expect(component.yeniGorev).toEqual({
      baslik: '',
      aciklama: '',
      kategori: 'diger',
      tarihSaat: '',
    });
  });

  it('should delete gorev', () => {
    component.gorevSil('1');
    expect(gorevServiceSpy.gorevSil).toHaveBeenCalledWith('1');
  });

  it('should toggle gorev completion', () => {
    const gorev = { ...mockGorevler[0] };
    if (gorev.id) {
      component.gorevTamamla(gorev);
      expect(gorevServiceSpy.gorevGuncelle).toHaveBeenCalledWith(gorev.id, {
        tamamlandi: true,
      });
    }
  });

  it('should filter gorevler by category', () => {
    component.kategoriFiltrele('is');
    expect(component.filtrelenmisGorevler.length).toBe(1);
    expect(component.filtrelenmisGorevler[0].kategori).toBe('is');
  });
});
