import { Component, OnInit, NgZone } from '@angular/core'
import { AuthenticationService } from '../../services/authentication.service'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent  {
  email : string = ""
  password : string = ""

  constructor(private ngZone: NgZone, private authService : AuthenticationService, private router : Router, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.authService.afAuth.auth.onAuthStateChanged((user) => {
      if (user != null) {
        this.snackBar.open("You are already logged in", "OK")
        this.ngZone.run(() => this.router.navigate([""]))
      }
    })
  }
}