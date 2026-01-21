import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-api-doc',
  imports: [CommonModule, RouterLink],
  templateUrl: './api-doc.html',
  styleUrl: './api-doc.css'
})
export class ApiDoc {
  tokenModel = JSON.parse('{"email": "your_email","password": "your_password","pincode": ""}')
  tokenBody = JSON.stringify(this.tokenModel, null, 2);

  segmentModel: any[] = [
    {
      "roadbookId": 123,
      "lap": 1,
      "segmentId": "123456",
      "stakePointId": 1,
      "stakeTimeId": null,
      "typeSegment": "kom"
    },
      {
      "roadbookId": 123,
      "lap": 0,
      "segmentId": "0",
      "stakePointId": null,
      "stakeTimeId": 1,
      "typeSegment": "finish"
    }
  ];
  segmentBody = JSON.stringify(this.segmentModel, null, 2);

}
