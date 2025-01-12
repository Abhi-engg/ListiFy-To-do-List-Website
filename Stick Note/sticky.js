const noteContainer = document.getElementById('noteContainer');
const addBtn = document.getElementById('addBtn');
const emojiPicker = document.getElementById('emojiPicker');
const colorPicker = document.getElementById('colorPicker');
const themeToggle = document.getElementById('themeToggle');
const colors = ['#e6f2ff', '#b3d9ff', '#80bfff', '#4da6ff', '#1a8cff'];

function createNote() {
  const note = document.createElement('div');
  note.className = 'note';
  note.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  note.innerHTML = `
    <div class="note-header">
      <button class="color-btn">🎨</button>
      <button class="emoji-btn">😀</button>
      <button class="delete-btn">X</button>
    </div>
    <textarea class="note-text" placeholder="Type your note here..."></textarea>
  `;
  noteContainer.appendChild(note);

  const deleteBtn = note.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => {
    note.remove();
    saveNotes();
  });

  const colorBtn = note.querySelector('.color-btn');
  colorBtn.addEventListener('click', (e) => {
    const rect = colorBtn.getBoundingClientRect();
    colorPicker.style.display = 'block';
    colorPicker.style.top = `${rect.bottom + window.scrollY}px`;
    colorPicker.style.left = `${rect.left + window.scrollX}px`;
    colorPicker.dataset.targetNote = note.id;
  });

  const emojiBtn = note.querySelector('.emoji-btn');
  emojiBtn.addEventListener('click', (e) => {
    const rect = emojiBtn.getBoundingClientRect();
    emojiPicker.style.display = 'block';
    emojiPicker.style.top = `${rect.bottom + window.scrollY}px`;
    emojiPicker.style.left = `${rect.left + window.scrollX}px`;
    emojiPicker.dataset.targetNote = note.id;
  });

  const textarea = note.querySelector('.note-text');
  textarea.addEventListener('input', () => {
    saveNotes();
  });

  note.id = 'note-' + Date.now();
  saveNotes();
}

function saveNotes() {
  const notes = [];
  document.querySelectorAll('.note').forEach(noteEl => {
    notes.push({
      id: noteEl.id,
      text: noteEl.querySelector('.note-text').value,
      color: noteEl.style.backgroundColor
    });
  });
  localStorage.setItem('stickyNotes', JSON.stringify(notes));
}

function loadNotes() {
  const savedNotes = JSON.parse(localStorage.getItem('stickyNotes')) || [];
  savedNotes.forEach(noteData => {
    createNote();
    const note = document.getElementById(noteData.id);
    note.querySelector('.note-text').value = noteData.text;
    note.style.backgroundColor = noteData.color;
  });
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

addBtn.addEventListener('click', createNote);
themeToggle.addEventListener('click', toggleTheme);

window.addEventListener('load', () => {
  loadNotes();
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
  }
});

document.addEventListener('click', (e) => {
  if (!emojiPicker.contains(e.target) && !e.target.classList.contains('emoji-btn')) {
    emojiPicker.style.display = 'none';
  }
  if (!colorPicker.contains(e.target) && !e.target.classList.contains('color-btn')) {
    colorPicker.style.display = 'none';
  }
});

emojiPicker.addEventListener('click', (e) => {
  if (e.target.tagName === 'SPAN') {
    const targetNoteId = emojiPicker.dataset.targetNote;
    const targetNote = document.getElementById(targetNoteId);
    const textarea = targetNote.querySelector('.note-text');
    textarea.value += e.target.textContent;
    emojiPicker.style.display = 'none';
    saveNotes();
  }
});

colorPicker.addEventListener('click', (e) => {
  if (e.target.classList.contains('color-option')) {
    const targetNoteId = colorPicker.dataset.targetNote;
    const targetNote = document.getElementById(targetNoteId);
    targetNote.style.backgroundColor = e.target.style.backgroundColor;
    colorPicker.style.display = 'none';
    saveNotes();
  }
});