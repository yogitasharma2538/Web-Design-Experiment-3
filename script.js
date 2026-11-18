const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const addButton = document.getElementById("addButton");
const searchInput = document.getElementById("searchInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");
const clearButton = document.getElementById("clearButton");
const filterButtons = document.querySelectorAll(".filter-btn");

// Store tasks temporarily
let tasks = [];
let currentFilter = "all";
let nextId = 1;

// Display tasks on the page
function displayTasks() {
    taskList.innerHTML = "";

    const searchValue = searchInput.value.toLowerCase().trim();

    // Filter tasks according to search and selected filter
    const filteredTasks = tasks.filter(function (task) {
        const matchesSearch = task.text.toLowerCase().includes(searchValue);

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });

    // Display each matching task
    filteredTasks.forEach(function (task) {
        const li = document.createElement("li");

        // Task text
        const taskText = document.createElement("button");
        taskText.type = "button";
        taskText.textContent = task.text;
        taskText.className = "task-text";

        if (task.completed) {
            taskText.classList.add("completed");
        }

        // Mark task as completed or pending
        taskText.addEventListener("click", function () {
            task.completed = !task.completed;
            displayTasks();
        });

        // Priority label
        const priorityLabel = document.createElement("span");
        priorityLabel.textContent = task.priority;
        priorityLabel.className =
            "priority " + task.priority.toLowerCase();

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";

        editButton.addEventListener("click", function () {
            editTask(task.id);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            displayTasks();
        });

        li.appendChild(taskText);
        li.appendChild(priorityLabel);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    // Update task count
    taskCount.textContent = tasks.length + " tasks";

    // Update empty message
    if (filteredTasks.length === 0) {
        if (tasks.length === 0) {
            emptyMessage.textContent =
                "No tasks yet. Add one to get started!";
        } else {
            emptyMessage.textContent =
                "No matching tasks found.";
        }

        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    // Update clear completed button
    const completedCount = tasks.filter(function (task) {
        return task.completed;
    }).length;

    clearButton.textContent =
        "Clear Completed (" + completedCount + ")";
}

// Add a new task
function addTask() {
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: nextId++,
        text: taskValue,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";
    priorityInput.value = "Medium";

    displayTasks();
}

// Edit an existing task
function editTask(id) {
    const task = tasks.find(function (item) {
        return item.id === id;
    });

    if (!task) return;

    const li = Array.from(taskList.children).find(function (item) {
        return item.querySelector(".task-text") &&
            item.querySelector(".task-text").textContent === task.text;
    });

    if (!li) return;

    li.innerHTML = "";

    // Input for editing
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = task.text;
    editInput.className = "edit-input";

    // Save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.className = "save-button";

    // Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.className = "cancel-button";

    function saveEdit() {
        const updatedText = editInput.value.trim();

        if (updatedText === "") {
            alert("Task cannot be empty!");
            return;
        }

        task.text = updatedText;
        displayTasks();
    }

    saveButton.addEventListener("click", saveEdit);

    cancelButton.addEventListener("click", displayTasks);

    editInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            saveEdit();
        }

        if (event.key === "Escape") {
            displayTasks();
        }
    });

    li.appendChild(editInput);
    li.appendChild(saveButton);
    li.appendChild(cancelButton);

    editInput.focus();
}

// Add task using button
addButton.addEventListener("click", addTask);

// Add task using Enter key
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Search tasks
searchInput.addEventListener("input", displayTasks);

// Change task filter
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();
    });
});

// Clear all completed tasks
clearButton.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    displayTasks();
});

// Initial display
displayTasks();