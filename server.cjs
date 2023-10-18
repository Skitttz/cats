const http = require("http");
const server = http.createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5174", // IP definido pelo React
    methods: ["GET", "POST"],
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId, userName) => {
    // Adiciona o usuário à sala especificada
    socket.join(roomId);

    // Rastreia os usuários na sala
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Adiciona o usuário atual à lista de usuários da sala
    rooms[roomId].push({ id: socket.id, name: userName });

    // Emite a lista de usuários para todos os clientes na sala
    io.to(roomId).emit("updateUsers", rooms[roomId]);

    socket.on("message", (message) => {
      // Lógica para lidar com as mensagens
      io.to(roomId).emit("message", message);
    });
    // Evento para quando o usuário desconectar
    socket.on("disconnect", () => {
      // Remove o usuário da lista de usuários na sala
      rooms[roomId] = rooms[roomId].filter((user) => user.id !== socket.id);
      // Emite a lista de usuários atualizada para todos os clientes na sala
      io.to(roomId).emit("updateUsers", rooms[roomId]);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket está rodando na porta ${PORT}`);
});
