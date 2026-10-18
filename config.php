<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "todo_app";

try {
  $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
  error_log("Koneksi database gagal: " . $e->getMessage());
  http_response_code(500);
  die("Koneksi ke database gagal, pastikan Msql sudah berjalan dan config.php sudah benar.");
}

function e($teks){
  return htmlspecialchars((string)$teks, ENT_QUOTES, "UTF-8");
}

function formatTanggal($tanggal){
  return date("d/m/Y", strtotime($tanggal));
}