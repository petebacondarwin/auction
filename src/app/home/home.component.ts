import { Component } from '@angular/core';
import { AppComponent } from 'app/app.component';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(public app: AppComponent) {
    app.setPageTitle('Home');
  }
}
