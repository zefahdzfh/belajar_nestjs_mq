import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum KategoriProduk {
  Handphone = 'handphone',
  Laptop = 'laptop',
  Mobil = 'mobil',
  Motor = 'motor',
}

@Entity()
export class Produk extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama_produk: string;

  @Column({ type: 'varchar' })
  kategori_produk: KategoriProduk;

  @Column()
  harga_produk: number;

  @Column()
  jumlah_produk: number;

  @Column()
  deskripsi_produk: string;

  @Column()
  tahun_pembuatan: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
