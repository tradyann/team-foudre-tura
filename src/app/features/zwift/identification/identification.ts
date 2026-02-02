import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, MailIcon, KeyRoundIcon, UserPlusIcon, LinkIcon } from 'lucide-angular';
import { ToastService } from '../../../shared/toast/toast.service';
import { ZwiftService } from '../zwift.service';


@Component({
  selector: 'app-identification',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, LucideAngularModule, RouterLink],
  templateUrl: './identification.html',
  styleUrl: './identification.css'
})
export class Identification {
  userForm!: FormGroup;
  baseUrl: string = environment.ApiBaseUrl;
  router = inject(Router);
  zwiftService = inject(ZwiftService);

  waiting = signal(false);
  linked = signal(false);
  alreadyLinked = signal<number | null>(null);


  MailIcon = MailIcon;
  KeyRoundIcon = KeyRoundIcon;
  UserPlusIcon = UserPlusIcon;
  LinkIcon = LinkIcon;

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const storedZwiftId = localStorage.getItem('zwiftIdLinked');
    if (storedZwiftId) {
      this.alreadyLinked.set(+storedZwiftId);
      this.linked.set(true);
    }
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      urlVideo: new FormControl(null, [Validators.required]),
      zwiftId: new FormControl(null, [Validators.required, Validators.min(1)])
    });
  }

  get urlVideo(): AbstractControl | null {
    return this.userForm.get('urlVideo');
  }

  get zwiftId(): AbstractControl | null {
    return this.userForm.get('zwiftId');
  }

  onSubmitForm(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      this.waiting.set(true);

      const urlVideo = this.urlVideo?.value;
      const ZwiftId = +this.zwiftId?.value;

      const payload: {
        zwiftId: number;
        urlFile: string;
        controlType: 'VIDEO' | 'FIT' | 'LOG';
      } = {
        zwiftId: ZwiftId,
        urlFile: urlVideo,
        controlType: 'VIDEO'
      };

      this.zwiftService.addControlFile(payload).subscribe({
        next: (res: any) => {
          if (res.added) {
            this.linked.set(true);
            this.alreadyLinked.set(ZwiftId);
            this.toast.show('Account linked.', 'success');

            // we must create a local storage item to store the zwiftId linked
            localStorage.setItem('zwiftIdLinked', ZwiftId.toString());
    
          //  this.router.navigate(["/"]);
          // } else if (res === -1) {
          //   this.toast.show('We cannot find your email. Please register.', 'error');
          // } else if (res === -2) {
          //   this.toast.show('A ZwiftId is already linked to this email.', 'error');
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

  logout(): void {
    localStorage.removeItem('zwiftIdLinked');
    this.router.navigate(['/']);
  }
}
