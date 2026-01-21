import { Component, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-categorization',
  imports: [],
  templateUrl: './categorization.html',
  styleUrl: './categorization.css'
})
export class Categorization {

  constructor(private fb: FormBuilder) {}

  //form = this.fb.group({ zwiftId: [''] });
  result = signal<any>(null);

  checkCategory() {
    // const id = this.form.value.zwiftId;
    //this.http.get(`/api/guest-category/${id}`).subscribe(res => this.result.set(res));
  }
}
