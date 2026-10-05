const daftarAwal = [
  { id: 1, judul: "Jogging tipis tipis", deskripsi: "Jogging santai keliling ITS sekitar 20-30 menit sebelum mulai kerjain tugas kuliah.", deadline: "2026-09-22", selesai: false, gambar: "", notifikasi: "", sudahNotif: false },
  { id: 2, judul: "Belajar buat praktikum", deskripsi: "Baca modul dan latihan soal sebelum praktikum.", deadline: "2026-09-24", selesai: false, gambar: "", notifikasi: "", sudahNotif: false },
  { id: 3, judul: "Beresin tugas PWEB", deskripsi: "Tugas HTML dan CSS sudah dikumpulkan.", deadline: "2026-09-20", selesai: false, gambar: "", notifikasi: "", sudahNotif: false },
  { id: 4, judul: "Rapat", deskripsi: "Rapat kelompok lewat online.", deadline: "2026-09-26", selesai: false, gambar: "", notifikasi: "", sudahNotif: false }
];
let todos = [];
let nextId = 1;
let selectedId = null;
let db;
let gambarBaru = "";
let streamKamera = null;

const todoList = document.querySelector(".todo-list");
const formTambah = document.querySelector(".new-todo-form form");
const newJudul = document.getElementById("new-judul");
const newDeskripsi = document.getElementById("new-deskripsi");
const newDeadline = document.getElementById("new-deadline");
const newNotifikasi = document.getElementById("new-notifikasi");

const kameraVideo = document.getElementById("kamera-video");
const kameraCanvas = document.getElementById("kamera-canvas");
const previewGambar = document.getElementById("preview-gambar");
const btnKamera = document.getElementById("btn-kamera");
const btnFoto = document.getElementById("btn-foto");
const pesan = document.getElementById("pesan");

const formDetail = document.querySelector(".detail-form");
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

function bukaDatabase(callback){
  const request = indexedDB.open("todoDB", 1);

  request.onupgradeneeded = function (event){
    const database = event.target.result;
    const store = database.createObjectStore("todos", { keyPath: "id" });
    daftarAwal.forEach(function (todo){
      store.add(todo);
    });
  };

  request.onsuccess = function (event){
    db = event.target.result;
    callback();
  };

  request.onerror = function (){
    alert("IndexedDB gagal dibuka!");
  };
}

function ambilSemuaTodo(callback){
  const store = db.transaction("todos", "readonly").objectStore("todos");
  store.getAll().onsuccess = function (event){
    callback(event.target.result);
  };
}

function simpanKeDB(todo){
  db.transaction("todos", "readwrite").objectStore("todos").put(todo);
}

function hapusDariDB(id){
  db.transaction("todos", "readwrite").objectStore("todos").delete(id);
}

function getTodoTerpilih(){
  return todos.find(function (todo){
    return todo.id === selectedId;
  });
}

function formatTanggal(tanggal){
  const bagian = tanggal.split("-");
  return bagian[2] + "/" + bagian[1] + "/" + bagian[0];
}

function tampilkanList(){
  todoList.innerHTML = "";

  todos.forEach(function (todo) {
    const item = document.createElement("li");
    item.className = "todo-item";
    item.tabIndex = 0;
    if (todo.id === selectedId){
      item.classList.add("aktif");
      item.setAttribute("aria-current", "true");
    }

    const info = document.createElement("div");
    info.className = "todo-info";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.selesai;
    checkbox.setAttribute("aria-label", "Tandai selesai: " + todo.judul);

    const judul = document.createElement("span");
    judul.className = "todo-judul";
    judul.textContent = todo.judul;
    if (todo.selesai) {
      judul.classList.add("selesai");
    }

    const status = document.createElement("span");
    status.className = "status";
    if (todo.selesai) {
      status.classList.add("status-completed");
      status.textContent = "Completed";
    } else {
      status.classList.add("status-pending");
      status.textContent = "Pending";
    }

    info.append(checkbox, judul, status);
    item.appendChild(info);

    if (todo.deadline !== ""){
      const deadline = document.createElement("div");
      deadline.className = "todo-deadline";
      deadline.textContent = "Deadline: " + formatTanggal(todo.deadline);
      item.appendChild(deadline);
    }
    todoList.appendChild(item);

    checkbox.addEventListener("change", function () {
      todo.selesai = checkbox.checked;
      simpanKeDB(todo);
      tampilkanList();
      tampilkanDetail();
      todoList.querySelectorAll("input[type='checkbox']")[todos.indexOf(todo)].focus();
    });

    item.addEventListener("click", function (e){
      if (e.target === checkbox) return;
      selectedId = todo.id;
      tampilkanList();
      tampilkanDetail();
    });

    item.addEventListener("keydown", function (e){
      if (e.target !== item) return;
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        selectedId = todo.id;
        tampilkanList();
        tampilkanDetail();
        document.querySelector(".todo-item.aktif").focus();
      }
    });
  });
}

