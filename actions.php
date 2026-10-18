<?php
include "config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST"){
  header("Location: index.php");
  exit;
}

$aksi = $_POST["aksi"] ?? "";
$menu = (($_POST["menu"] ?? "") === "shared") ? "shared" : "personal";
$id = (int)($_POST["id"] ?? 0);
$pilih = (int)($_POST["pilih"] ?? 0);

function kembali($menu, $id, $pesan = "", $anchor = ""){
  $url = "index.php?menu=" . $menu . "&id=" . $id;
  if ($pesan !== ""){
    $url .= "&pesan=" . $pesan;
  }
  header("Location: " . $url . $anchor);
  exit;
}

function simpanGambar($dataUrl){
  $awalan = "data:image/jpeg;base64,";
  if (strpos($dataUrl, $awalan) !== 0) return "";

  $isi = base64_decode(substr($dataUrl, strlen($awalan)), true);
  if ($isi === false || strlen($isi) > 3 * 1024 * 1024) return "";

  $folder = __DIR__ . "/uploads";
  if (!is_dir($folder)){
    mkdir($folder);
  }

  $nama = "foto_" . time() . "_" . bin2hex(random_bytes(4)) . ".jpg";
  file_put_contents($folder . "/" . $nama, $isi);
  return $nama;
}

function hapusGambar($nama){
  if ($nama === "") return;
  $path = __DIR__ . "/uploads/" . basename($nama);
  if (file_exists($path)){
    unlink($path);
  }
}

function ubahNotifikasi($teks){
  if ($teks === "") return null;
  return str_replace("T", " ", $teks);
}

function kosongJadiNull($teks){
  return $teks === "" ? null : $teks;
}

try {
  if ($aksi === "tambah"){
    $judul = trim($_POST["judul"] ?? "");
    $dibuatOleh = trim($_POST["dibuat_oleh"] ?? "");

    if ($judul === ""){
      kembali($menu, $pilih, "judul-kosong");
    }
    if ($menu === "shared" && $dibuatOleh === ""){
      kembali($menu, $pilih, "nama-kosong");
    }

    $gambar = simpanGambar($_POST["gambar_data"] ?? "");

    $stmt = $conn->prepare("INSERT INTO todos (jenis, judul, deskripsi, deadline, gambar, notifikasi, dibuat_oleh) VALUES (:jenis, :judul, :deskripsi, :deadline, :gambar, :notifikasi, :dibuat_oleh)");
    $stmt->execute([
      "jenis" => $menu,
      "judul" => $judul,
      "deskripsi" => trim($_POST["deskripsi"] ?? ""),
      "deadline" => kosongJadiNull($_POST["deadline"] ?? ""),
      "gambar" => $gambar,
      "notifikasi" => ubahNotifikasi($_POST["notifikasi"] ?? ""),
      "dibuat_oleh" => $dibuatOleh
    ]);

    kembali($menu, (int)$conn->lastInsertId(), "ditambah");
  }

  if ($aksi === "ubah"){
    $judul = trim($_POST["judul"] ?? "");
    $dibuatOleh = trim($_POST["dibuat_oleh"] ?? "");

    if ($judul === ""){
      kembali($menu, $id, "judul-kosong");
    }
    if ($menu === "shared" && $dibuatOleh === ""){
      kembali($menu, $id, "nama-kosong");
    }

    $stmt = $conn->prepare("SELECT notifikasi, sudah_notif FROM todos WHERE id = :id");
    $stmt->execute(["id" => $id]);
    $lama = $stmt->fetch();
    if (!$lama){
      kembali($menu, 0, "gagal");
    }

    $notifikasi = ubahNotifikasi($_POST["notifikasi"] ?? "");
    $waktuLama = $lama["notifikasi"] ? strtotime($lama["notifikasi"]) : null;
    $waktuBaru = $notifikasi ? strtotime($notifikasi) : null;
    $sudahNotif = ($waktuLama !== $waktuBaru) ? 0 : (int)$lama["sudah_notif"];

    $selesai = (($_POST["status"] ?? "pending") === "completed") ? 1 : 0;

    $stmt = $conn->prepare("UPDATE todos SET judul = :judul, deskripsi = :deskripsi, deadline = :deadline, notifikasi = :notifikasi, sudah_notif = :sudah_notif, selesai = :selesai, dibuat_oleh = :dibuat_oleh WHERE id = :id");
    $stmt->execute([
      "judul" => $judul,
      "deskripsi" => trim($_POST["deskripsi"] ?? ""),
      "deadline" => kosongJadiNull($_POST["deadline"] ?? ""),
      "notifikasi" => $notifikasi,
      "sudah_notif" => $sudahNotif,
      "selesai" => $selesai,
      "dibuat_oleh" => $dibuatOleh,
      "id" => $id
    ]);

    kembali($menu, $id, "disimpan");
  }

  if ($aksi === "hapus"){
    $stmt = $conn->prepare("SELECT gambar FROM todos WHERE id = :id");
    $stmt->execute(["id" => $id]);
    $lama = $stmt->fetch();

    $stmt = $conn->prepare("DELETE FROM todos WHERE id = :id");
    $stmt->execute(["id" => $id]);

    if ($lama){
      hapusGambar($lama["gambar"]);
    }

    kembali($menu, 0, "dihapus");
  }

  if ($aksi === "selesai"){
    $selesai = (($_POST["selesai"] ?? "0") === "1") ? 1 : 0;

    $stmt = $conn->prepare("UPDATE todos SET selesai = :selesai WHERE id = :id");
    $stmt->execute(["selesai" => $selesai, "id" => $id]);

    kembali($menu, $pilih, "", "#cb-" . $id);
  }

  if ($aksi === "notif"){
    $stmt = $conn->prepare("UPDATE todos SET sudah_notif = 1 WHERE id = :id");
    $stmt->execute(["id" => $id]);

    http_response_code(204);
    exit;
  }

  kembali($menu, $pilih);
} catch (PDOException $e) {
  error_log("Operasi database gagal: " . $e->getMessage());
  kembali($menu, $pilih, "gagal");
}