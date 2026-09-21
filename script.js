
let todos = [
  { id: 1, judul: "Jogging tipis tipis", deskripsi: "Jogging santai keliling ITS sekitar 20-30 menit sebelum mulai kerjain tugas kuliah.", deadline: "2026-09-22", selesai: false },
  { id: 2, judul: "Belajar buat praktikum", deskripsi: "Baca modul dan latihan soal sebelum praktikum.", deadline: "2026-09-24", selesai: false },
  { id: 3, judul: "Beresin tugas PWEB", deskripsi: "Tugas HTML dan CSS sudah dikumpulkan.", deadline: "2026-09-20", selesai: false },
  { id: 4, judul: "Rapat", deskripsi: "Rapat kelompok lewat online.", deadline: "2026-09-26", selesai: false }
];
let nextId = 5;
let selectedId = 1;

const todoList = document.querySelector(".todo-list");
const formTambah = document.querySelector(".new-todo-form form");
const newJudul = document.getElementById("new-judul");
const newDeskripsi = document.getElementById("new-deskripsi");
const newDeadline = document.getElementById("new-deadline");

const formDetail = document.querySelector(".detail-form");
const detailJudul = document.getElementById("detail-judul");
const detailDeskripsi = document.getElementById("detail-deskripsi");
const detailDeadline = document.getElementById("detail-deadline");
const detailStatus = document.getElementById("detail-status");
const btnSimpan = document.querySelector(".detail-form .btn-utama");
const btnEdit = document.querySelector(".btn-edit");
const btnHapus = document.querySelector(".btn-hapus");
const btnTema = document.querySelector(".btn-tema");

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
    if (todo.id === selectedId){
      item.classList.add("aktif");
    }

    const info = document.createElement("div");
    info.className = "todo-info";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.selesai;

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
      tampilkanList();
      tampilkanDetail();
    });

    item.addEventListener("click", function (e){
      if (e.target === checkbox) return;
      selectedId = todo.id;
      tampilkanList();
      tampilkanDetail();
    });
  });
}

function setEdit(boleh){
  detailJudul.disabled = !boleh;
  detailDeskripsi.disabled = !boleh;
  detailDeadline.disabled = !boleh;
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
    detailStatus.value = "pending";
    btnEdit.disabled = true;
    btnHapus.disabled = true;
    return;
  }

  detailJudul.value = todo.judul;
  detailDeskripsi.value = todo.deskripsi;
  detailDeadline.value = todo.deadline;
  detailStatus.value = todo.selesai ? "completed" : "pending";
  btnEdit.disabled = false;
  btnHapus.disabled = false;
}

formTambah.addEventListener("submit", function (e){
  e.preventDefault();

  const judul = newJudul.value.trim();
  const deskripsi = newDeskripsi.value.trim();
  const deadline = newDeadline.value;

  if (judul === ""){
    alert("Judul tidak boleh kosong!");
    return;
  }

  todos.push({ id: nextId, judul: judul, deskripsi: deskripsi, deadline: deadline, selesai: false });
  selectedId = nextId;
  nextId++;

  formTambah.reset();
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
    return;
  }

  todo.judul = judul;
  todo.deskripsi = detailDeskripsi.value.trim();
  todo.deadline = detailDeadline.value;
  todo.selesai = detailStatus.value === "completed";

  tampilkanList();
  tampilkanDetail();
});

btnHapus.addEventListener("click", function (){
  if (!confirm("Yakin ingin menghapus todo ini?")) return;

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
  } else {
    btnTema.textContent = "Mode Gelap";
  }
});

tampilkanList();
tampilkanDetail();