var right = document.querySelector('.right');
var createNote = document.querySelector('.createNote');
var noteList = document.querySelector('.noteList');
var addingNoteDiv = document.querySelector('.addingnote');
var noteTitle = document.querySelector('.note_title');
var noteContent = document.querySelector('.note_content');
var addNote = document.querySelector('.addNote');
var currentNote = null; // Global variable to store the current note

// Show all notes using local storage
function showAllNotes() {
    if (localStorage.getItem('localNotes')) {
        JSON.parse(localStorage.getItem('localNotes')).forEach(note => {
            renderNoteInList(note);
        });
        console.log('Local storage exists');
    } else {
        console.log('Local storage does not exist');
    }
}

// Delete note from local storage
function deleteNoteInStorage(note) {
    var local = JSON.parse(localStorage.getItem('localNotes'));
    var res = local.filter(prod => prod.UniqueID !== note.UniqueID);
    localStorage.setItem('localNotes', JSON.stringify(res));
}

// Add to local storage
function addNoteLocalStorage(note) {
    if (localStorage.getItem('localNotes')) {
        var local = JSON.parse(localStorage.getItem('localNotes'));
        local.push(note);
        localStorage.setItem('localNotes', JSON.stringify(local));
    } else {
        var storage = [note];
        localStorage.setItem('localNotes', JSON.stringify(storage));
    }
}

// Update local storage
function updateNoteLocalStorage(note) {
    if (localStorage.getItem('localNotes')) {
        var local = JSON.parse(localStorage.getItem('localNotes'));
        var noteIndex = local.findIndex(n => n.UniqueID === note.UniqueID);
        if (noteIndex !== -1) {
            local[noteIndex] = note;
            localStorage.setItem('localNotes', JSON.stringify(local));
        }
    }
}

// First functionality creating note
createNote.addEventListener('click', function () {
    addingNoteDiv.style.display = 'block';
    if (addingNoteDiv.style.display == 'none') {
      createNote.disabled = true;
  } else {
      createNote.disabled = false;
  }
});

// Adding note popup display btn function
addNote.addEventListener('click', function () {
    var UniqueID = 'note' + Math.floor(Math.random() * 1000);
    var note = {
        title: noteTitle.value,
        content: noteContent.value,
        UniqueID: UniqueID,
        noteTask: []
    };

    renderNoteInList(note);
    addNoteLocalStorage(note);
    noteTitle.value = '';
    noteContent.value = '';
});

// Rendering notes in the list
function renderNoteInList(note) {
    // console.log(note.title, note.content);
    var noteDiv = document.createElement('div');
    noteDiv.classList.add('note', note.UniqueID);

    var title = document.createElement('h3');
    title.className = 'title';
    title.textContent = note.title;

    var content = document.createElement('p');
    content.className = 'content';
    content.textContent = note.content;

    noteDiv.append(title, content);
    noteList.appendChild(noteDiv);
    addingNoteDiv.style.display = 'none';

    noteDiv.addEventListener('click', () => {
        openNote(note);
    });
}

// Opening note function
function openNote(note) {
    currentNote = note;

    if (right.querySelector('.opened_note')) {
        right.querySelector('.opened_note').remove();
    }

    var openedNoteDiv = document.createElement('div');
    openedNoteDiv.className = 'opened_note';

    var topDiv = document.createElement('div');
    topDiv.className = 'top';

    var h1 = document.createElement('h1');
    h1.textContent = note.title;
    topDiv.appendChild(h1);

    var buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';

    var addTaskButton = document.createElement('button');
    addTaskButton.className = 'addTask';
    addTaskButton.textContent = 'Add Task';
    buttonsDiv.appendChild(addTaskButton);

    var deleteNoteButton = document.createElement('button');
    deleteNoteButton.className = 'deleteNote';
    deleteNoteButton.textContent = 'Delete Note';
    buttonsDiv.appendChild(deleteNoteButton);

    topDiv.appendChild(buttonsDiv);
    openedNoteDiv.appendChild(topDiv);

    var hr = document.createElement('hr');
    openedNoteDiv.appendChild(hr);

    var p = document.createElement('p');
    p.textContent = note.content;
    openedNoteDiv.appendChild(p);

    right.appendChild(openedNoteDiv);

    // Render tasks
    if (note.noteTask && note.noteTask.length > 0) {
        renderTasks(note.noteTask);
    }

    deleteNoteButton.addEventListener('click', () => {
        right.querySelector('.opened_note').remove();
        document.querySelector('.' + note.UniqueID).remove();
        deleteNoteInStorage(note);
    });

    addTaskButton.addEventListener('click', () => {
        document.querySelector('.addingTask').style.display = 'block';
    });
}

// Render tasks
function renderTasks(tasks) {
    var tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks';

    let h2 = document.createElement('h2');
    h2.textContent = 'Task List';
    tasksContainer.appendChild(h2);

    tasks.forEach(task => {
        var taskContainer = document.createElement('div');
        taskContainer.className = 'task';

        var radio = document.createElement('input');
        radio.className = 'radio';
        radio.type = 'radio';
        radio.checked = task.taskStatus;
        radio.value = task.taskName;

        var label = document.createElement('label');
        label.textContent = task.taskName + (task.taskStatus ? ' (Completed)' : '');
        label.className = 'label';

        taskContainer.append(radio, label);
        tasksContainer.append(taskContainer);

        radio.addEventListener('click', () => {
            task.taskStatus = true;
            label.textContent = task.taskName + ' (Completed)';
            tasksContainer.appendChild(taskContainer);
            updateNoteLocalStorage(currentNote);
        });
    });

    document.querySelector('.opened_note').appendChild(tasksContainer);
}

// Task event handler
function taskEventHandler() {
    if (!currentNote) return;

    var task = {
        taskName: document.querySelector('.add_task_title').value,
        taskStatus: false
    };

    currentNote.noteTask.push(task);
    updateNoteLocalStorage(currentNote);

    var tasksContainer = document.querySelector('.tasks');
    if (!tasksContainer) {
        tasksContainer = document.createElement('div');
        tasksContainer.className = 'tasks';

        let h2 = document.createElement('h2');
        h2.textContent = 'Task List';
        tasksContainer.appendChild(h2);

        document.querySelector('.opened_note').appendChild(tasksContainer);
    }

    var taskContainer = document.createElement('div');
    taskContainer.className = 'task';

    var radio = document.createElement('input');
    radio.className = 'radio';
    radio.type = 'radio';
    radio.value = task.taskName;

    var label = document.createElement('label');
    label.textContent = task.taskName;
    label.className = 'label';

    taskContainer.append(radio, label);
    tasksContainer.append(taskContainer);

    document.querySelector('.add_task_title').value = '';
    document.querySelector('.addingTask').style.display = 'none';

    console.log('Clicked add task button');

    radio.addEventListener('click', () => {
        task.taskStatus = true;
        label.textContent = task.taskName + ' (Completed)';
        tasksContainer.appendChild(taskContainer);
        updateNoteLocalStorage(currentNote);
    });
}

var taskbtn = document.querySelector('.taskbtn');
taskbtn.addEventListener('click', taskEventHandler);

// Show all notes on page load
showAllNotes();
