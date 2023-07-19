import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToasterService } from '../services/toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    acno: [
      '',
      [
        Validators.required,
        Validators.pattern('[0-9]*'),
        Validators.minLength(3),
      ],
    ],
    pswd: [
      '',
      [
        Validators.required,
        Validators.pattern('[a-zA-z0-9]*'),
        Validators.minLength(4),
      ],
    ],
  });

  isLoggedIn: boolean = false;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private loginRouter: Router,
    private toastr: ToasterService
  ) {}

  login() {
    if (this.loginForm.valid) {
      let acno = this.loginForm.value.acno;
      let pswd = this.loginForm.value.pswd;
      this.api.login(acno, pswd).subscribe({
        next: (res: any) => {
          const { loginUser, token } = res;
          this.isLoggedIn = true;
          localStorage.setItem('loggedinUserName', loginUser.username);
          localStorage.setItem('loggedinUserAcno', loginUser.acno);
          localStorage.setItem('token', token);
          setTimeout(() => {
            this.isLoggedIn = false;
            this.loginRouter.navigateByUrl('user/dashboard');
            this.toastr.showSuccess(
              `Welcome '${loginUser.username}'`,
              'Logged in Successfully'
            );
          }, 3000);
        },
        error: (err: any) => {
          this.toastr.showError(err.error, 'Error');
          setTimeout(() => {
            this.loginForm.reset();
          }, 2000);
        },
      });
    } else {
      this.toastr.showWarning('Invalid Inputs', 'Warning');
    }
  }
}
