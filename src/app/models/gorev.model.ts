export interface Gorev {
  id?: string;
  baslik: string;
  aciklama: string;
  tamamlandi: boolean;
  olusturmaTarihi: Date;
  kategori: string;
  kullaniciId: string;
}

export type GorevKategori = 'is' | 'kisisel' | 'alısveris' | 'diger';