function setEdit(boleh){
  detailJudul.disabled = !boleh;
  detailDeskripsi.disabled = !boleh;
  detailDeadline.disabled = !boleh;
  detailNotifikasi.disabled = !boleh;
  detailStatus.disabled = !boleh;
  btnSimpan.disabled = !boleh;
}

function tampilkanDetail(){
  const todo = getTodoTerpilih();
  setEdit(false);

  if (!todo){
    detailJudul.value = "";
    detailDeskripsi.value = "";
    detailDeadline.value = "";
    detailNotifikasi.value = "";
    detailStatus.value = "pending";
    detailGambar.hidden = true;
    detailGambarKosong.hidden = false;
    btnEdit.disabled = true;
    btnHapus.disabled = true;
    return;
  }

  detailJudul.value = todo.judul;
  detailDeskripsi.value = todo.deskripsi;
  detailDeadline.value = todo.deadline;
  detailNotifikasi.value = todo.notifikasi;
  detailStatus.value = todo.selesai ? "completed" : "pending";

  if (todo.gambar !== ""){
    detailGambar.src = todo.gambar;
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

  gambarBaru = kameraCanvas.toDataURL("image/jpeg", 0.7);
  previewGambar.src = gambarBaru;
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

function kirimNotifikasi(todo){
  if (!("serviceWorker" in navigator)) return;

  let isi = "Waktunya mengerjakan todo ini.";
  if (todo.deadline !== ""){
    isi = "Deadline: " + formatTanggal(todo.deadline);
  }

  navigator.serviceWorker.ready.then(function (registration){
    registration.active.postMessage({ judul: "Pengingat: " + todo.judul, isi: isi });
  });
}

function cekNotifikasi(){
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const sekarang = new Date();

  todos.forEach(function (todo){
    if (todo.notifikasi === "" || todo.sudahNotif || todo.selesai) return;

    if (new Date(todo.notifikasi) <= sekarang){
      todo.sudahNotif = true;
      simpanKeDB(todo);
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

formTambah.addEventListener("submit", function (e){
  e.preventDefault();

  const judul = newJudul.value.trim();
  const deskripsi = newDeskripsi.value.trim();
  const deadline = newDeadline.value;
  const notifikasi = newNotifikasi.value;

  if (judul === ""){
    alert("Judul tidak boleh kosong!");
    newJudul.focus();
    return;
  }

  const todoBaru = { id: nextId, judul: judul, deskripsi: deskripsi, deadline: deadline, selesai: false, gambar: gambarBaru, notifikasi: notifikasi, sudahNotif: false };
  todos.push(todoBaru);
  simpanKeDB(todoBaru);
  selectedId = nextId;
  nextId++;

  if (notifikasi !== ""){
    mintaIzinNotifikasi();
  }

  formTambah.reset();
  gambarBaru = "";
  previewGambar.hidden = true;
  matikanKamera();
  pesan.textContent = "";
  tampilkanList();
  tampilkanDetail();
});

btnEdit.addEventListener("click", function (){
  setEdit(true);
  detailJudul.focus();
});

formDetail.addEventListener("submit", function (e){
  e.preventDefault();

  const todo = getTodoTerpilih();
  const judul = detailJudul.value.trim();

  if (judul === ""){
    alert("Judul tidak boleh kosong!");
    detailJudul.focus();
    return;
  }

  if (todo.notifikasi !== detailNotifikasi.value){
    todo.sudahNotif = false;
  }

  todo.judul = judul;
  todo.deskripsi = detailDeskripsi.value.trim();
  todo.deadline = detailDeadline.value;
  todo.notifikasi = detailNotifikasi.value;
  todo.selesai = detailStatus.value === "completed";
  simpanKeDB(todo);

  if (todo.notifikasi !== ""){
    mintaIzinNotifikasi();
  }

  tampilkanList();
  tampilkanDetail();
  btnEdit.focus();
});

btnHapus.addEventListener("click", function (){
  if (!confirm("Yakin ingin menghapus todo ini?")) return;

  hapusDariDB(selectedId);
  todos = todos.filter(function (todo){
    return todo.id !== selectedId;
  });
  selectedId = todos.length > 0 ? todos[0].id : null;

  tampilkanList();
  tampilkanDetail();
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

bukaDatabase(function (){
  ambilSemuaTodo(function (hasil){
    todos = hasil;
    todos.forEach(function (todo){
      if (todo.id >= nextId){
        nextId = todo.id + 1;
      }
    });
    selectedId = todos.length > 0 ? todos[0].id : null;

    tampilkanList();
    tampilkanDetail();
    cekNotifikasi();
  });
});

daftarServiceWorker();
setInterval(cekNotifikasi, 10000);