const form = document.getElementById('todoForm');

btns.appendChild(del);


li.appendChild(left); li.appendChild(btns);
todoListEl.appendChild(li);



function formatDate(iso){
try{
const d = new Date(iso);
return d.toLocaleDateString('id-ID', {year:'numeric', month:'short', day:'numeric'});
}catch(e){ return iso; }
}


form.addEventListener('submit', (e) => {
e.preventDefault();
const title = titleInput.value.trim();
const dueDate = dateInput.value || null;


// Validate input form (required title)
if(!title){
titleInput.focus();
alert('Isi nama tugas sebelum menambahkan.');
return;
}


const newTodo = { id: uid(), title, dueDate, done: false, createdAt: new Date().toISOString() };
todos.unshift(newTodo);
save();
form.reset();
titleInput.focus();
render();
});


filterText.addEventListener('input', render);
filterStatus.addEventListener('change', render);
clearBtn.addEventListener('click', () => {
if(!todos.length) return alert('Tidak ada tugas untuk dibersihkan.');
if(confirm('Hapus semua tugas?')){ todos = []; save(); render(); }
});


// initial render
render();