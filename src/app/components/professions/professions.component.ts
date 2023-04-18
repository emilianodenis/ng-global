import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute } from '@angular/router'
import { EditState } from 'src/app/model/edit-state'
import { Profession } from 'src/app/model/profession'
import { ProfessionsService } from 'src/app/services/professions.service'
import { isNullOrUndefined } from 'src/app/utils/object-utils'
import {
  getFailureSnackbarOptions,
  getSuccessSnackbarOptions,
} from 'src/app/utils/snackbar-utils'
import { isNullOrEmpty } from 'src/app/utils/string-utils'

@Component({
  selector: 'app-professions',
  templateUrl: './professions.component.html',
  styleUrls: ['./professions.component.scss'],
})
export class ProfessionsComponent implements OnInit {
  summary: Profession[] = []
  editedProfession?: Profession
  selectedProfession?: Profession
  state = EditState.read
  title = ''

  get creationMode(): boolean {
    return this.state === EditState.create
  }

  get editionMode(): boolean {
    return this.state === EditState.edit
  }

  get isReadMode(): boolean {
    return this.state === EditState.read
  }

  get canCreate(): boolean {
    return this.isReadMode
  }

  get canSubmit(): boolean {
    return (
      !isNullOrUndefined(this.editedProfession) &&
      !isNullOrEmpty(this.editedProfession!.description)
    )
  }

  constructor(
    private professionService: ProfessionsService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadInitialData(true)
    this.activatedRoute.queryParamMap.subscribe((p) => {
      if (p.has('id')) {
        this.loadProfession(p.get('id')!)
      }
    })
  }

  setTitle(): void {
    if (this.isReadMode) this.title = ''
    else if (this.creationMode) this.title = 'Add new profession'
    else this.title = `Modify ${this.editedProfession?.description}`
  }

  loadInitialData(shouldLoadProfession = false) {
    this.professionService.getProfessions().subscribe({
      next: (professions) => {
        this.summary = professions
        if (shouldLoadProfession) {
          const params = this.activatedRoute.snapshot.queryParams
          if (params['id']) {
            this.loadProfession(params['id'])
          }
        }
      },
      error: (err) => {
        this.snackBar.open(
          'Could not retrieve list of professions',
          undefined,
          getFailureSnackbarOptions()
        )
        console.log(err)
      },
    })
  }

  loadProfession(id: string) {
    if (isNullOrEmpty(id)) return

    const professionId = Number.parseInt(id)

    if (isNaN(professionId)) return

    const professionToLoad = this.summary.find((c) => c.id === professionId)
    if (!professionToLoad) return

    this.professionService.getProfession(professionToLoad.id).subscribe({
      next: (profession) => {
        this.state = EditState.edit
        this.editedProfession = profession
        this.selectedProfession = professionToLoad
        this.setTitle()
      },
      error: (err) => {
        this.resetState()
        this.snackBar.open(
          `Could not retrieve profession to edit (${professionToLoad.description})`,
          undefined,
          getFailureSnackbarOptions()
        )
        console.log(err)
      },
    })
  }

  deleteProfession(id: number) {
    this.professionService.deleteProfession(id).subscribe({
      next: () => {
        this.loadInitialData()
        this.snackBar.open(
          'Profession deleted successfully',
          undefined,
          getSuccessSnackbarOptions()
        )
      },
      error: (err) => {
        this.snackBar.open(
          'An error happened while trying to delete the profession. Please try again in a few minutes',
          undefined,
          getFailureSnackbarOptions()
        )
        console.log(err)
      },
    })
  }

  submit(): void {
    if (!this.canSubmit) return
    let httpAction$ = this.editionMode
      ? this.professionService.udpateProfession(
          this.editedProfession!.id,
          this.editedProfession!
        )
      : this.professionService.createProfession(this.editedProfession!)
    httpAction$.subscribe({
      next: (profession) => {
        this.snackBar.open(
          'Profession submitted successfully',
          undefined,
          getSuccessSnackbarOptions()
        )
        this.loadInitialData()
      },
      error: (err) => {
        this.snackBar.open(
          'An error happened while trying to submit the profession. Please try again in a few minutes',
          undefined,
          getFailureSnackbarOptions()
        )
        console.log(err)
      },
      complete: () => this.resetState(),
    })
  }

  createNewProfession(): void {
    this.state = EditState.create
    this.editedProfession = {} as Profession
    this.setTitle()
  }

  cancelEditing(): void {
    this.resetState()
  }

  private resetState(): void {
    this.editedProfession = undefined
    this.selectedProfession = undefined
    this.state = EditState.read
    this.setTitle()
  }
}
