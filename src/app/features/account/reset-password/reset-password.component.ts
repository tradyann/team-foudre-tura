import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../account.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { CypherService } from '../../../core/services/cypher.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { AsideImage } from '../aside-image/aside-image';
import { LucideAngularModule, MailIcon, KeyRoundIcon, EyeIcon, EyeOffIcon, UserPlusIcon, LogInIcon, CircleXIcon, ThumbsUpIcon } from 'lucide-angular';

@Component({
  selector: 'app-reset-password',
  standalone: true, 
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, TranslateModule, AsideImage, LucideAngularModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  userForm!: FormGroup;

  baseUrl: string = environment.ApiBaseUrl;

  myEmail = signal('');
  myPassword = signal('');
  myCode = signal('');
  mailUnreceived = signal(false);
  isError = signal(false);
  isClicked = signal(false);

  MailIcon = MailIcon;
  KeyRoundIcon = KeyRoundIcon;
  EyeIcon = EyeIcon;
  EyeOffIcon = EyeOffIcon;
  UserPlusIcon = UserPlusIcon;
  LogInIcon = LogInIcon;
  CircleXIcon = CircleXIcon;
  ThumbsUpIcon = ThumbsUpIcon;

  constructor(
    private httpService: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private cypher: CypherService,
    private toast: ToastService) { }

  pwdHidden = true;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(routeParam => this.getDatas(routeParam['id']));
    this.initForm();
  }
  getDatas(id: string): void {
    this.accountService.getResetCode(id).subscribe({
      next: (res: any) => {
        //console.log(res);
        if (JSON.stringify(res) !== '[]' && res.returnValue1 !== null) {
          this.myEmail.set(res.returnValue1);
          this.myCode.set(res.returnValue2);
        } else {
          this.myCode.set('none');
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  showPwd(): void {
    this.pwdHidden = !this.pwdHidden;
  }
  
  initForm(): void {
    this.userForm = this.formBuilder.group({
      password: new FormControl(null, { validators: [Validators.required, Validators.minLength(6), Validators.maxLength(19)], updateOn: 'change' })
    });
  }

  get password(): AbstractControl | null {
    return this.userForm.get('password');
  }

  onSubmitForm(): void {
    this.userForm.markAllAsTouched();

    const formValue = this.userForm.value;
    this.myPassword.set(formValue.password);
    const pwd = this.myPassword();

    let message: string = '';
    if (pwd.length < 8) {
      message = 'Password must be at least 8 characters long.';
    } else if (pwd.length > 19) {
      message = 'Password must be less than 20 characters long.';
    } else if (!/[A-Z]/.test(pwd)) {
      message = 'Password must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(pwd)) {
      message = 'Password must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(pwd)) {
      message = 'Password must contain at least one digit.';
    }

    // Display notification if there is an error message
    if (message) {
      this.password?.setErrors({ invalid: true, message: message });
      this.toast.show(message, 'error');
      // this.notificationService.open(ToastComponent, {
      //   stacking: true,
      //   delay: 3000,
      //   autohide: true,
      //   data: { title: 'Error!', text: message, colorclass: 'toast-danger' }
      // });
      return; // Stop form submission if validation fails
    }

    if (!this.isClicked()) {
      this.isClicked.set(true);
      this.resetPassword();
    }
  }

  resetPassword(): void {
    const stampToken = this.cypher.cypherStamped();
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-KEY': stampToken
    });

    this.httpService.post(this.baseUrl + 'api/account/reset-password', {
      Email: this.myEmail(),
      Password: this.myPassword(),
      Code: this.myCode()
    }, {
      headers: header
    }).subscribe({
      next: (res: any) => {
        this.isClicked.set(false);
        if (res?.success) {
          this.toast.show(res.success, 'success');
          this.router.navigate(['/account/login']);
        } else {
          const msg = res?.error || 'Unknown error';
          this.toast.show(msg, 'error');
        }
      },
      error: (err: any) => {
        console.error(err);
        this.isClicked.set(false);
        this.toast.show('An error occurs. Please try again.', 'error');
      }
    });
  }
}
