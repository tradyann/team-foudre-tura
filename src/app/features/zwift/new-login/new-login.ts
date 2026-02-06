import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZwiftService } from '../zwift.service';
import { LucideAngularModule, MailIcon, KeyRoundIcon, UserPlusIcon, LinkIcon } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/toast/toast.service';
import { ZwiftLinkState } from '../../../services/zwift-link.state';

@Component({
  selector: 'app-new-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, LucideAngularModule, RouterLink],
  templateUrl: './new-login.html',
  styleUrl: './new-login.css'
})
export class NewLogin {
  userForm!: FormGroup;
  router = inject(Router);
  zwiftService = inject(ZwiftService);
  zwiftLinkState = inject(ZwiftLinkState);

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
    const zwiftId = this.zwiftLinkState.zwiftId();
    if (zwiftId) {
      this.alreadyLinked.set(zwiftId);
      this.linked.set(true);
    }
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

      const ZwiftId = +this.zwiftId?.value;
      const Email = this.email?.value;

      const payload: {
        zwiftId: number;
        email: string;
      } = {
        zwiftId: ZwiftId,
        email: Email,
      };

      this.zwiftService.postNewLogin(payload).subscribe({
        next: (res: any) => {

          // Sécurité
          if (!res) {
            this.toast.show('Unknown error. Please try again.', 'error');
            this.waiting.set(false);
            return;
          }

          // 1️⃣ ZwiftId inconnu
          if (!res.found) {
            this.toast.show(
              'We cannot find your Zwift ID. Please try again.',
              'error'
            );
            this.waiting.set(false);
            return;
          }

          // 2️⃣ Email incorrect pour ce ZwiftId
          if (!res.emailMatch) {
            this.toast.show(
              'This email does not match the Zwift ID provided.',
              'error'
            );
            this.waiting.set(false);
            return;
          }

          // 3️⃣ ZwiftId + email OK → compte lié
          this.linked.set(true);
          this.alreadyLinked.set(payload.zwiftId);

          this.toast.show('Account linked.', 'success');

          // Stockage local
          this.zwiftLinkState.setZwiftId(payload.zwiftId);

          if (res.validated) {
            localStorage.setItem('isValidated', 'true');
          } else {
            localStorage.removeItem('isValidated');
          }

          // Navigation éventuelle
          // this.router.navigate(['/']);

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
    this.zwiftLinkState.clear();
    localStorage.removeItem('isValidated');
    this.router.navigate(['/']);
  }

}
