import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8080/ws';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscribers = new Map();
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      const socket = new SockJS(SOCKET_URL);
      
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: function (str) {
          console.log('STOMP: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      });

      this.stompClient.onConnect = () => {
        console.log('Connected to WebSocket');
        resolve();
      };

      this.stompClient.onStompError = (frame) => {
        console.error('STOMP error', frame);
        reject(frame);
      };

      this.stompClient.activate();
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  subscribe(destination, callback) {
    if (!this.stompClient) return;
    
    const subscription = this.stompClient.subscribe(destination, (message) => {
      const payload = JSON.parse(message.body);
      callback(payload);
    });

    this.subscribers.set(destination, subscription);
  }

  unsubscribe(destination) {
    const subscription = this.subscribers.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscribers.delete(destination);
    }
  }

  sendMessage(destination, message) {
    if (!this.stompClient) return;

    this.stompClient.publish({
      destination,
      body: JSON.stringify(message)
    });
  }
}

export default new WebSocketService();