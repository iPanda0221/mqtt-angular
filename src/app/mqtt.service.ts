import { Injectable } from '@angular/core';
import mqtt from 'mqtt';
import { BehaviorSubject } from 'rxjs'; // Import BehaviorSubject to handle state

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client: mqtt.MqttClient;
  private messagesSubject = new BehaviorSubject<string[]>([]); // Create a BehaviorSubject to store received messages

  // Observable to subscribe to messages
  messages$ = this.messagesSubject.asObservable();

  constructor() {
    // Connect to the MQTT broker (use WebSocket for browser)
    this.client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');

    // Once connected to the broker
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Subscribe to a topic
      this.client.subscribe('test/topic', (err) => {
        if (!err) {
          console.log('Subscribed to test/topic');
        }
      });
    });

    // Handle incoming messages
    this.client.on('message', (topic, message) => {
      console.log(`Received message: ${message.toString()}`);
      // Push the received message to the BehaviorSubject
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message.toString()]); // Update the message array
    });
  }

  // Method to send a message to the MQTT broker
  sendMessage(topic: string, message: string): void {
    console.log(`Publishing message to ${topic}: ${message}`);
    this.client.publish(topic, message);
  }
}
