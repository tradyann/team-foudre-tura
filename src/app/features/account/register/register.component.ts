import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService } from '../account.service';
import { CommonModule } from '@angular/common';

import { CypherService } from '../../../core/services/cypher.service';
import { environment } from '../../../../environments/environment';
import { AsideImage } from '../aside-image/aside-image';
import { LucideAngularModule, MailIcon, KeyRoundIcon, EyeIcon, EyeOffIcon, UserPlusIcon, ThumbsUpIcon, CircleXIcon } from 'lucide-angular';
import { ToastService } from '../../../shared/toast/toast.service';


@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, AsideImage, LucideAngularModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;
  myEmail!: string;
  myPassword!: string;
  baseUrl: string = environment.ApiBaseUrl;
  guid: string | null = null;
  idParent: string | null = null;
  roleName: string | null = null;
  affiliateId: string | null = null;

  MailIcon = MailIcon;
  KeyRoundIcon = KeyRoundIcon;
  EyeIcon = EyeIcon;
  EyeOffIcon = EyeOffIcon;
  UserPlusIcon = UserPlusIcon;
  ThumbsUpIcon = ThumbsUpIcon;
  CircleXIcon = CircleXIcon;

  isRegistered = signal(false);
  linkInvalid = signal(false);
  wait = signal(false);

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private httpService: HttpClient,
    private accountService: AccountService,
    private toast: ToastService,
    private cypher: CypherService) { }

  pwdHidden = true;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.guid = params.get('guid');
      if (this.guid) {
        //console.log('GUID:', this.guid);
        this.getDatas(this.guid);
      } else {
        this.affiliateId = localStorage.getItem('affId'); // affiliateId
      }
    });
    this.initForm();
  }

  getDatas(id: string): void {
    this.accountService.getRegistrationCode(id).subscribe({
      next: (res: any) => {
        //console.log(res);
        if (JSON.stringify(res) !== '[]' && res.returnValue1 !== null && res.returnValue2 !== null) {
          this.idParent = res.returnValue1;
          this.roleName = res.returnValue2;
          console.log('roleName: '+this.roleName);
          console.log('idParent: '+this.idParent);

          // if(this.roleName === 'operator') {

          // } else if (this.roleName === 'whitelabel') {
            
          // } else if (this.roleName === 'whitelabel') {
            
          // }


          // if (this.statusResponse === 'already_registered') {
          //   this.linkInvalid = true;
          //   this.userForm.get('email')?.disable();
          //   this.userForm.get('password')?.disable();
          // } else if(this.statusResponse === 'option2') {
          //   alert('You have an agent, but you must choose your own email and password')
          // } else if(this.statusResponse === 'option3') {
          //   alert('You have an agent, but you must choose your own email and password')
          // }


        } else {
          // redirect to help center with agent
          // this.router.navigate(['/user/information/1']);
          // normal registration we do not do anything
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      terms: [null, Validators.required]
    });
    // this.httpService.get("https://cloudflare-quic.com/b/headers").subscribe({
    //   next: (res: any) => {
    //     if (['CR', 'US', 'UM', 'KP', 'IR'].includes(res.headers['Cf-Ipcountry'])) {
    //       this.router.navigate(['/account/restricted', res.headers['Cf-Ipcountry']]);
    //     }
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   }
    // });
  }

  get email(): AbstractControl | null {
    return this.userForm.get('email');
  }
  get password(): AbstractControl | null {
    return this.userForm.get('password');
  }
  get terms(): AbstractControl | null {
    return this.userForm.get('terms');
  }

  onSubmitForm(): void {
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      this.wait.set(false);
      return;
    }

    this.wait.set(true);
    const { email, password } = this.userForm.value;

    let message: string = '';

    // Password validation checks
    if (password?.length < 8) {
      message = 'Password must be at least 8 characters long.';
    } else if (password?.length > 19) {
      message = 'Password must be less than 20 characters long.';
    } else if (!/[A-Z]/.test(password)) {
      message = 'Password must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(password)) {
      message = 'Password must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(password)) {
      message = 'Password must contain at least one digit.';
    }

    // Display notification if there is an error message
    if (message) {
      this.toast.show(message, 'error');
      // this.notificationService.open(ToastComponent, {
      //   stacking: true,
      //   delay: 3000,
      //   autohide: true,
      //   data: { title: 'Error!', text: message, colorclass: 'toast-danger' }
      // });
      this.wait.set(false);
      return; // Stop form submission if validation fails
    }
    this.postData(email, password);
  }
  showPwd(): void {
    this.pwdHidden = !this.pwdHidden;
  }

  postData(email: string, password: string): void {
    const stampToken = this.cypher.cypherStamped();
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-KEY': stampToken
    });
    
    let code = this.idParent;
    if(this.affiliateId) {
      code = this.affiliateId
    }

    this.httpService.post(this.baseUrl + 'api/account/register', { Email: email, Password: password, Code: code }, {
      headers: header,
      responseType: 'json' // Expect JSON response for error handling
    }).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res?.success) {
          this.isRegistered.set(true);
          this.toast.show('Account created', 'success');
        } else {
          this.toast.show('Unexpected response from server', 'error');
          // this.notificationService.open(ToastComponent, {
          //   stacking: true,
          //   delay: 3000,
          //   autohide: true,
          //   data: { title: 'Error!', text: 'Unexpected response from server', colorclass: 'toast-danger' }
          // });
        }
      },
      error: (err: any) => {
        if (err.status === 409) {
          // Email already taken
          this.email?.setErrors({ emailTaken: true });
          this.toast.show(err.error?.message, 'error');
          // this.notificationService.open(ToastComponent, {
          //   stacking: true,
          //   delay: 3000,
          //   autohide: true,
          //   data: { title: 'Email Taken', text: err.error?.message, colorclass: 'toast-danger' }
          // });
        } else {
          // Other errors
          this.toast.show(err.message, 'error');
          // this.notificationService.open(ToastComponent, {
          //   stacking: true,
          //   delay: 3000,
          //   autohide: true,
          //   data: { title: 'Error!', text: err.message, colorclass: 'toast-danger' }
          // });
        }
        this.wait.set(false);
        
      }
    });
  }

}
