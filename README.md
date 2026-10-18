# Todo App
    Nama    : Wanhardo Jawak
    NRP     : 5025251155
    Prodi   : Teknik Informatika
    Kelas   : Pemrograman Web (A)

## Deskripsi Singkat
Todo App dikembangkan dan merupakan lanjutan dari E03 menjadi aplikasi PHP dengan database MySQL

- Header berisi judul My Todo List, deskripsi singkat, dan tombol Mode Gelap/Terang.
- Menu bar dengan dua menu yaitu  Personal dan Shared.
- Panel kiri berisi daftar todo, status todo, dan form Add New Todo seperti judul, deskripsi, deadline, waktu notifikasi dan foto kamera.
- Panel kanan berisi detail todo yang dipilih, dengan tombol Simpan, Edit, dan Hapus.
- Footer berisi tahun dan nama pembuat.
- Data todo disimpan di database MySQL dan dikelola dengan PHP (PDO).

## Struktur File
| File | Fungsi |
|---|---|
| index.php | Halaman utama, mengambil data todo dari database sesuai menu |
| config.php | Koneksi database (PDO) dan fungsi bantu |
| menu-bar.php | Menu Personal dan Shared |
| content.php | Daftar todo, form tambah, dan detail todo |
| actions.php | Proses Create, Update, Delete (prepared statement) dan penyimpanan foto |
| data.sql | Struktur tabel dan data dummy |
| script.js, style.css, sw.js | JavaScript, CSS, dan Service Worker dari E03 |
| uploads/ | Folder penyimpanan foto dari kamera |

## Aturan Personal dan Shared
- Tabel todos memiliki kolom jenis menu personal atau shared. Setiap menu hanya menampilkan todo sesuai jenisnya.
- Todo Shared memiliki kolom tambahan "Dibuat oleh" yang wajib diisi dan ditampilkan di daftar serta detail.
- Aplikasi tidak memakai login, jadi semua pengunjung melihat dan dapat mengubah data yang sama.


## Dokumentasi dan Preview E04

### Tampilan Awal
- Halaman Personal mode terang
![Personal terang](assetsE04/tampilan/personal_terang.png)
- Halaman Personal mode gelap
![Personal gelap](assetsE04/tampilan/personal_gelap.png)
- Halaman Shared
![Shared](assetsE04/tampilan/shared_terang.png)
- Tampilan pada mobile
![Mobile](assetsE04/tampilan/mobile.png)


### 1. Menu Personal dan Shared
- Menu Personal aktif, terlihat alamat ?menu=personal
![menu personal](assetsE04/menu/personal.png)
- Menu Shared aktif, terlihat alamat ?menu=shared dan field "Dibuat oleh"
![menu shared](assetsE04/menu/shared.png)
- Menu dapat dijangkau dengan keyboard dan menu aktif ditandai
![menu keyboard](assetsE04/menu/fokus_keyboard.png)


### 2. Migrasi ke PHP dan Modular
- Struktur folder proyek
![struktur folder](assetsE04/modular/struktur_folder.png)
- index.php memanggil menu-bar.php dan content.php dengan include
![include](assetsE04/modular/include_index.png)
![include](assetsE04/modular/include_index2.png)
- Isi config.php (koneksi PDO)
![config](assetsE04/modular/config.png)
- Aplikasi dibuka melalui localhost (.php) dan page source hanya berisi HTML hasil proses PHP
![page source](assetsE04/modular/page_source.png)
- XAMPP Control Panel dengan Apache dan MySQL berjalan
![xampp](assetsE04/modular/xampp.png)


### 3. Database dan data.sql
- Proses impor data.sql di phpMyAdmin
![import](assetsE04/database/import.png)
- Hasil impor berhasil
![import sukses](assetsE04/database/import_sukses.png)
- Struktur tabel todos
![struktur tabel](assetsE04/database/struktur_tabel.png)
- Data dummy di tabel todos (4 personal dan 3 shared)
![data dummy](assetsE04/database/data_dummy.png)
- Data dummy tampil di aplikasi (Personal dan Shared)
![dummy personal](assetsE04/database/dummy_personal.png)
![dummy shared](assetsE04/database/dummy_shared.png)


### 4. CRUD
#### Create
- Form tambah todo terisi
![form tambah](assetsE04/crud/create_form.png)
- Todo baru muncul di daftar
![create app](assetsE04/crud/create_app.png)
- Baris baru muncul di tabel phpMyAdmin
![create db](assetsE04/crud/create_db.png)
- Todo Shared baru dengan nama pembuat
![create shared](assetsE04/crud/create_shared.png)
- Validasi judul kosong
![validasi judul](assetsE04/crud/validasi_judul.png)
- Validasi nama pembuat kosong pada Shared
![validasi nama](assetsE04/crud/validasi_nama.png)

#### Read
- Data tetap tampil setelah halaman direfresh
![read refresh](assetsE04/crud/read_refresh.png)
- Detail todo muncul saat todo dipilih
![read detail](assetsE04/crud/read_detail.png)

#### Update
- Mode edit aktif (field detail dapat diubah)
![update edit](assetsE04/crud/update_edit.png)
- Hasil perubahan di aplikasi
![update app](assetsE04/crud/update_app.png)
- Hasil perubahan di phpMyAdmin
![update db](assetsE04/crud/update_db.png)
- Mengubah status lewat checkbox (Pending menjadi Completed)
![update checkbox](assetsE04/crud/update_checkbox.png)
- Kolom selesai berubah di phpMyAdmin
![update checkbox db](assetsE04/crud/update_checkbox_db.png)

#### Delete
- Konfirmasi hapus
![konfirmasi hapus](assetsE04/crud/delete_konfirmasi.png)
- Todo hilang dari daftar
![delete app](assetsE04/crud/delete_app.png)
- Baris hilang dari tabel phpMyAdmin
![delete db](assetsE04/crud/delete_db.png)

#### Keamanan Query
- Query memakai prepared statement (prepare dan execute) di actions.php
![prepared statement](assetsE04/crud/prepared_statement.png)


### 5. File Handling
- Perizinan dan kamera aktif
![kamera](assetsE04/filehandling/kamera.png)
- Preview foto pada form
![preview](assetsE04/filehandling/preview.png)
- Foto tampil pada detail todo
![detail foto](assetsE04/filehandling/detail_foto.png)
- File foto tersimpan di folder uploads/
![folder uploads](assetsE04/filehandling/folder_uploads.png)
- Nama file foto tersimpan di kolom gambar
![kolom gambar](assetsE04/filehandling/kolom_gambar.png)
- Setelah todo dihapus lewat aplikasi, file foto ikut terhapus dari uploads/
![hapus foto](assetsE04/filehandling/hapus_foto.png)
