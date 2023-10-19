const WebSocket = require('ws');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server running');
});

const wss = new WebSocket.Server({ noServer: true });

// TBD: object to store
const sessions = new Map(); // Mapping session codes to WebSocket instances

wss.on('connection', (ws) => {
  
    // This is the setup of each connection
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'host' && data.code) {

      // we are setting up a new session
      const code = data.code;
      console.log("created session with session id: "+code);
      sessions.set(code, {
        host: ws,
      });
      ws.send(JSON.stringify({ type: 'code', code: code }));


    } else if (data.type === 'join' && sessions.has(data.code)) {

      // user is added to an existing session
      const session = sessions.get(data.code);
      const host = session.host;
      if (!host) {
        console.error("Invalid session id was provided")
      } 

      ws.send(JSON.stringify({ type: 'joined' }));
      host.send(JSON.stringify({ type: 'joined' }));

      session.joined = ws;
    } else if (data.type === 'move' && sessions.has(data.code)) {
      // this is going to be the handler for moves in the game

      const session = sessions.get(data.code);
      const host = session.host;
      const joined = session.joined;

      if (host && joined) {

        // we are messaging both users so essentially broadcasting the message
        host.send(JSON.stringify({type: "move", message: data.message}));
        joined.send(JSON.stringify({type: "move", message: data.message}));
      } 
    } else {
      console.error("unhandled event");
      console.error(data);
    }
  });
});

// handling WS http stuff, not important
server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function generateSessionCode() {
  return Math.random().toString(36).substring(7); // Generate a random session code
}
