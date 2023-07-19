import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from '../services/toastr.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = this.fb.group({
    uName: [
      '',
      [
        Validators.required,
        Validators.pattern('[a-zA-z ]*'),
        Validators.minLength(2),
      ],
    ],
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

  constructor(
    private fb: FormBuilder,
    private toaster: ToasterService,
    private api: ApiService,
    private registerRouter: Router
  ) {}


  register() {
    if (this.registerForm.valid) {
      let user = this.registerForm.value.uName;
      let acno = this.registerForm.value.acno;
      let pswd = this.registerForm.value.pswd;
      this.api.register(user, acno, pswd).subscribe({
        next: (res: any) => {
          console.log(res);
          this.toaster.showSuccess(
            `${res.username} registered successfully`,
            'Success'
          );
          setTimeout(() => {
            this.registerRouter.navigateByUrl('user/login');
          }, 3000);
        },
        error: (err: any) => {
          console.log(err);
          this.toaster.showError(`${err.error}`, 'Failed');
          setTimeout(() => {
            this.registerForm.reset();
          }, 3000);
        },
      });
    } else {
      this.toaster.showWarning('Invalid Form', 'Warning');
    }
  }
}
