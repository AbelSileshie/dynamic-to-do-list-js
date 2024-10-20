document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("add-task-btn");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  function addTask(taskText, save = true) {
    const li = document.createElement("li");
    li.textContent = taskText;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-btn");
    removeButton.onclick = () => {
      taskList.removeChild(li);
      tasks = tasks.filter((t) => t !== taskText);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    li.appendChild(removeButton);
    taskList.appendChild(li);

    if (save) {
      tasks.push(taskText);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    if (taskInput.value.trim() === "") {
      taskInput.value = alert("Please enter a task");
    } else {
      taskInput.value.trim = "";
    }
  }

  function loadTasks() {
    tasks.forEach((taskText) => addTask(taskText, false));
  }

  addButton.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  });

  loadTasks();
});
