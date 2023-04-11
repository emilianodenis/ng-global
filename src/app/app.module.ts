import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { NewsFeedComponent } from './components/news-feed/news-feed.component'
import { StudentsComponent } from './components/students/students.component'
import { StudentService } from 'src/app/services/students.service'
import { HttpInterceptor } from 'src/app/services/http-interceptor.service'

@NgModule({
  declarations: [AppComponent, NewsFeedComponent, StudentsComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    StudentService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
