const wrongChars = ["<", ">"];
let todos = [];
let index = 0;

const input = document.querySelector('.addtask input');
const addIcon = document.querySelector('.addtask i');

class Todo {
    constructor(value) {
        this.value = value;
        this.completed = false;
    }
    checkIfAllowed() {
        if (this.value.includes(wrongChars[0]) || this.value.includes(wrongChars[1])) {
            return false;
        }
        else return true;
    }
}

class Ui {
    clearField() {
        input.value = '';
    }
    markAsDone(target) {
        if (target.tagName === 'LI') {
            target.classList.toggle('done');
            if (target.classList.contains('done')) {
                tasks[target.firstElementChild.id].completed = true;
            } else tasks[target.firstElementChild.id].completed = false;
        }
    }
}

class Storage {
    static save(todos) {
        const jsonTodos = JSON.stringify(todos);
        localStorage.setItem('todos', jsonTodos);
    }
    static get() {
        const jsonTasks = localStorage.getItem('todos');
        todos = JSON.parse(jsonTasks);
        if (!todos) {
            todos = [];
        }
        return todos;
    }
}

class List {
    constructor() {
        this.list = document.querySelector('.tasks ul');
        this.listElement = document.createElement('li');
    }

    addTodoToList(todo) {
        todos.push(todo);
        this.listElement.innerHTML = `${todo.value} <i class="fas fa-minus" id="${index++}">`;
        this.list.appendChild(this.listElement);
        Storage.save(todos);
    }
    deleteTodoFromList(target) {
        if (target.className === 'fas fa-minus') {
            todos.splice(target.id, 1)
            target.parentNode.remove();
            this.refreshList();
            Storage.save(todos);
        }
    }
    refreshList() {
        const list = document.querySelector('.tasks ul');
        index = 0;
        list.textContent = "";
        todos.forEach((todo) => {
            const listElement = document.createElement('li');
            listElement.innerHTML = `${todo.value} <i class="fas fa-minus" id="${index++}">`
            if (todo.completed) {
                listElement.classList.add('done')
            }
            list.appendChild(listElement);
        })
    }
    checkIfExistsOnList(todo) {
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].value.toLowerCase() === todo.value.toLowerCase()) {
                return true;
            }
        }
    }
}

class Alert {
    constructor() {
        this.exists = false;
        this.parentElement = document.querySelector('.content');
        this.container = document.createElement('div');
    }
    show(message) {
        if (this.exists) {
            return;
        }
        this.exists = true;
        this.container.classList.add('error');
        this.container.textContent = message;
        this.parentElement.appendChild(this.container);
    }
    delete() {
        this.exists = false;
        this.parentElement.lastChild.remove();
    }
}

const displayTime = () => {
    const now = new Date();
    let day = now.getDate();
    let month = (now.getMonth() + 1);
    let year = now.getFullYear();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month

    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds

    const timeDisplay = document.querySelector('.topbar');

    timeDisplay.textContent = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    setTimeout(displayTime, 1000)
}

const list = new List();
const storage = new Storage();
const ui = new Ui();
const alert = new Alert();

//Wyrenderowanie todo po odświezeniu strony z local storage
Storage.get();
console.log(todos);
list.refreshList();
ui.clearField();
displayTime();

//Dodawanie todo click
addIcon.addEventListener('click', function () {
    const inputValue = input.value;
    const list = new List();
    const todo = new Todo(inputValue);
    if ("" === todo.value) {
        alert.show('Musisz coś wpisać!');
        return setTimeout(() => { alert.delete() }, 2000);
    }
    else if (list.checkIfExistsOnList(todo)) {
        alert.show('Posiadasz już to zadanie!');
        return setTimeout(() => { alert.delete() }, 2000);
    }
    else if (!todo.checkIfAllowed()) {
        alert.show('Nieprawidłowa wartość!');
        return setTimeout(() => { alert.delete() }, 2000);
    }
    list.addTodoToList(todo);
    Storage.save(todos);
    ui.clearField();
})

//Dodawanie todo enter
document.body.addEventListener('keydown', function (e) {
    if (13 === e.keyCode) {
        if (document.activeElement === input) {
            const inputValue = input.value;
            const list = new List();
            const todo = new Todo(inputValue);
            if ("" === todo.value) {
                alert.show('Musisz coś wpisać!');
                return setTimeout(() => { alert.delete() }, 2000);
            }
            else if (list.checkIfExistsOnList(todo)) {
                alert.show('Posiadasz już to zadanie!');
                return setTimeout(() => { alert.delete() }, 2000);
            }
            else if (!todo.checkIfAllowed()) {
                alert.show('Nieprawidłowa wartość!');
                return setTimeout(() => { alert.delete() }, 2000);
            }
            list.addTodoToList(todo);
            Storage.save(todos);
            ui.clearField();
        }
    }
})

//Usuwanie todo
document.addEventListener('click', function (e) {
    if ("I" === e.target.tagName) {
        const list = new List();
        list.deleteTodoFromList(e.target);
        Storage.save(todos);
    }
})

//Oznaczenie jako zrobione
document.addEventListener('click', function (e) {
    if ('LI' === e.target.tagName) {
        e.target.classList.toggle('done');
        if (e.target.classList.contains('done')) {
            todos[e.target.firstElementChild.id].completed = true;
        }
        else todos[e.target.firstElementChild].id = false;
        Storage.save(todos);
    }
})