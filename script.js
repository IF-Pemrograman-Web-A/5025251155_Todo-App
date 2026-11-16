const dataApp = JSON.parse(document.getElementById("data-app").textContent);
const menu = dataApp.menu;
const urlApi = "api.php/todos";

let dataNotifikasi = [];
let daftarTodo = [];
let idTerpilih = 0;
let streamKamera = null;

const daftarPesan = {
  ditambah: "Todo berhasil ditambahkan.",
  disimpan: "Perubahan berhasil disimpan.",
  dihapus: "Todo berhasil dihapus."
};

const todoList = document.getElementById("todo-list");
const pesanServer = document.getElementById("pesan-server");

const formTambah = document.querySelector(".new-todo-form form");
const newJudul = document.getElementById("new-judul");
const newDeskripsi = document.getElementById("new-deskripsi");
const newDeadline = document.getElementById("new-deadline");
const newNotifikasi = document.getElementById("new-notifikasi");
const gambarData = document.getElementById("gambar-data");

const kameraVideo = document.getElementById("kamera-video");
const kameraCanvas = document.getElementById("kamera-canvas");
const previewGambar = document.getElementById("preview-gambar");
const btnKamera = document.getElementById("btn-kamera");
const btnFoto = document.getElementById("btn-foto");
const pesan = document.getElementById("pesan");

const formDetail = document.querySelector(".detail-form");
const fieldDetail = formDetail.querySelectorAll(".field-detail");
const detailJudul = document.getElementById("detail-judul");
const detailDeskripsi = document.getElementById("detail-deskripsi");
const detailDeadline = document.getElementById("detail-deadline");
const detailNotifikasi = document.getElementById("detail-notifikasi");
const detailStatus = document.getElementById("detail-status");
const detailGambar = document.getElementById("detail-gambar");
const detailGambarKosong = document.getElementById("detail-gambar-kosong");
const btnSimpan = document.querySelector(".detail-form .btn-utama");
const btnEdit = document.querySelector(".btn-edit");
const btnHapus = document.querySelector(".btn-hapus");
const btnTema = document.querySelector(".btn-tema");

async function panggilApi(path, method, body){
  const opsi = { method: method, headers: { "X-API-Key": dataApp.apiKey } };
  if (body !== undefined){
    opsi.headers["Content-Type"] = "application/json";
    opsi.body = JSON.stringify(body);
  }

  const response = await fetch(urlApi + path, opsi);
  let hasil = null;
  if (response.status !== 204){
    hasil = await response.json().catch(function (){
      return null;
    });
  }
  return { ok: response.ok, status: response.status, hasil: hasil };
}

function teksError(res){
  if (res.hasil && res.hasil.errors){
    return Object.values(res.hasil.errors)[0];
  }
  if (res.hasil && res.hasil.message){
    return res.hasil.message;
  }
  return "Terjadi kesalahan pada server (status " + res.status + ").";
}

const teksGagalTerhubung = "Tidak bisa terhubung ke server. Periksa koneksi internet.";

function formatTanggal(tanggal){
  const bagian = tanggal.split("-");
  return bagian[2] + "/" + bagian[1] + "/" + bagian[0];
}

function buat(tag, kelas, teks){
  const el = document.createElement(tag);
  if (kelas) el.className = kelas;
  if (teks !== undefined) el.textContent = teks;
  return el;
}

function setEdit(boleh){
  fieldDetail.forEach(function (field){
    field.disabled = !boleh;
  });
  btnSimpan.disabled = !boleh;
}

setEdit(false);

