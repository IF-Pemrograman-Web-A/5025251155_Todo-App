<?php
$detail = $todo ?? [
  "judul" => "", "deskripsi" => "", "deadline" => "", "notifikasi" => "",
  "selesai" => 0, "gambar" => "", "dibuat_oleh" => ""
];
$nilaiNotif = $detail["notifikasi"] ? date("Y-m-d\TH:i", strtotime($detail["notifikasi"])) : "";
?>
<section class="panel panel-list" aria-labelledby="judul-list">
  <h2 id="judul-list"><?= $menu === "shared" ? "Shared Tasks" : "My Tasks" ?></h2>
  <p class="pesan" role="status"><?= e($pesanServer) ?></p>

  <ul class="todo-list">
    <?php if (!$todos): ?>
      <li class="teks-kecil">Belum ada todo.</li>
    <?php endif; ?>
    <?php foreach ($todos as $t): ?>
      <?php $aktif = (int)$t["id"] === $idTerpilih; ?>
      <li class="todo-item<?= $aktif ? " aktif" : "" ?>"<?= $aktif ? ' aria-current="true"' : "" ?>>
        <div class="todo-info">
          <form method="post" action="actions.php" class="form-selesai">
            <input type="hidden" name="aksi" value="selesai">
            <input type="hidden" name="id" value="<?= (int)$t["id"] ?>">
            <input type="hidden" name="pilih" value="<?= $idTerpilih ?>">
            <input type="hidden" name="menu" value="<?= e($menu) ?>">
            <input type="hidden" name="selesai" value="0">
            <input type="checkbox" id="cb-<?= (int)$t["id"] ?>" name="selesai" value="1" aria-label="Tandai selesai: <?= e($t["judul"]) ?>"<?= $t["selesai"] ? " checked" : "" ?>>
          </form>
          <span class="todo-judul<?= $t["selesai"] ? " selesai" : "" ?>"><a href="index.php?menu=<?= e($menu) ?>&amp;id=<?= (int)$t["id"] ?>"><?= e($t["judul"]) ?></a></span>
          <?php if ($t["selesai"]): ?>
            <span class="status status-completed">Completed</span>
          <?php else: ?>
            <span class="status status-pending">Pending</span>
          <?php endif; ?>
        </div>
        <?php if ($t["deadline"]): ?>
          <div class="todo-deadline">Deadline: <?= formatTanggal($t["deadline"]) ?></div>
        <?php endif; ?>
        <?php if ($menu === "shared" && $t["dibuat_oleh"] !== ""): ?>
          <div class="todo-deadline">Dibuat oleh: <?= e($t["dibuat_oleh"]) ?></div>
        <?php endif; ?>
      </li>
    <?php endforeach; ?>
  </ul>
  <hr>
  <div class="new-todo-form">
    <h3>Add New Todo</h3>
    <form action="actions.php" method="post">
      <input type="hidden" name="aksi" value="tambah">
      <input type="hidden" name="menu" value="<?= e($menu) ?>">
      <input type="hidden" name="pilih" value="<?= $idTerpilih ?>">
      <input type="hidden" name="gambar_data" id="gambar-data">

      <div class="form-group">
        <label for="new-judul">Judul</label>
        <input type="text" id="new-judul" name="judul" maxlength="100" placeholder="Masukkan judul todo" aria-required="true">
      </div>

      <div class="form-group">
        <label for="new-deskripsi">Deskripsi</label>
        <input type="text" id="new-deskripsi" name="deskripsi" placeholder="Deskripsi singkat">
      </div>

      <div class="form-group">
        <label for="new-deadline">Deadline</label>
        <input type="date" id="new-deadline" name="deadline">
      </div>

      <div class="form-group">
        <label for="new-notifikasi">Waktu Notifikasi</label>
        <input type="datetime-local" id="new-notifikasi" name="notifikasi">
      </div>

      <?php if ($menu === "shared"): ?>
        <div class="form-group">
          <label for="new-dibuat-oleh">Dibuat oleh</label>
          <input type="text" id="new-dibuat-oleh" name="dibuat_oleh" maxlength="50" placeholder="Nama pembuat" aria-required="true">
        </div>
      <?php endif; ?>

      <div class="form-group" role="group" aria-labelledby="label-gambar">
        <span class="label-teks" id="label-gambar">Gambar</span>
        <video id="kamera-video" class="gambar-todo" autoplay playsinline muted hidden aria-label="Tampilan kamera"></video>
        <canvas id="kamera-canvas" hidden></canvas>
        <img id="preview-gambar" class="gambar-todo" alt="Pratinjau foto todo" hidden>
        <button type="button" class="btn btn-kamera" id="btn-kamera">Buka Kamera</button>
        <button type="button" class="btn btn-kamera" id="btn-foto" disabled>Ambil Foto</button>
      </div>

      <p class="pesan" id="pesan" role="status"></p>

      <button type="submit" class="btn btn-utama">Tambah</button>
    </form>
  </div>
