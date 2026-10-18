CREATE DATABASE IF NOT EXISTS todo_app CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE todo_app;

DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jenis ENUM('personal', 'shared') NOT NULL DEFAULT 'personal',
  judul VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  deadline DATE NULL,
  selesai TINYINT(1) NOT NULL DEFAULT 0,
  gambar VARCHAR(255) NOT NULL DEFAULT '',
  notifikasi DATETIME NULL,
  sudah_notif TINYINT(1) NOT NULL DEFAULT 0,
  dibuat_oleh VARCHAR(50) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO todos (jenis, judul, deskripsi, deadline, selesai, dibuat_oleh) VALUES
('personal', 'Makan', 'Makan di tombo luwe', '2026-10-22', 0, ''),
('personal', 'Belajar buat praktikum Jarkom', 'Baca modul dan latihan soal sebelum praktikum.', '2026-10-24', 0, ''),
('personal', 'Beresin tugas PWEB', 'Detail ada di material 5', '2026-10-20', 1, ''),
('personal', 'Rapat', 'Rapat testing buat NLC 2026', '2026-10-26', 0, ''),
('shared', 'Persiapan presentasi KKA', 'Buat laporan dan mengumpulkan slide', '2026-10-25', 0, 'Evan'),
('shared', 'Review ets KPPL', 'Cek hasil observasi', '2026-10-23', 0, 'Rafi'),
('shared', 'Mengumpulkan dokumentasi praktikum', 'Screenshot hasil praktikum dari tiap anggota dikumpulkan di satu folder.', '2026-10-27', 1, 'Wanhardo');