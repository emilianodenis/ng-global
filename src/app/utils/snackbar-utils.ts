import { MatSnackBarConfig } from '@angular/material/snack-bar'

export function getSuccessSnackbarOptions(): MatSnackBarConfig {
  return {
    duration: 2500,
    panelClass: 'snackbar-success',
    verticalPosition: 'top',
  }
}

export function getFailureSnackbarOptions(): MatSnackBarConfig {
  return {
    duration: 5000,
    panelClass: 'snackbar-failure',
    verticalPosition: 'top',
  }
}
