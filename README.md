# Todo App
    Nama    : Wanhardo Jawak
    NRP     : 5025251155
    Prodi   : Teknik Informatika
    Kelas   : Pemrograman Web (A)

## Deskripsi Singkat
- Header terdiri judul My Todo List dan deskripsi singkat. 
- Panel kiri terdiri dari daftar todo, status todo, dan form add new todo. 
- Panel kanan berisi detail todo yang dipilih, terdiri dari judul, deskripsi, status, serta tombol simpan, edit dan hapus. 
- Footer berisi tahun dan nama pembuat. 
- Terdapat daftar todo dengan status pending atau completed.
- Terdapat form untuk menambahkan todo baru yang berisi judul, deskripsi, deadline todo, dan waktu notifikasi.
- Terdapat bagian detail untuk melihat detail, mengedit atau menghapus todo yang dipilih.
- Terdapat tombol Mode Gelap/Terang untuk menyesuaikan tema.


## Dokumentasi dan Preview E03
### Tampilan Awal
- Halaman utama Mode Terang
![Tampilan Awal Mode Terang](assetsE03/tampilan_awal_terang.png)
- Halaman utama Mode Gelap
![Tampilan Awal Mode Terang](assetsE03/tampilan_awal_gelap.png)


### Web Storage

- Key tema di localStorage
![localStorage](assetsE03/webstorage/localstorage.png)

- Mode gelap setelah refresh
![tema setelah refresh](assetsE03/webstorage/after_refresh.png)

- Data todo di IndexedDB
![indexeddb](assetsE03/webstorage/indexdb.png)

- Isi db saat ada todo yang di hapus
![indexdb setelah data di hapus](assetsE03/webstorage/hapus_todo_indb.png)

- Isi db setelah menambah todo abru
![new todo](assetsE03/webstorage/todo_baru.png)


### Media Capture API

- Perizinan Kamera
![izin kamera](assetsE03/mediacapture/izin.png)

- Kamera aktif
![kamera aktif](assetsE03/mediacapture/cam_aktif.png)

- Preview Foto
![preview](assetsE03/mediacapture/preview.png)

- Tampilan pada panel/detail todo
![detail](assetsE03/mediacapture/in_panel.png)




### Service Worker

- Service worker active
![sw active](assetsE03/serviceworkers/sw.png)

- Service worker sukses di console
![sw console](assetsE03/serviceworkers/sw_succede.png)

- Mengisi waktu notifikasi pada form
![isi waktu](assetsE03/serviceworkers/isi_waktu.png)

- Tampilan notifikasi Pengingat
![muncul notifikasi](assetsE03/serviceworkers/muncul_notif.png)


### Accessibility
- Skip Link pada pojok kiri atas 
![skip link](assetsE03/accessibility/skip_link.png)
  Setelah menekan enter, fokus pada konten utama
  ![main content](assetsE03/accessibility/fokus_konten_utama.png)

- Focus state pada item todo atau tombol saat navigasi keyboard, dimulai dari mode tampilan, kemudian ke form todo dan seterusnya.
![focus state1](assetsE03/accessibility/focus_state1.png)
![focus state2](assetsE03/accessibility/fokus_state2.png)

- Memilih todo dengan navogasi keyboard dan menekan enter
![todo melalui navigasi](assetsE03/accessibility/select_todo.png)

- Accessibility Tree

  Contoh pengecekan accessibility pada element checkbox
  ![checkbox accesibility](assetsE03/accessibility/accs_checkbox.png)

  Contoh pengecekan accessibility pada element input judul
  ![input judul](assetsE03/accessibility/accs_input_judul.png)



### 5. Accessibility Best Practices

#### Contrast
Beberapa contoh nya
- Teks utama mode terang
![teks utama light mode](assetsE03/best%20practice/c_text.png)

- Teks utama mode gelap
![teks utama dark mode](assetsE03/best%20practice/c_teksutama_dark.png)

- Tombol simpan
![simpan](assetsE03/best%20practice/c_simpan.png)

- Footer
![footer](assetsE03/best%20practice/c_footer.png)


### Lighthouse
- Skor saat pengecekan, nilainya cukup tinggi karena halaman ini kecil dan sederhana, sehingga semua audit otomatis Lighthouse seperti label, alt, kontras, lang lulus
![lighthouse](assetsE03/best%20practice/lighthouse.png)





