# Todo App
    Nama    : Wanhardo Jawak
    NRP     : 5025251155
    Prodi   : Teknik Informatika
    Kelas   : Pemrograman Web (A)

## Deskripsi Singkat
### E01
- Header terdiri judul My Todo List dan deskripsi singkat. 
- Panel kiri terdiri dari daftar todo, status todo, dan form add new todo. 
- Panel kanan berisi detail todo yang dipilih, terdiri dari judul, deskripsi, status, serta tombol simpan, edit dan hapus. 
- Footer berisi tahun dan nama pembuat. 
- Terdapat daftar todo dengan status pending atau completed.
- Terdapat form untuk menambahkan todo baru yang berisi judul, deskripsi dan deadline todo.
- Terdapat bagian detail untuk melihat detail, mengedit atau menghapus todo yang dipilih.
  
### E02
- Todo baru bisa ditambahkan langsung ke daftar setelah mengisi judul, deskripsi, dan deadline, tanpa perlu refresh halaman. Proses ini menggunakan manipulasi DOM.
- Setiap Todo memiliki tombol **edit**, **hapus**, dan checkbox. Tombol edit digunakan untuk mengubah isi Todo, sedangkan tombol hapus untuk menghapusnya. Jika checkbox dicentang, judul Todo akan dicoret sebagai tanda bahwa Todo sudah selesai.
- Data Todo disimpan dalam bentuk array yang berisi object. Setiap object memiliki id, judul, deskripsi, deadline, dan status selesai. Data tidak disimpan di localStorage, jadi ketika halaman di-refresh, data akan kembali seperti kondisi awal.
- Tersedia juga tombol untuk mengganti light mode dan dark mode. Perubahan tema dilakukan dengan mengganti class pada body, dan warna tombol juga ikut menyesuaikan dengan tema yang sedang digunakan.

## Dokumentasi dan Preview
### Desktop

Pada tampilan desktop, daftar todo dan detail todo berada dalam dua panel yang berdampingan.
![Tampilan Desktop](assets/default-dekstop.png)

Default desktop dalam dark mode
![Desktop dark](assets/desktop-dark.png)

### Mobile
Pada tampilan mobile, kedua panel tidak lagi berdampingan. Panel My Tasks berada di atas, kemudian panel Todo Detail berada di bawahnya.
![Tampilan Mobile](assets/mobile-default.png)

Default mobile dalam dark mode
![Mobile dark](assets/mobile-dark.png)

## Dokumentasi fitur
### 1. Tambah todo
Menambahkan todo baru tanpa harus melakukan refresh
![Add todo](assets/add/addtodo.png)

Muncul peringatan saat ingin menambahkan todo namun tidak mengisi judul
![Warning add](assets/add/warning-add.png)

### 2. Edit todo
Melakukan editing pada todo yang dipilih
![Edit todo](assets/edit/edit-todo.png)

Berhasil mengedit todo, sehingga tampilan list pada panel kiri juga berubah
![Edit secceded](assets/edit/berhasil-edit.png)

Melakukan check pada checkbox todo list yang juga mengubah status todo dari pending ke completed
![Checkbox todo](assets/edit/checkboxselesai.png)

### 3. Hapus todo
Muncul warning pada saat ingin menghapus todo yang dipilih
![Warning remove](assets/hapus/warning.png)

Todo berhasil di hapus dan tidak ada di dalam list todo
![Remove succede](assets/hapus/berhasil-hapus.png)

## 4. After Refresh
Saat melakukan refresh, tampilan kembali ke tampilan default tanpa perubahan
![Default](assets/after-refresh.png)
