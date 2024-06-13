var right = document.querySelector('.right');
var createNote = document.querySelector('.createNote');
var noteList = document.querySelector('.noteList');
var addingNoteDiv = document.querySelector('.addingnote');
var noteTitle = document.querySelector('.note_title');
var noteContent = document.querySelector('.note_content');
var addNote = document.querySelector('.addNote');

createNote.addEventListener('click', function () {
    document.querySelector('.nofile').style.zIndex = '-1'
    addingNoteDiv.style.display = 'block';
    if (addingNoteDiv.style.display == 'none') {
        createNote.disabled = true;
    }
});

addNote.addEventListener('click', function () {
    document.querySelector('.nofile').style.zIndex = '-1'
    var UniqueID = 'note' + Math.floor(Math.random() * 1000);
    if(noteTitle.value === ''){
        alert('Title cannot be empty')
        return
    }
    if(noteContent.value === ''){
        alert('Content cannot be empty')
        return
    }
    var note = {
        title: noteTitle.value,
        content: noteContent.value,
        UniqueID: UniqueID,
        noteTask: []
    };

    renderNoteInList(note);
    noteTitle.value = '';
    noteContent.value = '';
    createNote.disabled = false;

    addNoteToLocalStorage(note);
});

function renderNoteInList(note) {
    var noteDiv = document.createElement('div');
    noteDiv.classList.add('note', note.UniqueID);

    var title = document.createElement('h2');
    title.className = 'title';
    title.textContent = note.title;

    var content = document.createElement('p');
    content.className = 'content';
    content.textContent = String(note.content).split(' ')[0] + "  ...";

    noteDiv.append(title, content);
    noteList.appendChild(noteDiv);
    addingNoteDiv.style.display = 'none';

    noteDiv.addEventListener('click', () => {
        openNote(note);
    });
}

function openNote(note) {
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

    if (note.noteTask.length > 0) {
        renderTasks(note);
    }

    deleteNoteButton.addEventListener('click', () => {
        right.querySelector('.opened_note').remove();
        document.querySelector('.' + note.UniqueID).remove();
        deleteNoteInStorage(note);
        renderNoFile();
    });

    addTaskButton.addEventListener('click', () => {
        document.querySelector('.addingTask').style.zIndex = '2';

        document.querySelector('.taskbtn').addEventListener('click', ()=>
            {
                addTask(note)
            })
    });

    
}

function renderTasks(note) {
    var tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks';

    let h2 = document.createElement('h2');
    h2.textContent = 'Task List';
    tasksContainer.appendChild(h2);

    note.noteTask.forEach(task => {
        var taskContainer = document.createElement('div');
        taskContainer.className = 'task';

        var radio = document.createElement('input');
        radio.className = 'radio';
        radio.type = 'radio';
        radio.checked = task.taskStatus;
        radio.value = task.taskName;

        var label = document.createElement('label');
        label.textContent = task.taskName 
        label.className = 'label';

        
        // taskContainer.append(label);
        var tick = document.createElement('img')
        tick.src = './assets/tick.svg'

        if(task.taskStatus === true)
            {
                taskContainer.append(label)
                taskContainer.appendChild(tick)
                radio.remove()
            }

            else{
                taskContainer.append(radio)
                taskContainer.append(label)
            }


        tasksContainer.append(taskContainer);

        radio.addEventListener('click', () => {
            task.taskStatus = true;
            label.textContent = task.taskName ;
            radio.remove();
            // label.remove();
            var tick = document.createElement('img')
            tick.src = './assets/tick.svg'
            // taskContainer.appendChild(label)
            taskContainer.appendChild(tick)
        updateNoteInLocalStorage(note);
        });
    });

    document.querySelector('.opened_note').appendChild(tasksContainer);
}

function addTask(note) {
    var taskName = document.querySelector('.add_task_title').value 

    if(taskName === ''){
        console.log("Task name cannot be empty")
        return
    }
    var task = {
        taskName: taskName,
        taskStatus: false
    }
    
    note.noteTask.push(task)
    updateNoteInLocalStorage(note);

    var tasksContainer = document.querySelector('.tasks');
    if (!tasksContainer) {
        tasksContainer = document.createElement('div');
        tasksContainer.className = 'tasks';

        var h2 = document.createElement('h2');
        h2.textContent = "Tasks List";
        tasksContainer.appendChild(h2);

        document.querySelector('.opened_note').appendChild(tasksContainer);
    }

    var taskContainer = document.createElement('div');
    taskContainer.className = 'task';

    var radio = document.createElement('input');
    radio.className = 'radio';
    radio.type = 'radio';

    var label = document.createElement('label');
    label.textContent = task.taskName;
    label.className = 'label';

    taskContainer.append(radio, label);
    tasksContainer.append(taskContainer);

    document.querySelector('.add_task_title').value = '';
    document.querySelector('.addingTask').style.zIndex = '-2'

    radio.addEventListener('click', () => {
        task.taskStatus = true;
        label.textContent = task.taskName ;
        radio.remove();
        // label.remove();
        var tick = document.createElement('img')
        tick.src = './assets/tick.svg'
        // taskContainer.appendChild(label)
            taskContainer.appendChild(tick)
        updateNoteInLocalStorage(note);
    });
}

function addNoteToLocalStorage(note) {
    var localNotes = localStorage.getItem('localNotes');
    var notesArray = localNotes ? JSON.parse(localNotes) : [];
    notesArray.push(note);
    localStorage.setItem('localNotes', JSON.stringify(notesArray));
}

function deleteNoteInStorage(note) {
    var localNotes = JSON.parse(localStorage.getItem('localNotes'));
    var updatedNotes = localNotes.filter(n => n.UniqueID !== note.UniqueID);
    localStorage.setItem('localNotes', JSON.stringify(updatedNotes));
}

function updateNoteInLocalStorage(note) {
    var localNotes = JSON.parse(localStorage.getItem('localNotes'));
    var noteIndex = localNotes.findIndex(n => n.UniqueID === note.UniqueID);
    if (noteIndex !== -1) {
        localNotes[noteIndex] = note;
        localStorage.setItem('localNotes', JSON.stringify(localNotes));
    }
}

function showAllNotes() {
    if (localStorage.getItem('localNotes')) {
        JSON.parse(localStorage.getItem('localNotes')).forEach(note => {
            renderNoteInList(note);
        });
    } else {
        console.log('localStorage does not exist');
    }
}

showAllNotes();

function renderNoFile(){
    var no_files = document.createElement('i')
    if(JSON.parse(localStorage.getItem('localNotes')).length <= 0){
        document.querySelector('.nofile').style.zIndex = '1'
    }
    else{
        document.querySelector('.nofile').style.zIndex = '-1'
    }
}

renderNoFile();
