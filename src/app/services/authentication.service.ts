import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { AngularFireDatabase } from '@angular/fire/database'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()

export class AuthenticationService { 
  user : any = null
  userDetails : firebase.User = null 
  displayName : string = ""
  logged : boolean = false
  login : string = "Unknown"

  constructor(private ngZone: NgZone, public afAuth : AngularFireAuth, private router : Router, private db : AngularFireDatabase, private snackBar : MatSnackBar) {
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user == null) {
        this.userDetails = null
        this.logged = false
        this.login = "No"
      }
      else {
        this.userDetails = user
        this.displayName = (this.userDetails.displayName) ? this.userDetails.displayName : this.userDetails.email
        this.logged = true
        this.login = "Yes"
      }
    })
  }

  signInGoogle() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((result) => {
      this.logged = true
      this.db.database.ref(result.user.uid).once("value").then((snapshot) => {
        if (snapshot.val() === null) {
          this.db.database.ref(result.user.uid).set({
            house: "",
            characters: "",
            spells: "",
          })
        }
      })
      this.snackBar.open("Successful Google login", "", { duration: 3000 })
      this.ngZone.run(() => this.router.navigate([""]))
    }).catch((e) => this.snackBar.open(e.message, "OK"))
  }

  signInRegular(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((result) => {
      this.logged = true
      this.db.database.ref(result.user.uid).once("value").then((snapshot) => {
        if (snapshot.val() === null) {
          this.db.database.ref(result.user.uid).set({
            house: "",
            characters: "",
            spells: "",
          })
        }
      })
      this.afAuth.auth.currentUser.sendEmailVerification()
      this.snackBar.open("Please verify your email address.", "", { duration: 3000 })
      this.ngZone.run(() => this.router.navigate([""]))
    }).catch((e) => this.snackBar.open(e.message, "OK"))
  }

  loginRegular(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then((result) => {
      this.logged = true
      if (result.user.emailVerified !== true) {
        this.afAuth.auth.currentUser.sendEmailVerification()
        this.snackBar.open("Sucessful login. Please verify your email address.", "", { duration: 3000 })
      }
      else this.snackBar.open("Successful login", "", { duration: 3000 })
      this.ngZone.run(() => this.router.navigate([""]))
    }).catch((e) => this.snackBar.open(e.message, "OK"))
  }

  isLoggedIn() : boolean {
    return this.logged
  }

  logout() {
    this.logged = false
    this.snackBar.open("Successful logout", "", { duration: 3000 })
    return this.afAuth.auth.signOut().then(() => this.ngZone.run(() => this.router.navigate([""])))
  }

  resetPasswordEmail(email: string) { 
    return this.afAuth.auth.sendPasswordResetEmail(email).then(() => this.snackBar.open("A password reset link has been sent to your email address", "", { duration: 3000 }), (rejectionReason) => this.snackBar.open(rejectionReason, "OK")).catch(e => this.snackBar.open("An error occurred while attempting to reset your password", "OK")).then(() => this.ngZone.run(() => this.router.navigate([""])))
  }

  checkOobCode(mode : string, oobCode : string) {
    switch(mode) {
      case "resetPassword":
        return this.afAuth.auth.verifyPasswordResetCode(oobCode).catch(e => {
          this.snackBar.open(e.message, "OK")
          this.ngZone.run(() => this.router.navigate([""]))
        })
      case "verifyEmail":
        return this.afAuth.auth.applyActionCode(oobCode).then(() => this.snackBar.open("Email has been verified", "", { duration: 3000 })).catch(e => this.snackBar.open(e.message, "OK")).then(() => this.ngZone.run(() => this.router.navigate([""])))
      default:
        this.snackBar.open("URL is not valid", "OK")
        this.ngZone.run(() => this.router.navigate([""]))
        break
    }
  }

  resetPassword(oobCode : string, password : string) {
    return this.afAuth.auth.confirmPasswordReset(oobCode, password).then(() => {
      this.snackBar.open("New password has been saved", "", { duration: 3000 })
      this.ngZone.run(() => this.router.navigate(["/login"]))
    }).catch(e => this.snackBar.open(e.message, "OK"))
  }
}