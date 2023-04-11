import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatListModule } from '@angular/material/list'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NewsFeedComponent } from 'src/app//components/news-feed/news-feed.component'
import { StudentsComponent } from 'src/app//components/students/students.component'
import { DelayInterceptor } from 'src/app/services/interceptors/delay-interceptor.service'
import { PathInterceptor } from 'src/app/services/interceptors/http-interceptor.service'
import { StudentService } from 'src/app/services/students.service'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent, NewsFeedComponent, StudentsComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatListModule,
  ],
  providers: [
    StudentService,
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
