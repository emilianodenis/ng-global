import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CharactersComponent } from 'src/app/components/characters/characters.component'
import { ProfessionsComponent } from 'src/app/components/professions/professions.component'

const routes: Routes = [
  { path: 'characters', component: CharactersComponent },
  { path: 'professions', component: ProfessionsComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' }, // redirect to `app-component`
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
