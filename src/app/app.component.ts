import { Component } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DataService } from 'src/app/services/data.service'
import { getFailureSnackbarOptions, getSuccessSnackbarOptions } from 'src/app/utils/snackbar-utils'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private dataService: DataService, private snackBar: MatSnackBar) {}

  loadData() {
    this.dataService.loadData().subscribe({
      next: () => {
        this.snackBar.open('Data generated successfully', undefined, getSuccessSnackbarOptions())
      },
      error: (err) => {
        this.snackBar.open(
          'An error happened while trying to generate data. Please try again in a few minutes',
          undefined,
          getFailureSnackbarOptions(),
        )
        console.log(err)
      },
    })
  }
}
