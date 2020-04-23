import { Component } from '@angular/core'
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

  constructor(private api : ApiService, private storage : DataService, public authService : AuthenticationService) {}

  logout(sidenav : any) : void {
    sidenav.toggle()
    this.authService.logout()
  }

  loading() : boolean {
    return this.storage.updating || this.authService.login == "Unknown"
  }
}
