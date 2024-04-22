import express from 'express';
import http from 'http';
import { MqttService } from './models/MqttService.js';
import { WebSocketService } from './models/WebSocketService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mongodb from './config/dbconnection.js';
import dotenv from 'dotenv';
import ErrorHandler from './middleware/ErrorHandler.js';

dotenv.config();
mongodb();

const app = express();
const server = http.createServer(app);
app.use(express.json());

const mqttOptions = {
  host: process.env.MQTT_HOST,
  port: 1883,
  protocol: 'mqtt://',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
};

const mqttService = new MqttService(mqttOptions);
const webSocketService = new WebSocketService(server);

mqttService.setIo(webSocketService.io);
webSocketService.setMqttService(mqttService);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

import userRoutes from './routes/UserRoutes.js';
app.use('/user', userRoutes);

import roleRoutes from './routes/RoleRoutes.js';
app.use('/role', roleRoutes);

import fingerprintRoutes from './routes/FingerprintRoutes.js';
app.use('/fingerprint', fingerprintRoutes);

import requestRoutes from './routes/RequestRoutes.js';
app.use('/request', requestRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(ErrorHandler);

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}/`);
});