let tasks = [];
let index = -1;

class Todo {
    constructor(value) {
        this.value = value;
        this.completed = false;
    }
}

class Ui {
    showAlert(message) {
        const error = document.createElement('div');
        error.textContent = message;
        error.classList.add('error');
        document.querySelector('.content').appendChild(error);
    }
    clearAlert() {
        setTimeout(function () {
            document.querySelector('.error').remove();
        }, 2000)
    }
    addTodoToList(todo) {
        index++;
        const list = document.querySelector('.tasks ul');
        const element = document.createElement('li');
        element.innerHTML = `${todo.value} <i class="fas fa-minus" id="${index}">`
        list.appendChild(element);
    }
    clearField() {
        document.querySelector('.addtask input').value = '';
    }
    deleteTodo(target) {
        if (target.className === 'fas fa-minus') {
            tasks.splice(target.id, 1)
            target.parentNode.remove();
            Render.clearList();
            Render.renderList(tasks)
        }
    }
    markAsDone(target) {
        if (target.tagName === 'LI') {
            target.classList.toggle('done');
            if (target.classList.contains('done')) {
                tasks[target.firstElementChild.id].completed = true;
            } else tasks[target.firstElementChild.id].completed = false;
        }
    }
    saveToLocalStorage() {
        const jsonTasks = JSON.stringify(tasks);
        localStorage.setItem('tasks', jsonTasks);
    }
    checkIfIncludes(todo) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].value.toLowerCase() === todo.value.toLowerCase()) {
                return true;
            }
        }
    }
}

class Render {
    static getFromLocalStorage() {
        const jsonTasks = localStorage.getItem('tasks');
        tasks = JSON.parse(jsonTasks);
        if (!tasks) {
            tasks = [];
        }
    }
    static renderList(list) {
        index = -1;
        list.forEach(element => {
            index++;
            const li = document.createElement('li');
            li.innerHTML = `${element.value} <i class="fas fa-minus" id="${index}">`;
            if (element.completed) {
                li.classList.add('done');
            }
            document.querySelector('.tasks ul').appendChild(li);
        });
    }
    static clearList() {
        document.querySelector(`.tasks ul`).textContent = "";
    }
}

const addIcon = document.querySelector('.addtask i');

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

const addTodo = function () {
    const inputValue = document.querySelector('.addtask input').value
    const ui = new Ui();
    if (inputValue === "" || typeof inputValue === "number") {
        ui.showAlert(`Nieprawidłowa wartość!`)
        return ui.clearAlert();
    }
    const todo = new Todo(inputValue);
    if (ui.checkIfIncludes(todo)) {
        ui.clearField();
        ui.showAlert(`Posiadasz już to zadanie!`);
        return ui.clearAlert();
    }
    tasks.push(todo);
    ui.addTodoToList(todo);
    ui.saveToLocalStorage();
    ui.clearField();
}

addIcon.addEventListener('click', addTodo);

document.querySelector('.addtask input').addEventListener('focus', function () {
    document.addEventListener('keypress', function (e) {
        if (e.keyCode === 13) {
            addTodo();
        }
    })
})



document.querySelector('.tasks').addEventListener('click', function (e) {
    const ui = new Ui();
    ui.deleteTodo(e.target);
    ui.saveToLocalStorage();
})

document.querySelector('.tasks').addEventListener('click', function (e) {
    const ui = new Ui();
    ui.markAsDone(e.target);
    ui.saveToLocalStorage();
})

Render.getFromLocalStorage();
Render.renderList(tasks);
displayTime();