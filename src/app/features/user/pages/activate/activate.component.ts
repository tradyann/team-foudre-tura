import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AlertTriangleIcon, LucideAngularModule } from 'lucide-angular';
import { AsideImage } from '../../../account/aside-image/aside-image';
import { AccountService } from '../../../account/account.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { UserService } from '../../user.service';


@Component({
  selector: 'app-activate',
  standalone: true, 
  imports: [CommonModule, RouterLink, TranslateModule, AsideImage, LucideAngularModule],
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss'],
  providers: [DatePipe]
})
export class ActivateComponent implements OnInit {

  waiting = signal(false);
  datas = signal<any[]>([]);
  hasLoaded = signal(false);
  AlertTriangleIcon = AlertTriangleIcon;

  constructor(
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private router: Router,
    private toast: ToastService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(routeParam => this.getDatas(routeParam['id']));
  }

  getDatas(id: string): void {
    this.accountService.getActivation(id).subscribe(res => {
      this.datas.set(res);
      this.hasLoaded.set(true);
    });
  }

  onSubmitForm(): void {  

    this.waiting.set(true);

    const clientId = this.datas()?.[0]?.idClient?.toString();
    if (!clientId) {
      this.toast.show('Missing client ID', 'error');
      return;
    }

    this.accountService.validateAccount(clientId, '').subscribe({
        next: (res: any) => { 
          //console.log(res);
          this.waiting.set(false);
          if (res > 0) {
            const message = this.translateService.instant('SUCCESS.ACCOUNT_VALIDATED');
            this.toast.show(message, 'success');
            // this.notificationService.open(ToastComponent, {stacking: true, delay: 3000, autohide: false,
            //   data: { title: 'Success!', text: message, colorclass: 'toast-success'} });
            this.router.navigate(['/account/login']);
          } else {
            const message = `${this.translateService.instant('ERROR.UNKNOW_ERROR')} - ${this.translateService.instant('ERROR.CONTACT_SUPPORT')} - error code  2350`
            this.toast.show(message, 'error');
            //this.notificationService.open(ToastComponent, {stacking: true, delay: 3000, autohide: true, data: { title: 'Error!', text: message, colorclass: 'toast-danger'} });
            this.userService.logout();
          }
        },
        error: (err: any) => { 
          console.log(err);
          this.waiting.set(false);
          this.toast.show(err.error.toString(), 'error');
          //this.notificationService.open(ToastComponent, {stacking: true, delay: 3000, autohide: true, data: { title: 'Error!', text: err.error.toString(), colorclass: 'toast-danger'} });
        } 
      });
  }
}
