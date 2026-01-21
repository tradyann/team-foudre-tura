import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { CypherService } from '../../../core/services/cypher.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { AsideImage } from '../aside-image/aside-image';
import { LucideAngularModule, MailIcon, KeyRoundIcon, EyeIcon, EyeOffIcon, UserPlusIcon, LogInIcon, CircleXIcon, ThumbsUpIcon } from 'lucide-angular';


@Component({
  selector: 'app-forgot-password',
  standalone: true, 
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule, 
    ReactiveFormsModule,
    TranslateModule,
    AsideImage, 
    LucideAngularModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  userForm!: FormGroup;

  baseUrl: string = environment.ApiBaseUrl;

  readonly isDone = signal(false);
  readonly mailForgotten = signal(false);
  readonly waiting = signal(false);

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
    private cypher: CypherService,
    private toast: ToastService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.formBuilder.group(
      { email: new FormControl(null, { validators: [Validators.required, Validators.email],  updateOn: 'blur' }), });
      
  }
  get email(): AbstractControl | null {
    return this.userForm.get('email');
  }

  onSubmitForm(): void {
    this.userForm.markAllAsTouched();
    const formValue = this.userForm.value;
    if (formValue.email === null){
      this.email?.setErrors({ 'required': true });
    } else if (!formValue.email.includes('@') || !formValue.email.includes('.')){
      this.email?.setErrors({ 'email': true });
    } else if (this.userForm.valid){
      this.waiting.set(true);
      this.forgotPassword(formValue.email);
    }
  }
  displaySupport(): void {
    this.mailForgotten.set(!this.mailForgotten);
  }
  forgotPassword(email: string): void {
    const stampToken = this.cypher.cypherStamped();
    const header = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-API-KEY': stampToken
    });
    this.httpService.post(this.baseUrl + 'api/account/forgot-password', {Email: email, Code: stampToken},
    {
      headers: header,
      //responseType: 'json' // Expect JSON response for error handling
    }).subscribe(
      {
        next: (res: any) => { 
          //console.log(res);
          this.isDone.set(true);
          this.waiting.set(false);
        },
        error: (err: any) => { 
          console.log(err);
          console.log(err.error.message);
          this.waiting.set(false);
          this.toast.show(err.error.message, 'error');
          // this.notificationService.open(ToastComponent, {
          //   stacking: true,
          //   delay: 3000,
          //   autohide: true,
          //   data: { title: 'Error!', text: err.message, colorclass: 'toast-danger' }
          // });
        }
      }
    );
  }
}
