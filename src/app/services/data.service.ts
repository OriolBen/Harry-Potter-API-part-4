import { Inject, Injectable, InjectionToken } from '@angular/core'
import { AuthenticationService } from './authentication.service'
import { AngularFireDatabase } from '@angular/fire/database'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export const LOCAL_DATA = new InjectionToken<Storage>('Local Data', {
  providedIn: 'root',
  factory: () => localStorage
})

export interface Favourite {
  house : string,
  characters : Array<string>,
  spells : Array<string>
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  local : Favourite = {
    "house": "",
    "characters": [],
    "spells": []
  }
  online : Favourite = {
    "house": "",
    "characters": [],
    "spells": []
  }
  updating : boolean = true

  constructor(@Inject(LOCAL_DATA) public data : Storage, private db : AngularFireDatabase, public authentication : AuthenticationService) {
    let exists = this.data.getItem('Harry Potter API')
    if (exists) this.local = JSON.parse(exists)
    this.authentication.afAuth.auth.onAuthStateChanged((user) => {
      if (user != null) {
        this.getFavouriteOnline().subscribe((data) => {
          this.online.characters = Object.values(data[0])
          this.online.house = data[1]
          this.online.spells = Object.values(data[2])
        })
      }
      this.updating = false
    })
  }

  getFavouriteLocal() : Favourite {
    return this.local
  }

  getFavouriteOnline() : Observable<any> {
    return this.db.list(this.authentication.userDetails.uid).valueChanges()
  }

  addFavouriteLocal(category : string, id : string) : void {
    this.updating = true
    switch (category) {
      case "house":
        this.local.house = id
        break
      default:
        this.local[category].push(id)
        break
    }
    this.data.setItem('Harry Potter API', JSON.stringify(this.local))
    this.updating = false
  }

  addFavouriteOnline(category : string, id : string) : void {
    this.updating = true
    switch (category) {
      case "house":
        this.db.database.ref(this.authentication.userDetails.uid).update({
          house: id
        }).then(() => {
          this.online.house = id
          this.updating = false
        })
        break
      default:
        this.db.database.ref(this.authentication.userDetails.uid + "/" + category).update({
          [id]: id
        }).then(() => this.updating = false)
        break
    }
  }

  removeFavouriteLocal(category : string, id : string) : void {
    this.updating = true
    switch (category) {
      case "house": 
        this.local.house = ""
        break
      default:
        for (let i = 0; i < this.local[category].length; i++) {
          if (this.local[category][i] == id) this.local[category].splice(i, 1)
        }
        break
    }
    this.data.setItem('Harry Potter API', JSON.stringify(this.local))
    this.updating = false
  }

  removeFavouriteOnline(category : string, id : string) : void {
    this.updating = true
    switch (category) {
      case "house": 
        this.db.database.ref(this.authentication.userDetails.uid).update({
          house: ""
        }).then(() => this.updating = false)
        break
      default:
        if (this.online[category].length != 1) this.db.database.ref(this.authentication.userDetails.uid + "/" + category + "/" + id).remove().then(() => this.updating = false)
        else this.db.database.ref(this.authentication.userDetails.uid).update({
          [category]: ""
        }).then(() => this.updating = false)
        break
    }
  }

  upload() : void {
    this.updating = true
    let characters = this.local.characters.reduce(function(o, val) {
      o[val] = val
      return o
    }, {})
    let spells = this.local.spells.reduce(function(o, val) {
      o[val] = val
      return o
    }, {})
    this.db.database.ref(this.authentication.userDetails.uid).set({
      house: this.local.house,
      characters: characters,
      spells: spells,
    }).then(() => this.updating = false)
  }
}