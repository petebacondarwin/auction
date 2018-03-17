import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from 'app/animations';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()],
  host: {'[@moveIn]': ''}
})
export class AdminComponent implements OnInit {
  name: any;
  state: string = '';

  constructor(public afAuth: AngularFireAuth,private router: Router) {  }

  logout() {
     this.afAuth.auth.signOut();
     this.router.navigateByUrl('/login');
  }

  ngOnInit() {
  }
}
