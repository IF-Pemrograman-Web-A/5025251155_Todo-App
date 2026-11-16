<?php
include "config.php";

$menu = (isset($_GET["menu"]) && $_GET["menu"] === "shared") ? "shared" : "personal";

$dataApp = [
  "menu" => $menu,
  "id" => (int)($_GET["id"] ?? 0),
  "apiKey" => $apiKey
];
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Todo List</title>
  <meta name="theme-color" content="#323265">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" href="icons/icon-uk-192.png" type="image/png">
  <link rel="apple-touch-icon" href="icons/icon-uk-192.png">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Lewati ke konten utama</a>

  <header class="site-header">
    <h1>My Todo List</h1>
    <p>Tidak perlu melihat seluruh anak tangga, cukup ambil langkah pertama saja.</p>
    <button type="button" class="btn btn-install" id="btn-install" hidden>Install Aplikasi</button>
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

  <script id="data-app" type="application/json"><?= json_encode($dataApp, JSON_HEX_TAG | JSON_HEX_AMP) ?></script>
  <script src="script.js"></script>
</body>
</html>