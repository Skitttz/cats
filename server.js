import http from 'http';
import { config } from 'dotenv';
import { Server } from 'socket.io';
config();
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  timeout: 5000,
  autoConnect: true,
});

const portSocket = process.env.PORT_SOCKET;
const rooms = {};

io.on('connection', (socket) => {
  socket.on('joinRoom', (roomId, userName) => {
    // Adiciona o usuário à sala especificada
    socket.join(roomId);

    // Rastreia os usuários na sala
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Adiciona o usuário atual à lista de usuários da sala
    rooms[roomId].push({ id: socket.id, name: userName });

    // Emite a lista de usuários para todos os clientes na sala
    io.to(roomId).emit('updateUsers', rooms[roomId]);

    socket.on('message', (message) => {
      // Lógica para lidar com as mensagens
      io.to(roomId).emit('message', message);
    });

    // Evento para quando o usuário desconectar
    socket.on('disconnect', () => {
      // Remove o usuário da lista de usuários na sala
      rooms[roomId] = rooms[roomId].filter((user) => user.id !== socket.id);
      // Emite a lista de usuários atualizada para todos os clientes na sala
      io.to(roomId).emit('updateUsers', rooms[roomId]);
    });
  });
});

io.on('connect_error', (error) => {
  console.error('Erro de conexão');
});

io.on('reconnect_failed', () => {
  console.error('Todas as tentativas de reconexão falharam.');
});

server.listen(portSocket, () => {
  console.log(`Servidor WebSocket está rodando`);
});
