import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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
      urlVideo: new FormControl(null),
      firstname: new FormControl(null, [Validators.required]),
      lastname: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      zwiftId: new FormControl(null, [Validators.required, Validators.min(1)])
    });
  }

  get urlVideo(): AbstractControl | null {
    return this.userForm.get('urlVideo');
  }

  get firstname(): AbstractControl | null {
    return this.userForm.get('firstname');
  }

  get lastname(): AbstractControl | null {
    return this.userForm.get('lastname');
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

      const urlVideo = this.urlVideo?.value;
      const ZwiftId = +this.zwiftId?.value;
      const FirstName = this.firstname?.value;
      const LastName = this.lastname?.value;
      const Email = this.email?.value;

      const payload: {
        zwiftId: number;
        firstName: string;
        lastName: string;
        email: string;
        urlFile: string;
        controlType: 'VIDEO' | 'FIT' | 'LOG';
      } = {
        zwiftId: ZwiftId,
        firstName : FirstName,
        lastName: LastName,
        email: Email,
        urlFile: urlVideo,
        controlType: 'VIDEO'
      };

      this.zwiftService.addControlFile(payload).subscribe({
        next: (res: any) => {

          if (!res) {
            this.toast.show('Unknown error. Please try again.', 'error');
            this.waiting.set(false);
            return;
          }

          if (res.added) {
            this.linked.set(true);
            this.alreadyLinked.set(ZwiftId);

            this.toast.show('Account linked.', 'success');

            // Stockage local
            localStorage.setItem('zwiftIdLinked', ZwiftId.toString());

            // ⚠️ IMPORTANT :
            // un ajout ≠ validation du contrôle
            // donc on ne force PAS isValidated ici
            localStorage.removeItem('isValidated');

            this.waiting.set(false);
            return;
          }

          // ❌ Cas métier gérés par SQL
          switch (res.reason) {
            case 'ALREADY_EXISTS':
              this.toast.show(
                'A control already exists for this Zwift ID.',
                'error'
              );
              break;

            case 'INVALID_ZWIFT_ID':
              this.toast.show(
                'Invalid Zwift ID. Please check and try again.',
                'error'
              );
              break;

            default:
              this.toast.show(
                'Unable to submit your verification. Please try again.',
                'error'
              );
              break;
          }

          this.waiting.set(false);
        },
        error: (err) => {
          console.error(err);
          this.waiting.set(false);
          this.toast.show('An error occurred. Please try again.', 'error');
        }
      });
    }
  }

  logout(): void {
    localStorage.removeItem('zwiftIdLinked');
    localStorage.removeItem('isValidated');
    this.router.navigate(['/']);
  }
}
