import { v4 as uuidv4 } from "uuid";

initUser();

console.log("loaded");

function createCell() {
  var cellElement = document.createElement("div");
  cellElement.className = "cell";
  cellElement.textContent = "haho";

  return cellElement;
}

function generateCells(rows, columns) {
  const grid = document.getElementById("grid");

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      var cell = createCell();
      grid.appendChild(cell);
    }
  }
}

const joinButton = document.getElementById("join");

joinButton.addEventListener("click", () => {
  console.log("clicked join button");
  joinSession();
});

const hostButton = document.getElementById("host");

hostButton.addEventListener("click", () => {
  console.log("clicked host button");

    hostSession();

});

generateCells(7, 6);

const socket = new WebSocket("ws://localhost:3000/ws");

socket.onmessage = (event) => {

  const data = JSON.parse(event.data);

  if (data.type === "code") {
    
    // this is deprecated probably not required anymore
    console.log("received session code as host: "+ data.code)
  } else if (data.type === "joined") {
    
    console.log("received session code as joiner: "+ data.code)

  } else if (data.type === "move") {
    
    // this is for showcasing the connection (boradcasting moves)
    const div = document.getElementById("wsbox");
    const msgDiv = document.createElement("div");
    msgDiv.textContent = data.message;
    div.appendChild(msgDiv);
    /// will be removed
  }
};

function hostSession() {

  const code = initSessionCode();
  socket.send(JSON.stringify({ type: "host", code }));
}

function joinSession() {
  const code = document.getElementById("joinCode").value;

  setSessionCode(code);

  console.log("your session code is: "+code);

  socket.send(JSON.stringify({ type: "join", code, user: getSessionUser() }));
}


/// user id
// this is not used yet, but later it might be handy
function initUser() {

  let user = localStorage.getItem('user');
  if (user === null) {
    user = uuidv4();
    localStorage.setItem('user', user);
  }

  console.info(`Current user is ${user}`);
}

function getSessionUser() {
  return localStorage.getItem('user');
}

/// DEBUG FOR WS just event handling
const wssend = document.getElementById("wssend");

wssend.addEventListener("click", () => {
  const wstext = document.getElementById("wstext");
  socket.send(JSON.stringify({ type: "move" , message: wstext.value, code: getSessionCode()})); 
  wstext.value = "";
});


//// session code, init and getters

function initSessionCode() {

  let code = localStorage.getItem('code');
  if (code === null) {
    code = uuidv4();
    localStorage.setItem('code', code);
  }

  console.info(`Your current session code is ${code}`);
  return code;
}

function getSessionCode() {
  return localStorage.getItem('code');
}

function setSessionCode(code) {
  return localStorage.setItem('code',code);
}