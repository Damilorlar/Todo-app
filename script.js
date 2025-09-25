const dateElement= document.getElementById("date")
const taskInput = document.getElementById("input")
const addBtn = document.getElementById("addBtn")
const filters =document.querySelectorAll(".filter")
const todoList =document .getElementById("todo-list")
const emptyState = document.getElementById("empty-state")
const itemLeft = document.getElementById("items-left")
const clearCompletedBtn = document.getElementById("clear-completed")

// Date function

// 
let todos = []
let currentFilter ="All"

// button to add task using both the  "PLUS ICON" and ENTER KEY"
addBtn.addEventListener("click", ()=>{
    addTodo(taskInput.value)
});

taskInput.addEventListener("keydown",(e)=>{
    if(e.key === "Enter") addTodo(taskInput.value)
});

// clear completed button function
clearCompletedBtn.addEventListener("click", clearComplete);


// ADDTODO FUNCTIONS: to be able to add our todo into an array

function addTodo(text){
    if(text.trim() === "") return

    // push the todo into the todos(array)
    const todo = {
        id:Date.now(),
        text,
        completed:false
    }
    // updated the array
    todos.push(todo)
    // function to save to local storage
    saveTodos()
    // for updatting the UI
    renderTodos()

    taskInput.value ="";
}

function saveTodos(){
    localStorage.setItem("todos", JSON.stringify(todos))
    // To update the numbers of items
    updateItemCount()
    // function that display if there are no task 
    checkEmptyState()
}

function updateItemCount(){
    const uncompletedTodos = todos.filter((todo) => !todo.completed)
    itemLeft.textContent = `${uncompletedTodos.length} item ${uncompletedTodos.length !==1 ? "s": ""} left`;

}
// function checkEmptyState(){
//     const filteredTodos = filterTodo(currentFilter)
//     if (filteredTodos?.length === 0) emptyState.classList.remove("hidden")
//         else emptyState.classList.add("hidden")
// }
function checkEmptyState() {
  const filteredTodos = filterTodo(currentFilter); // check based on active filter
  if (filteredTodos.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }
}

// function that place the task in the appropriate filter
function filterTodo(filter){
    switch (filter){
        case "active":
        return todos.filter(todo => !todo.completed);
        case "completed":
          return todos.filter(todo => todo.completed);
          default:
            return todos;
    }
}

function renderTodos(){

    todoList.innerHTML = ""

    const filteredTodos = filterTodo(currentFilter)

   filteredTodos.forEach(todo => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("todo-item");
        if(todo.completed) todoItem.classList.add("completed")

        const checkContainer = document.createElement("label")
        checkContainer.classList.add("check-container")

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.classList.add("todo-checkbox")
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => toggleTodo(todo.id));

        const checkmark = document.createElement("span")
        checkmark.classList.add ("checkmark")

        checkContainer.appendChild(checkbox);
        checkContainer.appendChild(checkmark)

        const todoItemText= document.createElement("span")
        todoItemText.classList.add("todo-item-text")
        todoItemText.textContent = todo.text;

        const deleteBtn = document.createElement("button")
        deleteBtn.classList.add("delete-btn")
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>'
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

        todoItem.appendChild(checkContainer);
        todoItem.appendChild(todoItemText);
        todoItem.appendChild(deleteBtn);

        todoList.appendChild(todoItem);
        
    });

    checkEmptyState();
}

// function to clear completed tasks
function clearComplete(){
    todos = todos.filter((todo) => !todo.completed);
    // currentFilter = "all";
    saveTodos();
    renderTodos();
}
// function to toggle the completed status of a todo
function toggleTodo(id){
    todos = todos.map((todo) =>{
        if(todo.id === id){
            return {...todo, completed: !todo.completed}
        }
        return todo;
    }
    );
    saveTodos();
    renderTodos();
}


 function deleteTodo(id){
    todos= todos.filter((todo)=> todo.id !== id);
    saveTodos();
    renderTodos();
 }
  
function loadTodos(){
    const storedTodos = localStorage.getItem("todos")
    if(storedTodos)   todos = JSON.parse(storedTodos)
    renderTodos();
    updateItemCount();
    checkEmptyState();  
}
// filter buttons function
filters.forEach((filter)=>{
    filter.addEventListener("click", ()=>{
        setActiveFilter(filter.getAttribute("data-filter")) 
    })
})
function setActiveFilter(filter){
    currentFilter = filter;
    filters.forEach((item) =>{
        if(item.getAttribute("data-filter") === filter){
            item.classList.add("active")
        } else{
            item.classList.remove("active")
        }
    });
    renderTodos();
}
function formatDate(){
    const options = { weekday: "long", month: "short", day: "numeric" }
    const today = new Date()
    dateElement.textContent = today.toLocaleDateString("en-US", options)
}
 
// Load todos from local storage when the DOM is fully loaded
window.addEventListener("DOMContentLoaded", ()=>{
    loadTodos();
    formatDate();
})
  




