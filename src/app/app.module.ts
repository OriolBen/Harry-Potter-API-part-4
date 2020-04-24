// Modules
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { AppRoutingModule } from './app-routing.module'
import { OverlayModule } from '@angular/cdk/overlay';

// Firebase
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireDatabaseModule } from '@angular/fire/database'

// Services
import { ApiService } from './services/api.service'
import { DataService } from './services/data.service'
import { AuthenticationService } from './services/authentication.service'
import { LoadingService } from './services/loading.service'

// Components
import { AppComponent } from './app.component'
import { HomeComponent } from './components/home/home.component'
import { CharactersComponent } from './components/characters/characters.component'
import { CharacterComponent } from './components/character/character.component'
import { HousesComponent } from './components/houses/houses.component'
import { HouseComponent } from './components/house/house.component'
import { SpellsComponent } from './components/spells/spells.component'
import { FavouritesComponent } from './components/favourites/favourites.component'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'
import { ResetComponent } from './components/reset/reset.component'
import { AccountComponent } from './components/account/account.component'
import { LoadingComponent } from './components/loading/loading.component'

// Angular Material
import { MaterialModule } from './material.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

// Font Awesome
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDcp3ojggM75TPgdLz6zUAaZrlWLIetEiA",
      authDomain: "harry-potter-api-e764c.firebaseapp.com",
      databaseURL: "https://harry-potter-api-e764c.firebaseio.com",
      projectId: "harry-potter-api-e764c",
      storageBucket: "harry-potter-api-e764c.appspot.com",
      messagingSenderId: "375890053637",
      appId: "1:375890053637:web:1f83020707079f55e2aa6c"
    }),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MaterialModule,
    FontAwesomeModule,
    OverlayModule
  ],
  declarations: [ 
    AppComponent,
    HomeComponent,
    CharactersComponent,
    HousesComponent,
    SpellsComponent,
    CharacterComponent,
    HouseComponent,
    FavouritesComponent,
    LoginComponent,
    RegisterComponent,
    ResetComponent,
    AccountComponent,
    LoadingComponent
  ],
  bootstrap: [ 
    AppComponent
  ],
  providers: [
    ApiService,
    DataService,
    AngularFireAuth,
    AuthenticationService,
    LoadingService
  ],
  entryComponents: [
    LoadingComponent
  ]
})

export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}