function buatItem(t){
  const aktif = t.id === idTerpilih;
  const item = buat("li", "todo-item" + (aktif ? " aktif" : ""));
  if (aktif) item.setAttribute("aria-current", "true");

  const info = buat("div", "todo-info");

  const form = buat("form", "form-selesai");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "cb-" + t.id;
  checkbox.checked = t.selesai;
  checkbox.setAttribute("aria-label", "Tandai selesai: " + t.judul);
  checkbox.addEventListener("change", function (){
    ubahSelesai(t, checkbox);
  });
  form.appendChild(checkbox);
  info.appendChild(form);

  const judul = buat("span", "todo-judul" + (t.selesai ? " selesai" : ""));
  const link = buat("a", "", t.judul);
  link.href = "index.php?menu=" + menu + "&id=" + t.id;
  judul.appendChild(link);
  info.appendChild(judul);

  if (t.selesai){
    info.appendChild(buat("span", "status status-completed", "Completed"));
  } else {
    info.appendChild(buat("span", "status status-pending", "Pending"));
  }
  item.appendChild(info);

  if (t.deadline){
    item.appendChild(buat("div", "todo-deadline", "Deadline: " + formatTanggal(t.deadline)));
  }
  if (menu === "shared" && t.dibuat_oleh !== ""){
    item.appendChild(buat("div", "todo-deadline", "Dibuat oleh: " + t.dibuat_oleh));
  }

  item.addEventListener("click", function (e){
    if (e.target.closest("a") || e.target.closest("form")) return;
    window.location.href = link.href;
  });

  return item;
}

function renderList(){
  todoList.textContent = "";

  if (daftarTodo.length === 0){
    todoList.appendChild(buat("li", "teks-kecil", "Belum ada todo."));
    return;
  }

  daftarTodo.forEach(function (t){
    todoList.appendChild(buatItem(t));
  });
}

function tampilGagalMuat(teks){
  todoList.textContent = "";
  todoList.appendChild(buat("li", "teks-kecil", teks));
}

function isiDetail(todo){
  detailJudul.value = todo.judul;
  detailDeskripsi.value = todo.deskripsi || "";
  detailDeadline.value = todo.deadline || "";
  detailNotifikasi.value = todo.notifikasi ? todo.notifikasi.slice(0, 16) : "";
  detailStatus.value = todo.selesai ? "completed" : "pending";

  const dibuatOleh = document.getElementById("detail-dibuat-oleh");
  if (dibuatOleh) dibuatOleh.value = todo.dibuat_oleh;

  if (todo.gambar !== ""){
    detailGambar.src = "uploads/" + todo.gambar;
    detailGambar.alt = "Gambar untuk todo " + todo.judul;
    detailGambar.hidden = false;
    detailGambarKosong.hidden = true;
  } else {
    detailGambar.hidden = true;
    detailGambarKosong.hidden = false;
  }

  btnEdit.disabled = false;
  btnHapus.disabled = false;
}

async function muatData(){
  try {
    const res = await panggilApi("?jenis=" + menu, "GET");
    if (!res.ok){
      tampilGagalMuat(teksError(res));
      return;
    }
    daftarTodo = res.hasil.data;

    let todo = daftarTodo.length > 0 ? daftarTodo[0] : null;
    daftarTodo.forEach(function (t){
      if (t.id === dataApp.id) todo = t;
    });
    idTerpilih = todo ? todo.id : 0;
    renderList();

    if (todo){
      const detail = await panggilApi("/" + idTerpilih, "GET");
      if (!detail.ok){
        pesanServer.textContent = teksError(detail);
        return;
      }
      isiDetail(detail.hasil.data);
    }
  } catch (error){
    tampilGagalMuat("Data todo tidak bisa dimuat. Periksa koneksi internet lalu muat ulang halaman.");
  }
}

async function muatNotifikasi(){
  try {
    const res = await panggilApi("?notifikasi=belum", "GET");
    if (!res.ok) return;

    dataNotifikasi = res.hasil.data.map(function (t){
      return {
        id: t.id,
        judul: t.judul,
        deadline: t.deadline ? formatTanggal(t.deadline) : "",
        notifikasi: t.notifikasi,
        sudahNotif: false
      };
    });
    cekNotifikasi();
  } catch (error){
    console.error("Data notifikasi gagal dimuat:", error);
  }
}

async function ubahSelesai(t, checkbox){
  pesanServer.textContent = "";

  let res;
  try {
    res = await panggilApi("/" + t.id, "PATCH", { selesai: checkbox.checked });
  } catch (error){
    checkbox.checked = !checkbox.checked;
    pesanServer.textContent = teksGagalTerhubung;
    return;
  }

  if (!res.ok){
    checkbox.checked = !checkbox.checked;
    pesanServer.textContent = teksError(res);
    return;
  }

  t.selesai = res.hasil.data.selesai;
  renderList();
  if (t.id === idTerpilih){
    isiDetail(res.hasil.data);
    setEdit(false);
  }
  document.getElementById("cb-" + t.id).focus();
}

