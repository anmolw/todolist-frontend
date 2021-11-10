// Object that contains functionality related to storing and retrieving tasks from local storage
const TaskStorage = {
    // Load the tasks string from local storage and parse as a JSON object
    loadTasks: function () {
        if (localStorage.getItem("tasks")) {
            return JSON.parse(localStorage.getItem("tasks"));
        }
        // Return an empty object if the "tasks" key does not exist or is empty
        return {};
    },
    // Save a given task object to the "tasks" key after converting it to a JSON string
    saveTasks: function (tasksObj) {
        localStorage.setItem("tasks", JSON.stringify(tasksObj));
    },
    // Get the id of the last task added to the task list. Return -1 if not set
    getLastTaskId: function () {
        if (localStorage.getItem("lastTaskId")) {
            return parseInt(localStorage.getItem("lastTaskId"));
        }
        return -1;
    },
    // Add and save a new task
    addTask: function (description) {
        let taskId = this.getLastTaskId() + 1;
        let tasksObj = this.loadTasks();

        localStorage.setItem("lastTaskId", taskId);
        tasksObj[taskId] = {};
        tasksObj[taskId]["description"] = description;
        tasksObj[taskId]["completed"] = false;
        this.saveTasks(tasksObj);
        // Return the id of the created task
        return taskId;
    },
    // Retrieve a task from LocalStorage using its id
    getTask: function (id) {
        let tasksObj = this.loadTasks();
        return tasksObj[id];
    },
    // Delete a task using its id
    deleteTask: function (id) {
        let tasksObj = this.loadTasks();
        delete tasksObj[id];
        this.saveTasks(tasksObj);
        // Remove the id of the last task added if the task list is now empty
        if (Object.keys(tasksObj).length === 0) {
            localStorage.removeItem("lastTaskId");
        }
    },
    // Updated the completion status of a task given its id
    updateTaskStatus: function (id, status) {
        let tasksObj = this.loadTasks();
        if (!tasksObj[id]) {
            console.log(`Task with id: ${id} does not exist`);
            return;
        }
        tasksObj[id]["completed"] = status;
        this.saveTasks(tasksObj);
    }
};
// Makes the TaskStorage object immutable
Object.freeze(TaskStorage);

