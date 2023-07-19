import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  
  toggler: boolean = true;

  toggle() {
    this.toggler=!this.toggler
  }
}
