import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToasterService } from '../services/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  loggedinUserName: string = '';
  balance: number = 0;
  balanceSuccessStatus: boolean = false;
  transferForm = this.fb.group({
    acno: [
      '',
      [
        Validators.required,
        Validators.pattern('[0-9]*'),
        Validators.minLength(3),
      ],
    ],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
  });

  constructor(
    private api: ApiService,
    private toastr: ToasterService,
    private fb: FormBuilder,
    private navigate: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('loggedinUserName')) {
      this.loggedinUserName = localStorage.getItem('loggedinUserName') || '';
    }
  }

  getBalance() {
    const acno = localStorage.getItem('loggedinUserAcno');

    this.api.getBalance(acno).subscribe({
      next: (res: any) => {
        this.balanceSuccessStatus = true;
        this.balance = res;
      },
      error: (err: any) => {
        this.balanceSuccessStatus = false;
        this.toastr.showWarning(err.error, 'Warning');
      },
    });
  }

  fundTransfer() {
    if (this.transferForm.valid) {
      let creditAcno = this.transferForm.value.acno;
      let amount = this.transferForm.value.amount;

      this.api.fundtransfer(creditAcno, amount).subscribe({
        next: (res: any) => {
          this.toastr.showSuccess(res, 'Success');
        },
        error: (err: any) => {
          this.toastr.showError(err.error, 'Error');
        },
      });
    } else {
      this.toastr.showWarning('Invalid form', 'Warning');
    }
  }

  deleteAcno() {
    this.api.deleteAccount().subscribe({
      next: (res: any) => {
        this.toastr.showSuccess(res, 'Success');
        this.logoutAcno(1);
      },
      error: (err: any) => {
        this.toastr.showError(err.message, 'Error');
      },
    });
  }

  logoutAcno(n: number) {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedinUserAcno');
    localStorage.removeItem('loggedinUserName');
    if (n === 0) {
      this.toastr.showWarning('Logging Out', 'Success');
    }
    setTimeout(() => {
      this.navigate.navigateByUrl('');
    }, 2000);
  }
}
