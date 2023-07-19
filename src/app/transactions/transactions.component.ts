import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToasterService } from '../services/toastr.service';

import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  allTransactions: any = [];
  search_key: string = '';
  constructor(private api: ApiService, private toastr: ToasterService) {}

  ngOnInit(): void {
    this.api.transactions().subscribe({
      next: (res: any) => {
        this.allTransactions = res;
      },
      error: (err: any) => {
        this.toastr.showError(err.error, 'Failed');
      },
    });
  }

  generatePdf() {
    const pdf = new jspdf();
    // autoTable(pdf,{
    // head : [[]]
    // body : [[]]
    // })

    autoTable(pdf, { html: '#userDetail' });

    pdf.output('dataurlnewwindow', { filename: 'Mini-statement.pdf'});
    // pdf.save('ministatement.pdf');
  }
}
