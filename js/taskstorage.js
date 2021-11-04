// Object that contains functionality related to storing and retrieving tasks from local storage
var TaskStorage = {
    // Load the tasks string from local storage and parse as a JSON object
    loadTasks: function () {
        if (localStorage.getItem("tasks")) {
            return JSON.parse(localStorage.getItem("tasks"));
        }
        return {};
    },
    // Save a given task object to the "tasks" key after converting it to a JSON string
    saveTasks: function (tasksObj) {
        localStorage.setItem("tasks", JSON.stringify(tasksObj));
    },
    getLastTaskId: function () {
        if (localStorage.getItem("lastTaskId")) {
            return parseInt(localStorage.getItem("lastTaskId"));
        }
        return -1;
    },
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
    getTask: function (id) {
        let tasksObj = this.loadTasks();
        return tasksObj[id];
    },
    deleteTask: function (id) {
        let tasksObj = this.loadTasks();
        delete tasksObj[id];
        this.saveTasks(tasksObj);
        if (Object.keys(tasksObj).length === 0) {
            localStorage.removeItem("lastTaskId");
        }
    },
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

