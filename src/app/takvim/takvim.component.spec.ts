import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TakvimComponent } from './takvim.component';
import { GorevService } from '../services/gorev.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { Gorev } from '../models/gorev.model';
import { CommonModule } from '@angular/common';

describe('TakvimComponent', () => {
  let component: TakvimComponent;
  let fixture: ComponentFixture<TakvimComponent>;
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
    const gorevSpy = jasmine.createSpyObj('GorevService', ['getGorevler']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    gorevSpy.getGorevler.and.returnValue(of(mockGorevler));
    authSpy.getCurrentUser.and.returnValue({
      id: 'test-user',
      ad: 'Test User',
      email: 'test@test.com',
    });

    await TestBed.configureTestingModule({
      imports: [TakvimComponent, CommonModule],
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
    fixture = TestBed.createComponent(TakvimComponent);
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

  it('should change view correctly', () => {
    component.gorunumDegistir('hafta');
    expect(component.seciliGorunum).toBe('hafta');
    expect(component.gunler.length).toBe(7);

    component.gorunumDegistir('gun');
    expect(component.seciliGorunum).toBe('gun');
    expect(component.gunler.length).toBe(1);
  });

  it('should get correct day name', () => {
    const testDate = new Date(2024, 2, 18); // Pazartesi
    expect(component.getGunIsmi(testDate)).toBe('Pazartesi');
  });

  it('should filter gorevler for specific day', () => {
    const testDate = new Date();
    const testGorev = { ...mockGorevler[0], olusturmaTarihi: testDate };
    component.gorevler = [testGorev];

    const gununGorevleri = component.gununGorevleri(testDate);
    expect(gununGorevleri.length).toBe(1);
    expect(gununGorevleri[0]).toEqual(testGorev);
  });
});
