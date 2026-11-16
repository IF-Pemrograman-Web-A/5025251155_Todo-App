# Todo App
    Nama    : Wanhardo Jawak
    NRP     : 5025251155
    Prodi   : Teknik Informatika
    Kelas   : Pemrograman Web (A)


## Dokumentasi dan Preview E06

### Ringkasan Implementasi
Pada E06, Todo App dari E05 dikembangkan agar komunikasi antara frontend dan backend memakai RESTful API. Proses tambah, tampil, ubah, centang, dan hapus todo yang sebelumnya dijalankan lewat form PHP sekarang dijalankan lewat endpoint api.php dengan http method yang sesuai.



## Daftar Endpoint
Semua endpoint berada di api.php dan menggunakan format URL api.php/todos atau api.php/todos/{id}.

### Endpoint API

| Method | URL | Fungsi | Response sukses |
|---|---|---|---|
| GET | api.php/todos?jenis=personal atau shared | mengambil daftar todo berdasarkan menu | 200 OK |
| GET | api.php/todos?notifikasi=belum | mengambil todo yang notifikasinya belum terkirim | 200 OK |
| GET | api.php/todos/{id} | mengambil detail satu todo | 200 OK |
| POST | api.php/todos | menambah todo baru | 201 Created |
| PUT | api.php/todos/{id} | mengubah seluruh data todo yang dapat diedit | 200 OK |
| PATCH | api.php/todos/{id} | mengubah sebagian data | 200 OK |
| DELETE | api.php/todos/{id} | menghapus todo beserta fotonya | 204 No Content |

### Response Code

| Kode | Kondisi | Contoh |
|---|---|---|
| 200 OK | data berhasil diambil atau diperbarui | GET, PUT, PATCH |
| 201 Created | todo berhasil dibuat, header location berisi alamat todo baru | POST |
| 204 No Content | todo berhasil dihapus, tanpa body | DELETE |
| 400 Bad Request | body bukan JSON yang valid, atau ID bukan angka | POST dengan body rusak, GET api.php/todos/abc |
| 401 Unauthorized | API Key tidak dikirim | request tanpa header X-API-Key |
| 403 Forbidden | API Key dikirim tetapi salah | X-API-Key salah |
| 404 Not Found | todo atau endpoint tidak ditemukan | GET api.php/todos/999, api.php/orang |
| 405 Method Not Allowed | method tidak didukung endpoint, header allow berisi method yang diizinkan | PUT api.php/todos, POST api.php/todos/1 |
| 422 Unprocessable Content | data tidak lolos validasi: judul kosong, nama pembuat kosong pada shared, jenis atau format tanggal salah, foto tidak valid | POST dengan judul kosong |
| 500 Internal Server Error | kesalahan database atau server | koneksi database gagal |


### 1. Pengujian endpoint
Pengujian dilakukan melalui Postman dengan header X-API-Key yang benar.
- GET daftar todo menghasilkan 200 OK
![get daftar](assetsE06/api/get_daftar.png)
- GET detail todo berdasarkan ID menghasilkan 200 OK
![get detail](assetsE06/api/get_detail.png)
- POST todo baru menghasilkan 201 Created
![post 201](assetsE06/api/post_201.png)
- PUT mengubah todo menghasilkan 200 OK
![put 200](assetsE06/api/put_200.png)
- PATCH mencentang todo menghasilkan 200 OK
![patch 200](assetsE06/api/patch_200.png)
- DELETE menghapus todo menghasilkan 204 No Content
![delete 204](assetsE06/api/delete_204.png)

### 2. Pengujian response code error
- ID tidak ditemukan menghasilkan 404
![get 404](assetsE06/api/get_404.png)
- Endpoint tidak dikenal menghasilkan 404
![endpoint 404](assetsE06/api/endpoint_404.png)
- POST dengan judul kosong menghasilkan 422 beserta detail errors
![post 422](assetsE06/api/post_422.png)
- PUT tanpa judul menghasilkan 422
![put 422](assetsE06/api/put_422.png)
- Method tidak didukung menghasilkan 405 beserta header Allow
![method 405](assetsE06/api/method_405.png)

### 3. Pengujian autentikasi
- Request tanpa API Key menghasilkan 401 Unauthorized
![tanpa key](assetsE06/auth/tanpa_key_401.png)
- Request dengan API Key yang salah menghasilkan 403 Forbidden
![key salah](assetsE06/auth/key_salah_403.png)
- Request dengan API Key yang benar menghasilkan 200 OK
![key benar](assetsE06/auth/key_benar_200.png)

### 4. Pengujian frontend
- Menu Personal dan Shared tetap tampil dengan data dari API
![personal](assetsE06/frontend/personal.png)
![shared](assetsE06/frontend/shared.png)
- Pada tab Network terlihat frontend memanggil api.php/todos dengan header X-API-Key
![network get](assetsE06/frontend/network_get.png)
- Menambah todo (POST 201), lalu todo baru muncul dan terpilih
![tambah](assetsE06/frontend/tambah.png)
- Mengubah todo melalui tombol Edit dan Simpan (PUT 200)
![edit](assetsE06/frontend/edit.png)
- Mencentang todo (PATCH 200) tanpa memuat ulang halaman
![centang](assetsE06/frontend/centang.png)
- Menghapus todo (DELETE 204)
![hapus](assetsE06/frontend/hapus.png)
- Upload foto dari kamera tetap berfungsi dan foto tampil pada panel detail
![foto](assetsE06/frontend/foto.png)
- Notifikasi tetap muncul pada waktunya, dan penanda sudah_notif dikirim lewat PATCH
![notifikasi](assetsE06/frontend/notifikasi.png)
- Pesan error dari API ditampilkan pada aplikasi (contoh: API Key salah)
![error api](assetsE06/frontend/error_api.png)
