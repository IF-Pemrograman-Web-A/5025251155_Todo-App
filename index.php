<?php
include "config.php";

$menu = (isset($_GET["menu"]) && $_GET["menu"] === "shared") ? "shared" : "personal";

$stmt = $conn->prepare("SELECT * FROM todos WHERE jenis = :jenis ORDER BY id");
$stmt->execute(["jenis" => $menu]);
$todos = $stmt->fetchAll();

$idDipilih = (int)($_GET["id"] ?? 0);
$todo = $todos ? $todos[0] : null;
foreach ($todos as $t){
  if ((int)$t["id"] === $idDipilih){
    $todo = $t;
  }
}
$idTerpilih = $todo ? (int)$todo["id"] : 0;

$daftarPesan = [
  "ditambah" => "Todo berhasil ditambahkan.",
  "disimpan" => "Perubahan berhasil disimpan.",
  "dihapus" => "Todo berhasil dihapus.",
  "judul-kosong" => "Judul tidak boleh kosong!",
  "nama-kosong" => "Nama pembuat tidak boleh kosong untuk todo Shared!",
  "gagal" => "Terjadi kesalahan saat menyimpan data."
];
$kodePesan = $_GET["pesan"] ?? "";
$pesanServer = is_string($kodePesan) && isset($daftarPesan[$kodePesan]) ? $daftarPesan[$kodePesan] : "";

$stmt = $conn->query("SELECT id, judul, deadline, notifikasi FROM todos WHERE notifikasi IS NOT NULL AND sudah_notif = 0 AND selesai = 0");
$dataNotifikasi = [];
foreach ($stmt->fetchAll() as $r){
  $dataNotifikasi[] = [
    "id" => (int)$r["id"],
    "judul" => $r["judul"],
    "deadline" => $r["deadline"] ? formatTanggal($r["deadline"]) : "",
    "notifikasi" => date("Y-m-d\TH:i:s", strtotime($r["notifikasi"])),
    "sudahNotif" => false
  ];
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Todo List</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Lewati ke konten utama</a>

  <header class="site-header">
    <h1>My Todo List</h1>
    <p>Tidak perlu melihat seluruh anak tangga, cukup ambil langkah pertama saja.</p>
    <button type="button" class="btn btn-tema">Mode Gelap</button>
  </header>

  <?php include "menu-bar.php"; ?>

  <main class="main-content" id="main-content" tabindex="-1">
    <?php include "content.php"; ?>
  </main>

  <footer class="site-footer">
    <p>Todo App PWEB 2026</p>
    <p>Wanhardo Jawak</p>
  </footer>

  <script id="data-notifikasi" type="application/json"><?= json_encode($dataNotifikasi, JSON_HEX_TAG | JSON_HEX_AMP) ?></script>
  <script src="script.js"></script>
</body>
</html>