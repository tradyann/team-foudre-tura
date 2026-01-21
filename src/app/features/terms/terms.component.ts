import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {

  datas: any;
  constructor(
    private dataService: UserService
  ) { }
  
  ngOnInit(): void {
    this.onFetchDatas();
  }
  onFetchDatas(): void {
    this.dataService.getTerms().subscribe({ 
      next: (res: any) => {
        //console.log(res);
        this.datas = res;
      },
      error: (err: any) => {
        console.log(err);
        alert(err.message)
      }
    });
  }

}
