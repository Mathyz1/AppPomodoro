const tasks = [];//guardo las tareas que ire ejecutando
let time = 0;
let timer = null;
let timerBreak = null; //tiempo de break o descanso
let current = null; //tarea actual que se ejecuta

const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");
const taskName = document.querySelector("#time #taskName");


renderTime();
renderTasks();

form.addEventListener("submit", e => {
    e.preventDefault();//anulamos el funcionamiento nativo, que no se envie el formulario
    if(itTask.value != ""){
        createTask(itTask.value);
        itTask.value = "";
        //una vez que ingresamos al arreglo un nuevo elemento tengo que renderizar mis tareas
        renderTasks();
    }
});

function createTask(value){
    //las task van a ser objetos
    const newTask = {
        //toString(radix) crea tres caracteres raros al comienzo que los sacamos con slice(3)
        id:(Math.random()*100).toString(36).slice(3),
        title: value,
        completed: false,    
    };

    tasks.unshift(newTask);
}

//tomo cada una de las tareas  y genero un html que al final inyecto en el contenedor
function renderTasks(){
    const html = tasks.map(task => {
        return `
            <div class="task">
                <div class="completed">${task.completed ? `<span class="done">Done</span>`: `<button class="start-button" data-id="${task.id}">Start</button>`}</div>
                <div class="title">${task.title}</div>
            </div>
        `;
    });
    //con el map creo un arreglo de los elementos que devuelvo, todos los div por tareas, con el join los uno en un string

    const taskContainer = document.querySelector("#tasks");
    taskContainer.innerHTML = html.join();

    const startButtons = document.querySelectorAll(".task .start-button");
    //ahora los itero
    startButtons.forEach(button => {
        button.addEventListener("click", e => {
            //si timer es null se cumple la condicion
            if(!timer){
                const id = button.getAttribute("data-id");
                startButtonHandler(id);
                button.textContent= "In progress...";
            }
        });
    });
}

function startButtonHandler(id){
    //calcular los 25 minutos de la actividad principal
    time = 25 * 60; //25 minutos por 60 segundos que tienen
    current = id;
    const taskIndex = tasks.findIndex(task => task.id == id);
    taskName.textContent = tasks[taskIndex].title;
    renderTime();//ejecuto antes para visualizar el primer numero
    //como darle formato al texto, necesito que se ejecute una funcion cada segundo que es el que 
    //va a disminuir el tiempo en 1 hasta que llegue a cero
    timer = setInterval(()=>{
        timeHandler(id);
    }, 1000); 
    //set interval me permite ejecutar una funcion indefinidamente (la funcion, el intervalo de tiempo por el cual se ejecuta 1000ms 1seg)
}

function timeHandler(id){

    time--;
    renderTime();
    
    //ahora necesito detener el handler o la funcion setInterval mejor dicho cuando el tiempo sea igual a cero
    if (time <= 0){
        clearInterval(timer);
        //current=null;
        //taskName.textContent = "";
        timer=null;
        markCompleted(id);
        renderTasks();
        startBreak();
    }
}

function renderTime(){
    const timeDiv = document.querySelector("#time #value");
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

function markCompleted(id){
    const taskIndex = tasks.findIndex(task => task.id == id);
    tasks[taskIndex].completed = true;
    
}

function startBreak(){
    time = 5 * 60;
    taskName.textContent = "Break";
    renderTime();//ejecuto antes para visualizar el primer numero
    timerBreak=setInterval(()=>{
        timerBreakHandler(); 
    },1000)
}

function timerBreakHandler(){
    time--;
    renderTime();
    
    //ahora necesito detener el handler o la funcion setInterval mejor dicho cuando el tiempo sea igual a cero
    if (time <= 0){
        clearInterval(timerBreak);
        current=null;
        taskName.textContent = "";
        timerBreak=null;
        renderTasks();
    }
}

/*Correcciones para hacer, se puede empezar tareas mientras esta en break o hasta capaz cuando otro se ejecuta
validar eso*/

/*aplicacion donde aprendemos a utilizar temas como arreglos, objetos, eventos y todo el tema de manejo de 
ejecucion de tiempo
Vida MRR - Diseño y desarrollo web - Youtube*/