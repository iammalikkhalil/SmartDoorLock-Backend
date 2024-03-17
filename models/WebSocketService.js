import { Server as socketIo } from 'socket.io';
import { updateRequestById } from '../controllers/RequestController.js';

class WebSocketService {
  constructor(server) {
    this.io = new socketIo(server);

    this.io.on('connection', (socket) => {
      console.log('A user connected.');

      socket.on('WSAdminResponse', (message) => {
        this.handleWSAdminResponse(socket, message);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected.');
      });
    });
  }

  handleWSAdminResponse(socket, message) {
    switch (message.status) {
      case 'accepted':
        // update database
        updateRequestById(message._id, message.status);

        // send response to admin MQTT
        console.log("request from socket.io forwarded to mqtt");
        this.mqttService.publish('MQTTAdminResponse', String(1));
        console.log("");
        // update ui for the specific user
        socket.emit('WSUpdateUI', "1");

        break;
      case 'rejected':
        // update database
        updateRequestById(message._id, message.status);

        // send response to admin MQTT
        console.log("request from socket.io forwarded to mqtt");
        this.mqttService.publish('MQTTAdminResponse', String(2));

        // update ui for the specific user
        socket.emit('WSUpdateUI', "1");
        break;
      default:
        break;
    }
  }

  setMqttService(mqttService) {
    this.mqttService = mqttService;
  }
}

export { WebSocketService };