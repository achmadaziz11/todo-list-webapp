const form = document.getElementById("todoForm");
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("dueDate");
const todoListEl = document.getElementById("todoList");
const emptyMsg = document.getElementById("emptyMsg");
const filterText = document.getElementById("filterText");
const filterStatus = document.getElementById("filterStatus");
const clearBtn = document.getElementById("clearBtn");

let todos = JSON.parse(localStorage.getItem("todos_v1") || "[]");

function save() {
  localStorage.setItem("todos_v1", JSON.stringify(todos));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function render() {
  // apply filters
  const q = (filterText.value || "").toLowerCase();
  const status = filterStatus.value;
  const filtered = todos.filter((t) => {
    if (status === "pending" && t.done) return false;
    if (status === "done" && !t.done) return false;
    if (q && !t.title.toLowerCase().includes(q)) return false;
    return true;
  });

  todoListEl.innerHTML = "";
  if (filtered.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";

  filtered.forEach((t) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const left = document.createElement("div");
    left.className = "todo-left";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "checkbox";
    cb.checked = !!t.done;
    cb.setAttribute("aria-label", "Tandai selesai");
    cb.addEventListener("change", () => {
      t.done = cb.checked;
      save();
      render();
    });

    const meta = document.createElement("div");
    const title = document.createElement("div");
    title.className = "todo-title";
    title.textContent = t.title;
    if (t.done) title.style.textDecoration = "line-through";

    const info = document.createElement("div");
    info.className = "todo-date";
    info.textContent = t.dueDate ? formatDate(t.dueDate) : "Tanpa tanggal";

    meta.appendChild(title);
    meta.appendChild(info);
    left.appendChild(cb);
    left.appendChild(meta);

    const btns = document.createElement("div");
    btns.className = "btns";
    const del = document.createElement("button");
    del.className = "btn-delete";
    del.textContent = "Hapus";
    del.addEventListener("click", () => {
      if (confirm("Hapus tugas ini?")) {
        todos = todos.filter((x) => x.id !== t.id);
        save();
        render();
      }
    });

    btns.appendChild(del);

    li.appendChild(left);
    li.appendChild(btns);
    todoListEl.appendChild(li);
  });
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return iso;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const dueDate = dateInput.value || null;

  // Validate input form (required title)
  if (!title) {
    titleInput.focus();
    alert("Isi nama tugas sebelum menambahkan.");
    return;
  }

  const newTodo = {
    id: uid(),
    title,
    dueDate,
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.unshift(newTodo);
  save();
  form.reset();
  titleInput.focus();
  render();
});

filterText.addEventListener("input", render);
filterStatus.addEventListener("change", render);
clearBtn.addEventListener("click", () => {
  if (!todos.length) return alert("Tidak ada tugas untuk dibersihkan.");
  if (confirm("Hapus semua tugas?")) {
    todos = [];
    save();
    render();
  }
});

// initial render
render();
