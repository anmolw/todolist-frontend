// Declare core UI elements as global constants
const addButton = document.getElementById("add-button");
const textInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const completeButton = document.getElementById("complete-all");
const clearCompletedButton = document.getElementById("clear-completed");

// Object that stores references to task list elements keyed by task IDs
let taskElementMapping = {};

function textChanged(event) {
    // If the text input box is empty, hide the add task button
    if (textInput.value === "") {
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
    if (event.code === "Enter" && textInput.value !== "") {
        createTask(textInput.value);
        textInput.value = "";
        addButton.classList.add("hidden");
    }
}

function addButtonListener(event) {
    // Click event listener for the add task button
    if (textInput.value !== "") {
        createTask(textInput.value);
        textInput.value = "";
    }
}

function checkBoxListener(event, id, listEntry) {
    // Listener for task checkbox click events. Sets the task's completion status
    // according to the state of the checkbox
    setTaskStatus(id, event.currentTarget.checked);
}

function setTaskStatus(taskId, status) {
    // Update the status of a task
    let taskContent = taskElementMapping[taskId].querySelector(".task-content");
    let checkBox = taskElementMapping[taskId].querySelector("input[type='checkbox']");
    if (status === true) {
        taskContent.classList.add("completed");
    }
    else if (taskContent.classList.contains("completed")) {
        taskContent.classList.remove("completed");
    }
    checkBox.checked = status;
    TaskStorage.updateTaskStatus(taskId, status);
    updateTaskCount();
}

// Mark all tasks as completed
function completeAll() {
    for (let taskId of Object.keys(taskElementMapping)) {
        setTaskStatus(taskId, true);
    }
}

// Clear all completed tasks
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
    let taskId = TaskStorage.addTask(description);
    let taskObj = TaskStorage.getTask(taskId);
    let taskElement = createTaskElement(taskObj, taskId);
    taskElementMapping[taskId] = taskElement;
    taskList.appendChild(taskElement);
    setTimeout(() => taskElement.classList.add("show"), 0);
    updateTaskCount();
}

function deleteTask(id, taskElement) {
    // Locate the DOM element representing the given task and delete it
    setTimeout(() => taskList.removeChild(taskElement), 650);
    taskElement.classList.remove("show");
    // Also delete its local storage entry
    TaskStorage.deleteTask(id);
    delete taskElementMapping[id];
    updateTaskCount();
}

function updateTaskCount(count) {
    // Update the count element with the current task count
    let taskCountElem = document.getElementById("task-count");
    // Loops through the keys of the taskElementMapping object and returns the number of incomplete tasks
    let taskCount = Object.keys(taskElementMapping).filter((value) => !TaskStorage.getTask(value).completed).length;
    let countString = (taskCount > 0) ? taskCount : "No";
    let taskWordForm = (taskCount > 1 || taskCount === 0) ? "tasks" : "task";
    taskCountElem.textContent = `${countString} ${taskWordForm} left`;
}

// Function that creates the DOM representation for a task and returns the top-level element
function createTaskElement(task, id) {
    let listEntry = document.createElement("li");
    let checkBox = document.createElement("input");
    let taskContent = document.createElement("span");

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

function init() {
    // Load tasks stored in the browser's local storage, if any
    let tasksObj = TaskStorage.loadTasks();
    // Loop through the keys of the tasks object and add the tasks to the DOM
    for (let taskId of Object.keys(tasksObj)) {
        let taskElement = createTaskElement(tasksObj[taskId], taskId);
        taskElementMapping[taskId] = taskElement;
        taskList.appendChild(taskElement);
        taskElement.classList.add("show");
    }
    let textInput = document.getElementById("task-input");
    // Attach event listeners to the task input text box
    textInput.addEventListener('input', textChanged);
    textInput.addEventListener('keyup', textBoxEnterListener);
    // Add an event listener to the add task button
    addButton.addEventListener("click", addButtonListener);
    updateTaskCount();
}

// Call the init function
init();