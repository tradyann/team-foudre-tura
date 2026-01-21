import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, MailIcon, KeyRoundIcon, UserPlusIcon, LinkIcon } from 'lucide-angular';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/toast/toast.service';
import { AsideImage } from '../aside-image/aside-image';
import { AccountService } from '../account.service';


@Component({
  selector: 'app-zwift-linked',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, TranslateModule, AsideImage, LucideAngularModule],
  templateUrl: './zwift-linked.html',
  styleUrl: './zwift-linked.css'
})
export class ZwiftLinked implements OnInit {
  userForm!: FormGroup;
  baseUrl: string = environment.ApiBaseUrl;
  router = inject(Router);

  waiting = signal(false);
  linked = signal(false);

  MailIcon = MailIcon;
  KeyRoundIcon = KeyRoundIcon;
  UserPlusIcon = UserPlusIcon;
  LinkIcon = LinkIcon;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private translate: TranslateService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      zwiftId: new FormControl(null, [Validators.required, Validators.min(1)])
    });
  }

  get email(): AbstractControl | null {
    return this.userForm.get('email');
  }

  get zwiftId(): AbstractControl | null {
    return this.userForm.get('zwiftId');
  }

  onSubmitForm(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      this.waiting.set(true);

      const Email = this.email?.value;
      const ZwiftId = +this.zwiftId?.value;

      this.accountService.linkZwiftId(Email, ZwiftId).subscribe({
        next: (res: any) => {
          if (res > 0) {
            this.linked.set(true);
            this.toast.show('Account linked.', 'success');
            this.router.navigate(["/"]);
          } else if (res === -1) {
            this.toast.show('We cannot find your email. Please register.', 'error');
          } else if (res === -2) {
            this.toast.show('A ZwiftId is already linked to this email.', 'error');
          } else if (res === -3) {
            this.toast.show('We cannot find your Zwift ID. Please try again.', 'error');
          } else {
            this.toast.show('Unknown error. Please try again.', 'error');
          }
          this.waiting.set(false);
        },
        error: (err) => {
          console.error(err);
          this.waiting.set(false);
          this.toast.show('An error occurs. Please try again.', 'error');
        }
      });
    }
  }
}