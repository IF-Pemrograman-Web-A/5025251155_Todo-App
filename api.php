<?php
define("API_MODE", true);
include "config.php";

ini_set("display_errors", "0");
header("Content-Type: application/json; charset=utf-8");

function balas($kode, $isi = null){
  http_response_code($kode);
  if ($isi !== null){
    echo json_encode($isi, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  }
  exit;
}

function sukses($kode, $pesan, $data = null){
  balas($kode, ["status" => "success", "message" => $pesan, "data" => $data]);
}

function gagal($kode, $pesan, $errors = null){
  $isi = ["status" => "error", "message" => $pesan];
  if ($errors !== null){
    $isi["errors"] = $errors;
  }
  balas($kode, $isi);
}

function teks($body, $kunci){
  return isset($body[$kunci]) && is_string($body[$kunci]) ? trim($body[$kunci]) : "";
}

function boolValid($nilai){
  return is_bool($nilai) || $nilai === 0 || $nilai === 1;
}

function bacaBool($nilai){
  return ($nilai === true || $nilai === 1) ? 1 : 0;
}

function tanggalValid($teks){
  $d = DateTime::createFromFormat("Y-m-d", $teks);
  return $d && $d->format("Y-m-d") === $teks;
}

function waktuValid($teks){
  foreach (["Y-m-d\TH:i", "Y-m-d\TH:i:s"] as $format){
    $d = DateTime::createFromFormat($format, $teks);
    if ($d && $d->format($format) === $teks) return true;
  }
  return false;
}

function ubahNotifikasi($teks){
  if ($teks === "") return null;
  return str_replace("T", " ", $teks);
}

function kosongJadiNull($teks){
  return $teks === "" ? null : $teks;
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

function formatTodo($t){
  return [
    "id" => (int)$t["id"],
    "jenis" => $t["jenis"],
    "judul" => $t["judul"],
    "deskripsi" => $t["deskripsi"],
    "deadline" => $t["deadline"],
    "selesai" => (bool)$t["selesai"],
    "gambar" => $t["gambar"],
    "notifikasi" => $t["notifikasi"] ? date("Y-m-d\TH:i:s", strtotime($t["notifikasi"])) : null,
    "sudah_notif" => (bool)$t["sudah_notif"],
    "dibuat_oleh" => $t["dibuat_oleh"]
  ];
}

function ambilTodo($conn, $id){
  $stmt = $conn->prepare("SELECT * FROM todos WHERE id = :id");
  $stmt->execute(["id" => $id]);
  return $stmt->fetch();
}

function cekData($body, $jenis){
  $errors = [];
  $judul = teks($body, "judul");
  $dibuatOleh = teks($body, "dibuat_oleh");
  $deadline = teks($body, "deadline");
  $notifikasi = teks($body, "notifikasi");

  if ($judul === ""){
    $errors["judul"] = "Judul tidak boleh kosong.";
  } elseif (mb_strlen($judul) > 100){
    $errors["judul"] = "Judul maksimal 100 karakter.";
  }

  if ($jenis === "shared" && $dibuatOleh === ""){
    $errors["dibuat_oleh"] = "Nama pembuat tidak boleh kosong untuk todo Shared.";
  } elseif (mb_strlen($dibuatOleh) > 50){
    $errors["dibuat_oleh"] = "Nama pembuat maksimal 50 karakter.";
  }

  if ($deadline !== "" && !tanggalValid($deadline)){
    $errors["deadline"] = "Format deadline harus YYYY-MM-DD.";
  }

  if ($notifikasi !== "" && !waktuValid($notifikasi)){
    $errors["notifikasi"] = "Format notifikasi harus YYYY-MM-DDTHH:MM.";
  }

  if (isset($body["selesai"]) && !boolValid($body["selesai"])){
    $errors["selesai"] = "Selesai harus true atau false.";
  }

  return $errors;
}

// --- autentikasi API Key ---
$kunci = $_SERVER["HTTP_X_API_KEY"] ?? "";
if ($kunci === ""){
  gagal(401, "API key tidak ditemukan. Kirim lewat header X-API-Key.");
}
if (!hash_equals($apiKey, $kunci)){
  gagal(403, "API key tidak valid.");
}

// --- routing: api.php/todos dan api.php/todos/{id} ---
$method = $_SERVER["REQUEST_METHOD"];
$path = (string)parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$posisi = strpos($path, "api.php");
$path = $posisi === false ? "" : substr($path, $posisi + strlen("api.php"));
$bagian = array_values(array_filter(explode("/", $path), "strlen"));

if (count($bagian) < 1 || count($bagian) > 2 || $bagian[0] !== "todos"){
  gagal(404, "Endpoint tidak ditemukan. Gunakan api.php/todos atau api.php/todos/{id}.");
}

$id = null;
if (count($bagian) === 2){
  if (!ctype_digit($bagian[1])){
    gagal(400, "ID harus berupa angka.");
  }
  $id = (int)$bagian[1];
}

$izin = $id === null ? ["GET", "POST"] : ["GET", "PUT", "PATCH", "DELETE"];
if (!in_array($method, $izin)){
  header("Allow: " . implode(", ", $izin));
  gagal(405, "Method " . $method . " tidak didukung untuk endpoint ini.");
}

$body = [];
if (in_array($method, ["POST", "PUT", "PATCH"])){
  $body = json_decode(file_get_contents("php://input"), true);
  if (!is_array($body)){
    gagal(400, "Body request harus berupa JSON yang valid.");
  }
}

$gambar = "";

try {
  // GET /todos
  if ($id === null && $method === "GET"){
    $where = [];
    $param = [];

    if (isset($_GET["jenis"])){
      if (!in_array($_GET["jenis"], ["personal", "shared"], true)){
        gagal(422, "Parameter tidak valid.", ["jenis" => "Jenis harus personal atau shared."]);
      }
      $where[] = "jenis = :jenis";
      $param["jenis"] = $_GET["jenis"];
    }

    if (isset($_GET["notifikasi"])){
      if ($_GET["notifikasi"] !== "belum"){
        gagal(422, "Parameter tidak valid.", ["notifikasi" => "Nilai yang didukung hanya: belum."]);
      }
      $where[] = "notifikasi IS NOT NULL AND sudah_notif = 0 AND selesai = 0";
    }

    $sql = "SELECT * FROM todos";
    if ($where){
      $sql .= " WHERE " . implode(" AND ", $where);
    }
    $sql .= " ORDER BY id";

    $stmt = $conn->prepare($sql);
    $stmt->execute($param);

    $hasil = [];
    foreach ($stmt->fetchAll() as $t){
      $hasil[] = formatTodo($t);
    }
    sukses(200, "Daftar todo berhasil diambil.", $hasil);
  }

  // POST /todos
  if ($id === null && $method === "POST"){
    $jenis = $body["jenis"] ?? "";
    if (!is_string($jenis) || !in_array($jenis, ["personal", "shared"], true)){
      gagal(422, "Data tidak valid.", ["jenis" => "Jenis harus personal atau shared."]);
    }

    $errors = cekData($body, $jenis);
    if ($errors){
      gagal(422, "Data tidak valid.", $errors);
    }

    $dataGambar = teks($body, "gambar_data");
    if ($dataGambar !== ""){
      $gambar = simpanGambar($dataGambar);
      if ($gambar === ""){
        gagal(422, "Data tidak valid.", ["gambar_data" => "Foto harus JPEG base64 (data:image/jpeg;base64,...) maksimal 3 MB."]);
      }
    }

    $stmt = $conn->prepare("INSERT INTO todos (jenis, judul, deskripsi, deadline, gambar, notifikasi, dibuat_oleh) VALUES (:jenis, :judul, :deskripsi, :deadline, :gambar, :notifikasi, :dibuat_oleh)");
    $stmt->execute([
      "jenis" => $jenis,
      "judul" => teks($body, "judul"),
      "deskripsi" => teks($body, "deskripsi"),
      "deadline" => kosongJadiNull(teks($body, "deadline")),
      "gambar" => $gambar,
      "notifikasi" => ubahNotifikasi(teks($body, "notifikasi")),
      "dibuat_oleh" => teks($body, "dibuat_oleh")
    ]);

    $idBaru = (int)$conn->lastInsertId();
    header("Location: " . $_SERVER["SCRIPT_NAME"] . "/todos/" . $idBaru);
    sukses(201, "Todo berhasil ditambahkan.", formatTodo(ambilTodo($conn, $idBaru)));
  }

  // endpoint /todos/{id}: cek dulu todo-nya ada
  $todo = ambilTodo($conn, $id);
  if (!$todo){
    gagal(404, "Todo dengan id " . $id . " tidak ditemukan.");
  }

  // GET /todos/{id}
  if ($method === "GET"){
    sukses(200, "Detail todo berhasil diambil.", formatTodo($todo));
  }

  // DELETE /todos/{id}
  if ($method === "DELETE"){
    $stmt = $conn->prepare("DELETE FROM todos WHERE id = :id");
    $stmt->execute(["id" => $id]);
    hapusGambar($todo["gambar"]);
    balas(204);
  }

  // PUT /todos/{id}
  if ($method === "PUT"){
    $errors = cekData($body, $todo["jenis"]);
    if ($errors){
      gagal(422, "Data tidak valid.", $errors);
    }

    $notifikasi = ubahNotifikasi(teks($body, "notifikasi"));
    $waktuLama = $todo["notifikasi"] ? strtotime($todo["notifikasi"]) : null;
    $waktuBaru = $notifikasi ? strtotime($notifikasi) : null;
    $sudahNotif = ($waktuLama !== $waktuBaru) ? 0 : (int)$todo["sudah_notif"];

    $stmt = $conn->prepare("UPDATE todos SET judul = :judul, deskripsi = :deskripsi, deadline = :deadline, notifikasi = :notifikasi, sudah_notif = :sudah_notif, selesai = :selesai, dibuat_oleh = :dibuat_oleh WHERE id = :id");
    $stmt->execute([
      "judul" => teks($body, "judul"),
      "deskripsi" => teks($body, "deskripsi"),
      "deadline" => kosongJadiNull(teks($body, "deadline")),
      "notifikasi" => $notifikasi,
      "sudah_notif" => $sudahNotif,
      "selesai" => bacaBool($body["selesai"] ?? false),
      "dibuat_oleh" => teks($body, "dibuat_oleh"),
      "id" => $id
    ]);

    sukses(200, "Todo berhasil diperbarui.", formatTodo(ambilTodo($conn, $id)));
  }

  // PATCH /todos/{id}: hanya selesai dan/atau sudah_notif
  if ($method === "PATCH"){
    $set = [];
    $param = ["id" => $id];
    $errors = [];

    foreach (["selesai", "sudah_notif"] as $kolom){
      if (!array_key_exists($kolom, $body)) continue;

      if (!boolValid($body[$kolom])){
        $errors[$kolom] = ucfirst($kolom) . " harus true atau false.";
      } else {
        $set[] = $kolom . " = :" . $kolom;
        $param[$kolom] = bacaBool($body[$kolom]);
      }
    }

    if ($errors){
      gagal(422, "Data tidak valid.", $errors);
    }
    if (!$set){
      gagal(422, "Data tidak valid.", ["body" => "Kirim selesai dan/atau sudah_notif."]);
    }

    $stmt = $conn->prepare("UPDATE todos SET " . implode(", ", $set) . " WHERE id = :id");
    $stmt->execute($param);

    sukses(200, "Todo berhasil diperbarui.", formatTodo(ambilTodo($conn, $id)));
  }
} catch (PDOException $e) {
  error_log("Operasi database gagal: " . $e->getMessage());
  hapusGambar($gambar);
  gagal(500, "Terjadi kesalahan pada server.");
}