function matikanKamera(){
  if (streamKamera){
    streamKamera.getTracks().forEach(function (track){
      track.stop();
    });
    streamKamera = null;
  }
  kameraVideo.srcObject = null;
  kameraVideo.hidden = true;
  btnFoto.disabled = true;
}

btnKamera.addEventListener("click", async function (){
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    pesan.textContent = "Kamera tidak didukung di browser ini.";
    return;
  }

  try {
    streamKamera = await navigator.mediaDevices.getUserMedia({ video: true });
    kameraVideo.srcObject = streamKamera;
    kameraVideo.hidden = false;
    btnFoto.disabled = false;
    btnFoto.focus();
    pesan.textContent = "Kamera aktif. Tekan tombol Ambil Foto.";
  } catch (error) {
    pesan.textContent = "Kamera tidak bisa diakses. Periksa izin kamera di browser.";
  }
});

btnFoto.addEventListener("click", function (){
  const lebar = kameraVideo.videoWidth;
  const tinggi = kameraVideo.videoHeight;

  if (!lebar || !tinggi){
    pesan.textContent = "Kamera belum siap, coba lagi sebentar.";
    return;
  }

  kameraCanvas.width = lebar;
  kameraCanvas.height = tinggi;
  kameraCanvas.getContext("2d").drawImage(kameraVideo, 0, 0, lebar, tinggi);

  const hasilFoto = kameraCanvas.toDataURL("image/jpeg", 0.7);
  gambarData.value = hasilFoto;
  previewGambar.src = hasilFoto;
  previewGambar.hidden = false;

  matikanKamera();
  btnKamera.focus();
  pesan.textContent = "Foto berhasil diambil.";
});

function mintaIzinNotifikasi(){
  if (!("Notification" in window)) return;
  if (Notification.permission === "default"){
    Notification.requestPermission();
  }
}

function tandaiSudahNotif(id){
  panggilApi("/" + id, "PATCH", { sudah_notif: true }).catch(function (error){
    console.error("Gagal menandai notifikasi:", error);
  });
}

function kirimNotifikasi(todo){
  if (!("serviceWorker" in navigator)) return;

  let isi = "Waktunya mengerjakan todo ini.";
  if (todo.deadline !== ""){
    isi = "Deadline: " + todo.deadline;
  }

  navigator.serviceWorker.ready.then(function (registration){
    registration.active.postMessage({ judul: "Pengingat: " + todo.judul, isi: isi });
  });
}

function cekNotifikasi(){
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const sekarang = new Date();

  dataNotifikasi.forEach(function (todo){
    if (todo.sudahNotif) return;

    if (new Date(todo.notifikasi) <= sekarang){
      todo.sudahNotif = true;
      tandaiSudahNotif(todo.id);
      kirimNotifikasi(todo);
    }
  });
}

async function daftarServiceWorker(){
  if (!("serviceWorker" in navigator)){
    console.error("Service Worker API not supported.");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("./sw.js");
    console.log("Service worker registration succeeded:", registration);
  } catch (error) {
    console.error("Service worker registration failed:", error);
  }
}

newNotifikasi.addEventListener("change", mintaIzinNotifikasi);
detailNotifikasi.addEventListener("change", mintaIzinNotifikasi);

formTambah.addEventListener("submit", async function (e){
  e.preventDefault();

  if (newJudul.value.trim() === ""){
    alert("Judul tidak boleh kosong!");
    newJudul.focus();
    return;
  }

  const namaPembuat = document.getElementById("new-dibuat-oleh");
  if (namaPembuat && namaPembuat.value.trim() === ""){
    alert("Nama pembuat tidak boleh kosong untuk todo Shared!");
    namaPembuat.focus();
    return;
  }

  if (newNotifikasi.value !== ""){
    mintaIzinNotifikasi();
  }

  const data = {
    jenis: menu,
    judul: newJudul.value,
    deskripsi: newDeskripsi.value,
    deadline: newDeadline.value,
    notifikasi: newNotifikasi.value,
    gambar_data: gambarData.value
  };
  if (namaPembuat) data.dibuat_oleh = namaPembuat.value;

  pesanServer.textContent = "";

  try {
    const res = await panggilApi("", "POST", data);
    if (!res.ok){
      pesanServer.textContent = teksError(res);
      return;
    }
    window.location.href = "index.php?menu=" + menu + "&id=" + res.hasil.data.id + "&pesan=ditambah";
  } catch (error){
    pesanServer.textContent = teksGagalTerhubung;
  }
});

