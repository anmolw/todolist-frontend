let taskElementMapping = {};

function textChanged(event) {
    // If the text input box is empty, hide the add task button
    let addButton = document.getElementById("add-button");
    if (event.currentTarget.value === "") {
        addButton.classList.add("hidden");
    }
    // If the text input box is no longer empty, show the add task button
    else {
        if (addButton.classList.contains("hidden")) {
            addButton.classList.remove("hidden");
        }
    }
}

function textBoxEnterListener(event) {
    // Create a new task when the enter key is pressed and the text box is not empty
    if (event.code === "Enter" && event.currentTarget.value !== "") {
        createTask(event.currentTarget.value);
        event.currentTarget.value = "";
        let addButton = document.getElementById("add-button");
        addButton.classList.add("hidden");
    }
}

function addButtonListener(event) {
    // Click event listener for the add task button
    let textInput = document.getElementById("task-input");
    if (textInput.value !== "") {
        createTask(textInput.value);
        textInput.value = "";
    }
}

function checkBoxListener(event, id, listEntry) {
    setTaskStatus(id, event.currentTarget.checked);
}

function setTaskStatus(taskId, status) {
    let taskContent = taskElementMapping[taskId].querySelector(".task-content");
    taskContent.classList.toggle("completed");
    TaskStorage.updateTaskStatus(taskId, status);
}

function completeAll() {
    for (let taskId of Object.keys(taskElementMapping)) {
        setTaskStatus(taskId, true);
    }
}

function clearCompleted() {
    for (let taskId of Object.keys(taskElementMapping)) {
        if (TaskStorage.getTask(taskId).completed === true) {
            deleteTask(taskId, taskElementMapping[taskId]);
        }
    }
    updateTaskCount();
}

function createTask(description) {
    // Create a new task and add a list item representing it to the DOM
    let taskList = document.getElementById("task-list");
    let taskId = TaskStorage.addTask(description);
    let taskObj = TaskStorage.getTask(taskId);
    let taskElement = createTaskElement(taskObj, taskId);
    taskElementMapping[taskId] = taskElement;
    taskList.appendChild(taskElement);
    updateTaskCount();
}

function deleteTask(id, taskElement) {
    let taskList = document.getElementById("task-list");
    taskList.removeChild(taskElement);
    TaskStorage.deleteTask(id);
    delete taskElementMapping[id];
    updateTaskCount();
}

function updateTaskCount(count) {
    let taskCountElem = document.getElementById("task-count");
    let taskCount = Object.keys(taskElementMapping).length;
    let countString = (taskCount > 0) ? taskCount : "No";
    let taskWordForm = (taskCount > 1 || taskCount === 0) ? "tasks" : "task";
    taskCountElem.textContent = `${countString} ${taskWordForm} left`;
}

// Function that creates the DOM representation for a task and returns the top-level element
function createTaskElement(task, id) {
    let listEntry = document.createElement("li");
    let checkBox = document.createElement("input");
    let taskContent = document.createElement("span");
    let completeButton = document.getElementById("complete-all");
    let clearCompletedButton = document.getElementById("clear-completed");
    // Set the state of the checkbox to checked if the task is marked as completed
    checkBox.setAttribute("type", "checkbox");
    if (task.completed === true) {
        listEntry.classList.add("completed");
        checkBox.checked = true;
    }
    taskContent.classList.add("task-content");
    taskContent.textContent = task.description;
    // Set the event listeners of the complete all/clear completed buttons
    completeButton.addEventListener("click", completeAll);
    clearCompletedButton.addEventListener("click", clearCompleted);
    // Set the checkbox's event listener
    checkBox.addEventListener("change", (event) => checkBoxListener(event, id, listEntry));
    let deleteButton = document.createElement("i");
    deleteButton.setAttribute("class", "delete-button align-right clickable fa-regular fa-circle-xmark");
    // Set the delete button's event listener
    deleteButton.addEventListener("click", () => deleteTask(id, listEntry));
    listEntry.appendChild(checkBox);
    listEntry.append(taskContent);
    listEntry.appendChild(deleteButton);
    return listEntry;
}

document.addEventListener("DOMContentLoaded", () => {
    // Load tasks stored in the browser's local storage, if any
    let tasksObj = TaskStorage.loadTasks();
    // Loop through the keys of the tasks object and add the tasks to the DOM
    let taskList = document.getElementById("task-list");
    for (let taskId of Object.keys(tasksObj)) {
        let taskElement = createTaskElement(tasksObj[taskId], taskId);
        taskElementMapping[taskId] = taskElement;
        taskList.appendChild(taskElement);
    }
    let textInput = document.getElementById("task-input");
    // Attach event listeners to the task input text box
    textInput.addEventListener('input', textChanged);
    textInput.addEventListener('keydown', textBoxEnterListener);
    // Add an event listener to the add task button
    let addButton = document.getElementById("add-button");
    addButton.addEventListener("click", addButtonListener);
    updateTaskCount();
});