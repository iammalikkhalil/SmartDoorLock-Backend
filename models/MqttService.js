import mqtt from 'mqtt';
import { postRequestById } from '../controllers/RequestController.js';

class MqttService {
  constructor(options) {
    this.client = mqtt.connect(options);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('MQTTUserRequest');
      this.client.subscribe('MQTTAdminResponse');
      this.client.subscribe('DoorLock');
    });

    let messageCounter = 0;

    this.client.on('message', (topic, message) => {
      console.log(`Message received on topic ${topic}:`, message.toString());

      switch (topic) {
        case 'MQTTUserRequest':
          if (message.toString().includes('id')) {
            if (messageCounter === 0) {
              this.handleMQTTUserRequest(message);
              ++messageCounter;
            }
            // Reset counter after 1 minute
            setTimeout(() => {
              messageCounter = 0;
            }, 60000);
          }
          break;
        default:
          break;
      }
    });
  }

  async handleMQTTUserRequest(message) {
    let id = message.toString().replace(/^id/, "");
    let user = await postRequestById(id);
    if (this.io) {
      this.io.emit('WSUserRequest', JSON.stringify(user));
      console.log("Request from MQTT forwarded to socket.io");
    } else {
      console.error("WebSocket service (io) is not set");
    }
  }

  setIo(io) {
    this.io = io;
  }

  publish(topic, message) {
    this.client.publish(topic, message);
  }
}

export { MqttService };