import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { SharedService } from '../../../core/services/shared.service';
import { TimeZoneService } from '../../../shared/services/timezone.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { AsideImage } from '../aside-image/aside-image';
import { LucideAngularModule, MailIcon, KeyRoundIcon, EyeIcon, EyeOffIcon, UserPlusIcon, LogInIcon, CircleXIcon } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, TranslateModule, AsideImage, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userForm!: FormGroup; 
  myEmail!: string;
  myPassword!: string;
  myPincode!: string;
  myRegister!: string;
  baseUrl: string = environment.ApiBaseUrl;
  pwdHidden = true;
  twofactor = false;

  MailIcon = MailIcon;
  KeyRoundIcon = KeyRoundIcon;
  EyeIcon = EyeIcon;
  EyeOffIcon = EyeOffIcon;
  UserPlusIcon = UserPlusIcon;
  LogInIcon = LogInIcon;
  CircleXIcon = CircleXIcon;

  connecting = signal(false);
  infoMaintenance = signal('');

  messageFromDb: any;
  messageError!: any;

  constructor(
    private sharedService: SharedService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private httpService: HttpClient,
    private router: Router,
    private timeZoneService: TimeZoneService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    this.sharedService.maintenanceMsg().subscribe(
      {
        next: (res: any) => { 
          //console.log(res);
          this.infoMaintenance.set(res.jsonMsg);
        },
        error: (err: any) => { 
          console.log(err);
          console.log(err.message);
        } 
      }
    )
    this.initForm();
    this.userForm.patchValue({ rememberMe: rememberMe });
    // this.sharedService.getIPcountry()
    //   .subscribe((res: any) => {
    //     const blockedCountries = ['CR', 'US', 'UM', 'KP', 'IR'];
    //     if (blockedCountries.includes(res.countryCode)) {
    //       this.router.navigate(['/account/restricted', res.countryCode]);
    //     }
    // });
  }
  showPwd(): void {
    this.pwdHidden = !this.pwdHidden;
  }
  show2FA(): void {
    this.twofactor = !this.twofactor;
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      email: new FormControl(null, { validators: [Validators.required, Validators.email], updateOn: 'change' }),
      password: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
      pincode: new FormControl('', { validators: [Validators.minLength(4), Validators.maxLength(4)], updateOn: 'change' }),
      rememberMe: new FormControl(false)
    });
  }

  get email(): AbstractControl | null {
    return this.userForm.get('email');
  }
  get password(): AbstractControl | null {
    return this.userForm.get('password');
  }
  get pincode(): AbstractControl | null {
    return this.userForm.get('pincode');
  }

  onSubmitForm(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      this.myEmail = formValue.email;
      this.myPassword = formValue.password;
      this.myPincode = formValue.pincode;
  
      this.postData();
      this.connecting.set(true);
    } else {
      //console.log(this.userForm)
      this.toast.show('Please fill in the required fields.', 'error');
      // this.notificationService.open(ToastComponent, {
      //   stacking: true, delay: 3000, autohide: true,
      //   data: { title: 'Error!', text: 'Please fill in the required fields.', colorclass: 'toast-danger' }
      // });
    }
  }

    postData(): void {
      const header = new HttpHeaders();
      header.append('Access-Control-Allow-Origin', '*');
      header.append('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT,OPTIONS');
      header.append('Access-Control-Allow-Methods', 'Origin, X-Requested-With, Content-Type, Accept');

      this.httpService.post(this.baseUrl + 'api/token', { Email: this.myEmail, Password: this.myPassword, Pincode: this.myPincode },
      {
        headers: header
      }).subscribe({
        next: (res: any) => { 
          //console.log(res);
          const accessToken = res.accessToken;
          const refreshToken = res.refreshToken;
          const rememberMe = this.userForm.value.rememberMe;

          if (rememberMe) {
            // Store tokens persistently if "Remember Me" is checked
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('rememberMe', 'true');
            // we remove sessionStorage because we need localStorage
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');           
          } else {
            // Store tokens temporarily (cleared when browser is closed)
            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('refreshToken', refreshToken);
            // we remove localstorage because we need sessionStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('rememberMe');
          }

          // this.hubbalanceService.rebuildConnection();
          this.dashboardStep();
        },
        error: (err: any) => { 
          console.log(err);
          this.connecting.set(false);

          let message: string = err.error?.message ?? 'Unexpected error';
          if (message === 'Invalid credentials') {
            message = this.translate.instant('LOGIN.INVALID_CREDENTIALS');
          } else if (message === 'Invalid two factor'){
            this.pincode?.setErrors({'invalid': true});
          } else if (message === 'Account lockout threshold'){
            message = this.translate.instant('LOGIN.FAILED_LOGIN');
            this.router.navigate(['/account/forgot-password']);
          }
          this.toast.show(message, 'error');
          // this.notificationService.open(ToastComponent, {stacking: true, delay: 3000, autohide: true, 
          //   data: { title: 'Error!', text: message, colorclass: 'toast-danger'} });
        }
      });
    }



    // DASHBOARD tasks

    dashboardStep(): void {
      //this.setSession(); // no more used
      this.getInfos();
    }

    // setSession(): void {
    //   this.sharedService.setSession().subscribe();
    // }
  
    getInfos(): void {
      this.sharedService.getInformations()
      .subscribe({
        next: (res: any) => { 
        //console.log(res);
        if(res) {    
          if (res[0].Maintenance !== '') {
            this.sharedService.MaintenanceSubject.next(res[0].maintenance);
          }

          const dbTz = res[0].timeZone;
          const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          // si rien en base → premier login → store browser tz
          if (!dbTz) {
            this.timeZoneService.set(browserTz);
          }
          // L'utilisateur a défini un fuseau personnalisé → on respecte
          else if (dbTz !== browserTz) {
            localStorage.setItem('user.timezone', dbTz);
            this.timeZoneService.timeZone.set(dbTz); // maj signal uniquement, pas la base
          }
          // sinon : juste synchroniser le signal + localStorage sans API call
          else {
            localStorage.setItem('user.timezone', dbTz);
            this.timeZoneService.timeZone.set(dbTz); // sans déclencher appel inutile
          }

          if(res[0].supportEmail) {
            this.sharedService.SupportEmailSubject.next(res[0].supportEmail);
          }

          if(res[0].roleId > 5) {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/manager']);
          }
        } else {
          this.messageError = 'There is an issue with your session.';
          this.toast.show(this.messageError, 'error');
          // this.notificationService.open(ToastComponent, {stacking: true, delay: 3000, autohide: true, 
          //   data: { title: 'Error!', text: this.messageError, colorclass: 'toast-danger'} });
        }
        },
        error: (err: any) => { 
          console.log(err);
        },
        complete: () => { this.connecting.set(false) }
      });
  
    }
}
