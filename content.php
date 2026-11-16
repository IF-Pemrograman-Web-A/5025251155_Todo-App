<section class="panel panel-list" aria-labelledby="judul-list">
  <h2 id="judul-list"><?= $menu === "shared" ? "Shared Tasks" : "My Tasks" ?></h2>
  <p class="pesan" id="pesan-server" role="status"></p>

  <ul class="todo-list" id="todo-list">
    <li class="teks-kecil">Memuat todo...</li>
  </ul>
  <hr>
  <div class="new-todo-form">
    <h3>Add New Todo</h3>
    <form>
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

  <form class="detail-form">
    <div class="form-group">
      <label for="detail-judul">Judul</label>
      <input type="text" id="detail-judul" name="judul" maxlength="100" class="field-detail" aria-required="true" disabled>
    </div>

    <div class="form-group">
      <label for="detail-deskripsi">Deskripsi</label>
      <textarea id="detail-deskripsi" name="deskripsi" rows="6" class="field-detail" disabled></textarea>
    </div>

    <div class="form-group">
      <label for="detail-deadline">Deadline</label>
      <input type="date" id="detail-deadline" name="deadline" class="field-detail" disabled>
    </div>

    <div class="form-group">
      <label for="detail-notifikasi">Waktu Notifikasi</label>
      <input type="datetime-local" id="detail-notifikasi" name="notifikasi" class="field-detail" disabled>
    </div>

    <?php if ($menu === "shared"): ?>
      <div class="form-group">
        <label for="detail-dibuat-oleh">Dibuat oleh</label>
        <input type="text" id="detail-dibuat-oleh" name="dibuat_oleh" maxlength="50" class="field-detail" disabled>
      </div>
    <?php endif; ?>

    <div class="form-group">
      <label for="detail-status">Status</label>
      <select id="detail-status" name="status" class="field-detail" disabled>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <div class="form-group">
      <span class="label-teks">Gambar</span>
      <img id="detail-gambar" class="gambar-todo" alt="" hidden>
      <p class="teks-kecil" id="detail-gambar-kosong">Belum ada gambar.</p>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-utama" disabled>Simpan</button>
      <button type="button" class="btn btn-edit" disabled>Edit</button>
      <button type="button" class="btn btn-hapus" disabled>Hapus</button>
    </div>
  </form>
</aside>