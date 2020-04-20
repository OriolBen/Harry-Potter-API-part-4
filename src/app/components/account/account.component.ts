import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {
  password : string = ""
  verified : boolean = false
  mode : string = ""
  oobCode : string = ""

  constructor(private authService : AuthenticationService, private route : ActivatedRoute, private router : Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode']
      this.oobCode = params['oobCode']
      this.authService.checkOobCode(this.mode, this.oobCode)
    })
  }
}