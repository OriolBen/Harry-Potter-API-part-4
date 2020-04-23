import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core'
import { ApiService } from './services/api.service'
import { DataService } from './services/data.service'
import { AuthenticationService } from './services/authentication.service'

@Component({
  selector : 'my-app',
  templateUrl : './app.component.html',
  styleUrls : [ './app.component.css' ]
})

export class AppComponent {
  message : string = ""
  logged : boolean = false

  constructor(private cdRef : ChangeDetectorRef, private ngZone : NgZone, private api : ApiService, private storage : DataService, public authService : AuthenticationService) {}

  ngOnInit() {
    this.authService.afAuth.auth.onAuthStateChanged((user) => {
      this.ngZone.run(() => {
        if (user != null) this.logged = true
        else this.logged = false
      })
    })
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  logout(sidenav : any) : void {
    sidenav.toggle()
    this.authService.logout()
  }

  loading() : boolean {
    //this.cdr.detectChanges()
    if (this.storage.uploading || this.api.calling || this.authService.login == "Unknown") {
      return true
    }
    else {
      return false
    }
  }
}
