document.addEventListener('DOMContentLoaded', () => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    const container = document.getElementById("notes-container");
    notes.forEach(note => {
        createNoteElement(note, container);
    });

    updateOnlineStatus();
});

const addNoteBtn = document.getElementById("add-note-button");
const saveNoteBtn = document.getElementById("save-note-button");
const addNoteWindow = document.getElementById("add-note-window");
const viewNoteWindow = document.getElementById("view-note-window");
const editNoteWindow = document.getElementById("edit-note-window");
const editNoteBtn = document.getElementById("edit-note-button");

const showModalWindow = () => {
    addNoteWindow.classList.remove("hidden");
};

const hideModalWindow = () => {
    addNoteWindow.classList.add("hidden");
};

const showEditModalWindow = () => {
    editNoteWindow.classList.remove("hidden");
};

const hideEditModalWindow = () => {
    editNoteWindow.classList.add("hidden");
};

const openViewNoteModal = (header, content) => {
    const viewNoteTitle = document.getElementById("view-note-title");
    const viewNoteContent = document.getElementById("view-note-content");

    viewNoteTitle.textContent = header;
    viewNoteContent.textContent = content;
    viewNoteWindow.classList.remove("hidden");
};

addNoteWindow.addEventListener("click", (e) => {
    if (e.target === addNoteWindow) {
        hideModalWindow();
    }
});

editNoteWindow.addEventListener("click", (e) => {
    if (e.target === editNoteWindow) {
        hideEditModalWindow();
    }
});

const hideViewModalWindow = () => {
    viewNoteWindow.classList.add("hidden");
}

viewNoteWindow.addEventListener("click", (e) => {
    if (e.target === viewNoteWindow) {
        hideViewModalWindow();
    }
});

addNoteBtn.addEventListener("click", showModalWindow);

document.getElementById("save-note-button").addEventListener("click", function() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (!title && !content) {
        alert("Заголовок и содержание не могут быть пустыми!");
        return;
    }

    const note = {
        id: Date.now(),
        title: title || "",
        content: content || ""
    };

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.push(note);

    localStorage.setItem("notes", JSON.stringify(notes)); //localStorage хранит только строки

    alert("Заметка сохранена!");
    
    showNewNote(note);

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    hideModalWindow();
});

function showNewNote(note) {
    const container = document.getElementById("notes-container");
    createNoteElement(note, container);
}

function createNoteElement(note, container) {
    const noteItem = document.createElement("div");
    noteItem.classList.add("note");
    noteItem.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <div class="icon-container">
            <img src="assets/delete-icon.png" alt="Корзина" class="icon" data-id="${note.id}">
            <img src="assets/edit-icon.png" alt="Редактировать" class="icon" data-id="${note.id}">
        </div>
    `;
    container.appendChild(noteItem);

    noteItem.addEventListener("click", () => {
        openViewNoteModal(note.title, note.content);
    });

    const editIcon = noteItem.querySelector('.icon[alt="Редактировать"]');
    editIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        openEditNoteModal(note);
    });

    const deleteIcon = noteItem.querySelector('.icon[alt="Корзина"]');
    deleteIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteNote(note.id);
    });
}

function deleteNote(id) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(notes));
    document.getElementById("notes-container").innerHTML = '';
    notes.forEach(note => createNoteElement(note, document.getElementById("notes-container")));
}

function openEditNoteModal(note) {
    const titleInput = document.getElementById("edit-title");
    const contentTextarea = document.getElementById("edit-content");

    titleInput.value = note.title;
    contentTextarea.value = note.content;

    editNoteWindow.dataset.noteId = note.id;

    showEditModalWindow();
}

document.getElementById("edit-note-button").addEventListener("click", function() {
    const title = document.getElementById("edit-title").value;
    const content = document.getElementById("edit-content").value;

    const noteId = editNoteWindow.dataset.noteId;

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    const noteIndex = notes.findIndex(note => note.id == noteId);

    if (noteIndex !== -1) {
        notes[noteIndex].title = title || "";
        notes[noteIndex].content = content || "";
    }

    localStorage.setItem("notes", JSON.stringify(notes));

    alert("Заметка обновлена!");

    document.getElementById("edit-title").value = "";
    document.getElementById("edit-content").value = "";

    hideEditModalWindow();
    refreshNotesDisplay();
});

function refreshNotesDisplay() {
    const container = document.getElementById("notes-container");
    container.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.forEach(note => createNoteElement(note, container));
}

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('ServiceWorker зарегистрирован:', registration.scope);
        } catch (err) {
            console.error('Ошибка регистрации:', err);
        }
    });
}

function updateOnlineStatus() {
    const offlineMessage = document.getElementById("offline-message");
    if (navigator.onLine) {
        offlineMessage.classList.add("hidden");
    } else {
        offlineMessage.classList.remove("hidden");
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);