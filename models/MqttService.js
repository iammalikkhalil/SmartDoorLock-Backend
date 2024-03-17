import mqtt from 'mqtt';
import { postRequestById } from '../controllers/RequestController.js';

class MqttService {
  constructor(options) {
    this.client = mqtt.connect(options);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('MQTTUserRequest');
      this.client.subscribe('MQTTAdminResponse');
    });

    this.client.on('message', (topic, message) => {
      console.log(`message come at topic ${topic}:`, message.toString());

      switch (topic) {
        case 'MQTTUserRequest':
        this.handleMQTTUserRequest(message);
          break;
      
        default:
          break;
      }
    });
  }

  handleMQTTUserRequest(message) {
    let id = message.toString();
    postRequestById(id)
    this.io.emit('WSUserRequest', message.toString());
    console.log("request from mqtt forwarded to socket.io");
  }

  setIo(io) {
    this.io = io;
  }

  publish(topic, message) {
    this.client.publish(topic, message);
  }
}

export {MqttService};