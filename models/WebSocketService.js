import { Server as socketIo } from 'socket.io';
import { updateRequestById } from '../controllers/RequestController.js';

class WebSocketService {
  constructor(server) {
    this.io = new socketIo(server);

    this.io.on('connection', (socket) => {
      console.log('A user connected.');

      socket.on('WSAdminResponse', (message) => {
        console.log('WSAdminResponse: ' + message);
        this.handleWSAdminResponse(socket, message);
      });

      socket.on('testByWeb', (message) => {
        console.log('testByWeb: ' + message);
        socket.emit("testByServer", String(message));
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected.');
      });
    });
  }

  async handleWSAdminResponse(socket, message) {
    try {
      let msg = JSON.parse(message) || undefined;
      if (!msg) throw new Error("Message parsing failed");

      const { requestId, adminId, status } = msg;

      switch (status) {
        case 'accepted':
          await updateRequestById(requestId, adminId, status);
          console.log("Request from socket.io forwarded to MQTT (accepted)");
          this.mqttService.publish('MQTTAdminResponse', "1");
          break;

        case 'rejected':
          await updateRequestById(requestId, adminId, status);
          console.log("Request from socket.io forwarded to MQTT (rejected)");
          this.mqttService.publish('MQTTAdminResponse', "2");
          break;

        default:
          console.log("Default case hit");
          break;
      }
    } catch (error) {
      console.error("Error handling WSAdminResponse:", error.message);
    }
  }

  setMqttService(mqttService) {
    this.mqttService = mqttService;
  }
}

export { WebSocketService };