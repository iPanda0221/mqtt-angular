import { Component, OnInit } from '@angular/core';
import { MqttService } from './mqtt.service';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor
import { FormsModule } from '@angular/forms'; // Correctly import FormsModule here

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule], // Import CommonModule for ngFor and FormsModule for ngModel
})
export class AppComponent implements OnInit {
  message = '';
  receivedMessages: string[] = []; // Array to hold received messages

  constructor(private mqttService: MqttService) {}

  ngOnInit() {
    // Subscribe to the message observable
    this.mqttService.messages$.subscribe((messages: string[]) => {
      this.receivedMessages = messages; // Update the receivedMessages array with the new messages
    });
  }

  // Method to send the message
  sendMessage() {
    if (this.message.trim()) {
      this.mqttService.sendMessage('test/topic', this.message); // Publish the message
      this.message = ''; // Clear input after sending
    }
  }
}