btnEdit.addEventListener("click", function (){
  setEdit(true);
  detailJudul.focus();
});

formDetail.addEventListener("submit", async function (e){
  e.preventDefault();

  if (detailJudul.value.trim() === ""){
    alert("Judul tidak boleh kosong!");
    detailJudul.focus();
    return;
  }

  const namaPembuat = document.getElementById("detail-dibuat-oleh");
  if (namaPembuat && namaPembuat.value.trim() === ""){
    alert("Nama pembuat tidak boleh kosong untuk todo Shared!");
    namaPembuat.focus();
    return;
  }

  const data = {
    judul: detailJudul.value,
    deskripsi: detailDeskripsi.value,
    deadline: detailDeadline.value,
    notifikasi: detailNotifikasi.value,
    selesai: detailStatus.value === "completed"
  };
  if (namaPembuat) data.dibuat_oleh = namaPembuat.value;

  pesanServer.textContent = "";

  try {
    const res = await panggilApi("/" + idTerpilih, "PUT", data);
    if (!res.ok){
      pesanServer.textContent = teksError(res);
      return;
    }
    window.location.href = "index.php?menu=" + menu + "&id=" + idTerpilih + "&pesan=disimpan";
  } catch (error){
    pesanServer.textContent = teksGagalTerhubung;
  }
});

btnHapus.addEventListener("click", async function (){
  if (sedangOffline()) return;
  if (!confirm("Yakin ingin menghapus todo ini?")) return;

  pesanServer.textContent = "";

  try {
    const res = await panggilApi("/" + idTerpilih, "DELETE");
    if (!res.ok){
      pesanServer.textContent = teksError(res);
      return;
    }
    window.location.href = "index.php?menu=" + menu + "&pesan=dihapus";
  } catch (error){
    pesanServer.textContent = teksGagalTerhubung;
  }
});

btnTema.addEventListener("click", function (){
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")){
    btnTema.textContent = "Mode Terang";
    localStorage.setItem("tema", "dark");
  } else {
    btnTema.textContent = "Mode Gelap";
    localStorage.setItem("tema", "light");
  }
});

if (localStorage.getItem("tema") === "dark"){
  document.body.classList.add("dark");
  btnTema.textContent = "Mode Terang";
}

const btnInstall = document.getElementById("btn-install");
let promptInstall = null;

function sedangOffline(){
  if (navigator.onLine) return false;
  alert("Kamu sedang offline, perubahan belum bisa disimpan. Sambungkan internet lalu coba lagi.");
  return true;
}

document.addEventListener("submit", function (e){
  if (sedangOffline()){
    e.preventDefault();
    e.stopPropagation();
  }
}, true);

document.addEventListener("change", function (e){
  if (e.target.matches(".form-selesai input[type='checkbox']") && sedangOffline()){
    e.target.checked = !e.target.checked;
    e.stopPropagation();
  }
}, true);

window.addEventListener("beforeinstallprompt", function (e){
  e.preventDefault();
  promptInstall = e;
  btnInstall.hidden = false;
});

btnInstall.addEventListener("click", async function (){
  if (!promptInstall) return;
  await promptInstall.prompt();
  promptInstall = null;
  btnInstall.hidden = true;
});

window.addEventListener("appinstalled", function (){
  promptInstall = null;
  btnInstall.hidden = true;
});


const kodePesan = new URLSearchParams(location.search).get("pesan");
if (kodePesan && daftarPesan.hasOwnProperty(kodePesan)){
  pesanServer.textContent = daftarPesan[kodePesan];
}

daftarServiceWorker();
muatData();
muatNotifikasi();
setInterval(cekNotifikasi, 10000);