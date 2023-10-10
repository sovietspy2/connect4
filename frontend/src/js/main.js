//import { v4 as uuidv4 } from 'uuid';



console.log("loaded")


function createCell() {

    var cellElement = document.createElement("div");
    cellElement.className = "cell";
    cellElement.textContent="haho";

    return cellElement;
}

//const uuid = uuidv4();

function generateCells(rows, columns){

    const grid = document.getElementById("grid");

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var cell = createCell();
            grid.appendChild(cell);
        }
    }
}

function getJoinCode(){
    let code = document.getElementById("joinCode").value;
    return code;
}


const joinButton = document.getElementById("join");

joinButton.addEventListener("click", () => {
    console.log("clicked join button");
    console.log(getJoinCode());
});

const hostButton = document.getElementById("host");

hostButton.addEventListener("click", () => {
    console.log("clicked host button");
});

generateCells(7,6);
