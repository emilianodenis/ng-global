import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatSelectModule } from '@angular/material/select'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NewsFeedComponent } from 'src/app//components/news-feed/news-feed.component'
import { AppRoutingModule } from 'src/app/app-routing.module'
import { AppComponent } from 'src/app/app.component'
import { CharactersComponent } from 'src/app/components/characters/characters.component'
import { ProfessionsComponent } from 'src/app/components/professions/professions.component'
import { DelayInterceptor } from 'src/app/services/interceptors/delay-interceptor.service'
import { PathInterceptor } from 'src/app/services/interceptors/http-interceptor.service'

@NgModule({
  declarations: [
    AppComponent,
    CharactersComponent,
    NewsFeedComponent,
    ProfessionsComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PathInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DelayInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
