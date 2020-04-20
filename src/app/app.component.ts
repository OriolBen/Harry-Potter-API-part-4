import { Component, OnInit, NgZone } from '@angular/core'
import { AuthenticationService } from './services/authentication.service'

@Component({
  selector : 'my-app',
  templateUrl : './app.component.html',
  styleUrls : [ './app.component.css' ]
})

export class AppComponent {
  message : string = ""
  logged : boolean = false

  constructor(private ngZone: NgZone, public authService: AuthenticationService) {}

  ngOnInit() {
    this.authService.afAuth.auth.onAuthStateChanged((user) => {
      this.ngZone.run(() => {
        if (user != null) this.logged = true
        else this.logged = false
      })
    })
  }
}
