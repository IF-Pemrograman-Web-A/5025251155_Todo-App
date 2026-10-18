const dataNotifikasi = JSON.parse(document.getElementById("data-notifikasi").textContent);
let streamKamera = null;

const formTambah = document.querySelector(".new-todo-form form");
const newJudul = document.getElementById("new-judul");
const newNotifikasi = document.getElementById("new-notifikasi");
const gambarData = document.getElementById("gambar-data");

const kameraVideo = document.getElementById("kamera-video");
const kameraCanvas = document.getElementById("kamera-canvas");
const previewGambar = document.getElementById("preview-gambar");
const btnKamera = document.getElementById("btn-kamera");
const btnFoto = document.getElementById("btn-foto");
const pesan = document.getElementById("pesan");

const formDetail = document.querySelector(".detail-form");
const formHapus = document.getElementById("form-hapus");
const fieldDetail = formDetail.querySelectorAll(".field-detail");
const detailJudul = document.getElementById("detail-judul");
const detailNotifikasi = document.getElementById("detail-notifikasi");
const btnSimpan = document.querySelector(".detail-form .btn-utama");
const btnEdit = document.querySelector(".btn-edit");
const btnTema = document.querySelector(".btn-tema");

function setEdit(boleh){
  fieldDetail.forEach(function (field){
    field.disabled = !boleh;
  });
  btnSimpan.disabled = !boleh;
}

setEdit(false);

document.querySelectorAll(".todo-item").forEach(function (item){
  item.addEventListener("click", function (e){
    if (e.target.closest("a") || e.target.closest("form")) return;
    const link = item.querySelector("a");
    if (link) window.location.href = link.href;
  });
});

document.querySelectorAll(".form-selesai input[type='checkbox']").forEach(function (checkbox){
  checkbox.addEventListener("change", function (){
    checkbox.form.submit();
  });
});

if (location.hash.indexOf("#cb-") === 0){
  const checkbox = document.querySelector(location.hash);
  if (checkbox) checkbox.focus();
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
  const data = new FormData();
  data.append("aksi", "notif");
  data.append("id", id);
  fetch("actions.php", { method: "POST", body: data });
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

formTambah.addEventListener("submit", function (e){
  if (newJudul.value.trim() === ""){
    e.preventDefault();
    alert("Judul tidak boleh kosong!");
    newJudul.focus();
    return;
  }

  const namaPembuat = document.getElementById("new-dibuat-oleh");
  if (namaPembuat && namaPembuat.value.trim() === ""){
    e.preventDefault();
    alert("Nama pembuat tidak boleh kosong untuk todo Shared!");
    namaPembuat.focus();
    return;
  }

  if (newNotifikasi.value !== ""){
    mintaIzinNotifikasi();
  }
});

btnEdit.addEventListener("click", function (){
  setEdit(true);
  detailJudul.focus();
});

formDetail.addEventListener("submit", function (e){
  if (detailJudul.value.trim() === ""){
    e.preventDefault();
    alert("Judul tidak boleh kosong!");
    detailJudul.focus();
    return;
  }

  const namaPembuat = document.getElementById("detail-dibuat-oleh");
  if (namaPembuat && namaPembuat.value.trim() === ""){
    e.preventDefault();
    alert("Nama pembuat tidak boleh kosong untuk todo Shared!");
    namaPembuat.focus();
  }
});

formHapus.addEventListener("submit", function (e){
  if (!confirm("Yakin ingin menghapus todo ini?")){
    e.preventDefault();
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

daftarServiceWorker();
cekNotifikasi();
setInterval(cekNotifikasi, 10000);