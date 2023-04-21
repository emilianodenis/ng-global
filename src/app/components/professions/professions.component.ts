import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Router } from '@angular/router'
import { Action } from 'src/app/model/action'
import { DemoMessage } from 'src/app/model/demo-message'
import { EditState } from 'src/app/model/edit-state'
import { Profession } from 'src/app/model/profession'
import { AppStateService } from 'src/app/services/app-state.service'
import { ProfessionsService } from 'src/app/services/professions.service'
import { isNullOrUndefined } from 'src/app/utils/object-utils'
import { getFailureSnackbarOptions, getSuccessSnackbarOptions } from 'src/app/utils/snackbar-utils'
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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appStateService: AppStateService,
  ) {}

  ngOnInit(): void {
    this.loadInitialData(true)
    this.setHandlers()
  }

  private setHandlers(): void {
    this.activatedRoute.queryParamMap.subscribe((p) => {
      if (p.has('id')) {
        this.loadProfession(p.get('id')!)
      }
    })
    this.appStateService.professionAction$.subscribe((m) => this.handleProfessionAction(m))
  }

  private setTitle(): void {
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
          getFailureSnackbarOptions(),
        )
        console.log(err)
      },
    })
  }

  private handleProfessionAction(message: DemoMessage<Profession>): void {
    if (message.action === Action.DELETE) {
      const idx = this.summary.findIndex((p) => p.id === message.content.id)
      if (idx > -1) {
        this.summary.splice(idx, 1)
      }
    } else if (message.action === Action.UPDATE) {
      const idx = this.summary.findIndex((p) => p.id === message.content.id)
      if (idx > -1) {
        this.summary[idx] = message.content
      }
    } else if (message.action === Action.CREATE) {
      this.summary.push(message.content)
    }
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
          getFailureSnackbarOptions(),
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
          getSuccessSnackbarOptions(),
        )
      },
      error: (err) => {
        this.snackBar.open(
          'An error happened while trying to delete the profession. Please try again in a few minutes',
          undefined,
          getFailureSnackbarOptions(),
        )
        console.log(err)
      },
    })
  }

  submit(): void {
    if (!this.canSubmit) return
    let httpAction$ = this.editionMode
      ? this.professionService.udpateProfession(this.editedProfession!.id, this.editedProfession!)
      : this.professionService.createProfession(this.editedProfession!)
    httpAction$.subscribe({
      next: (profession) => {
        this.snackBar.open(
          'Profession submitted successfully',
          undefined,
          getSuccessSnackbarOptions(),
        )
        this.loadInitialData()
      },
      error: (err) => {
        this.snackBar.open(
          'An error happened while trying to submit the profession. Please try again in a few minutes',
          undefined,
          getFailureSnackbarOptions(),
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
    this.router.navigate([], {
      queryParams: { id: null },
    })
  }
}
