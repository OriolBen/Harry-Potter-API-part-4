import { Injectable } from '@angular/core'
import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { LoadingComponent } from '../components/loading/loading.component'
import { Observable, Subject } from 'rxjs'
import { mapTo, scan, map, mergeMap } from 'rxjs/operators'
import { ApiService } from './api.service'
import { DataService } from './data.service'
import { AuthenticationService } from './authentication.service'

@Injectable()
export class LoadingService {
  spinnerRef : OverlayRef = this.cdkSpinnerCreate()
  spin : Subject<boolean> = new Subject()
  state : boolean = false

  constructor(private overlay: Overlay, private api : ApiService, private storage : DataService, public authService : AuthenticationService) {
    this.spin.asObservable().pipe(
      map(val => val ? 1 : -1 ),
      scan((acc, one) => (acc + one) >= 0 ? acc + one : 0, 0)
    ).subscribe((res) => {
      if (res === 1) this.showSpinner()
      else if (res == 0) this.spinnerRef.hasAttached() ? this.stopSpinner() : null;
    })
  }

  cdkSpinnerCreate() {
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    })
  }

  showSpinner() : void {
    this.spinnerRef.attach(new ComponentPortal(LoadingComponent))
  }

  stopSpinner() : void {
    this.spinnerRef.detach();
  }

  check() : void {
    let bool : boolean = this.storage.updating || this.authService.login == "Unknown"
    if (this.state != bool) {
      this.state = bool
      this.spin.next(this.state)
    }
  }
}