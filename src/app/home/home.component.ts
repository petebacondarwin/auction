import { Component } from '@angular/core';
import { AppComponent } from 'app/app.component';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(app: AppComponent) {
    app.setPageTitle('Home');
  }
}