</section>

<aside class="panel panel-detail" aria-labelledby="judul-detail">
  <h2 id="judul-detail">Todo Detail</h2>

  <form action="actions.php" method="post" class="detail-form">
    <input type="hidden" name="aksi" value="ubah">
    <input type="hidden" name="id" value="<?= $idTerpilih ?>">
    <input type="hidden" name="menu" value="<?= e($menu) ?>">

    <div class="form-group">
      <label for="detail-judul">Judul</label>
      <input type="text" id="detail-judul" name="judul" maxlength="100" class="field-detail" value="<?= e($detail["judul"]) ?>" aria-required="true" disabled>
    </div>

    <div class="form-group">
      <label for="detail-deskripsi">Deskripsi</label>
      <textarea id="detail-deskripsi" name="deskripsi" rows="6" class="field-detail" disabled><?= e($detail["deskripsi"]) ?></textarea>
    </div>

    <div class="form-group">
      <label for="detail-deadline">Deadline</label>
      <input type="date" id="detail-deadline" name="deadline" class="field-detail" value="<?= e($detail["deadline"]) ?>" disabled>
    </div>

    <div class="form-group">
      <label for="detail-notifikasi">Waktu Notifikasi</label>
      <input type="datetime-local" id="detail-notifikasi" name="notifikasi" class="field-detail" value="<?= e($nilaiNotif) ?>" disabled>
    </div>

    <?php if ($menu === "shared"): ?>
      <div class="form-group">
        <label for="detail-dibuat-oleh">Dibuat oleh</label>
        <input type="text" id="detail-dibuat-oleh" name="dibuat_oleh" maxlength="50" class="field-detail" value="<?= e($detail["dibuat_oleh"]) ?>" disabled>
      </div>
    <?php endif; ?>

    <div class="form-group">
      <label for="detail-status">Status</label>
      <select id="detail-status" name="status" class="field-detail" disabled>
        <option value="pending"<?= $detail["selesai"] ? "" : " selected" ?>>Pending</option>
        <option value="completed"<?= $detail["selesai"] ? " selected" : "" ?>>Completed</option>
      </select>
    </div>

    <div class="form-group">
      <span class="label-teks">Gambar</span>
      <?php if ($detail["gambar"] !== ""): ?>
        <img id="detail-gambar" class="gambar-todo" src="uploads/<?= e($detail["gambar"]) ?>" alt="Gambar untuk todo <?= e($detail["judul"]) ?>">
      <?php else: ?>
        <p class="teks-kecil" id="detail-gambar-kosong">Belum ada gambar.</p>
      <?php endif; ?>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-utama" disabled>Simpan</button>
      <button type="button" class="btn btn-edit"<?= $todo ? "" : " disabled" ?>>Edit</button>
      <button type="submit" class="btn btn-hapus" form="form-hapus"<?= $todo ? "" : " disabled" ?>>Hapus</button>
    </div>
  </form>

  <form id="form-hapus" action="actions.php" method="post">
    <input type="hidden" name="aksi" value="hapus">
    <input type="hidden" name="id" value="<?= $idTerpilih ?>">
    <input type="hidden" name="menu" value="<?= e($menu) ?>">
  </form>
</aside>