import { Component, OnInit } from '@angular/core'
import { ApiService } from './services/api.service'
import { DataService } from './services/data.service'
import { AuthenticationService } from './services/authentication.service'
import { LoadingService } from './services/loading.service'

@Component({
  selector : 'my-app',
  templateUrl : './app.component.html',
  styleUrls : [ './app.component.css' ]
})

export class AppComponent {
  message : string = ""

  constructor(private loading : LoadingService, private api : ApiService, private storage : DataService, public authService : AuthenticationService) {}

  logout(sidenav : any) : void {
    sidenav.toggle()
    this.authService.logout()
  }
}
