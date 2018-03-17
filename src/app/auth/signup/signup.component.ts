import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { moveIn, fallIn } from 'app/animations';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]': ''}
})
export class SignupComponent implements OnInit {

  error: any;

  constructor(public afAuth: AngularFireAuth,private router: Router) {

  }

  onSubmit(formData) {
    if(formData.valid) {
      console.log(formData.value);
      this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(formData.value.email, formData.value.password)
      .then((credential: auth.UserCredential) => credential.user.updateProfile({ displayName: formData.value.name, photoURL: null }))
      .then(() => this.router.navigate(['/members']))
      .catch(err => this.error = err);
    }
  }

  ngOnInit() {
  }

}
