import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Router } from '@angular/router'
import { zip } from 'rxjs'
import { Action } from 'src/app/model/action'
import { BaseCharacter, Character, characterFullName } from 'src/app/model/character'
import { DemoMessage } from 'src/app/model/demo-message'
import { EditState } from 'src/app/model/edit-state'
import { Profession } from 'src/app/model/profession'
import { AppStateService } from 'src/app/services/app-state.service'
import { AutoInvestService } from 'src/app/services/auto-invest.service'
import { CharacterService } from 'src/app/services/characters.service'
import { ProfessionsService } from 'src/app/services/professions.service'
import { isNullOrUndefined } from 'src/app/utils/object-utils'
import { getFailureSnackbarOptions, getSuccessSnackbarOptions } from 'src/app/utils/snackbar-utils'
import { isNullOrEmpty } from 'src/app/utils/string-utils'

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
})
export class CharactersComponent implements OnInit {
  characterFullName = characterFullName
  summary: BaseCharacter[] = []
  professions: Profession[] = []
  editedCharacter?: Character
  selectedCharacter?: BaseCharacter
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
      !isNullOrUndefined(this.editedCharacter) &&
      !isNullOrUndefined(this.editedCharacter!.profession) &&
      !isNullOrEmpty(this.editedCharacter!.firstName) &&
      !isNullOrEmpty(this.editedCharacter!.lastName) &&
      !isNullOrEmpty(this.editedCharacter!.email)
    )
  }

  constructor(
    private characterService: CharacterService,
    private professionService: ProfessionsService,
    private autoInvestService: AutoInvestService,
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
        this.loadCharacter(p.get('id')!)
      }
    })
    this.appStateService.characterAction$.subscribe((m) => this.handleCharacterAction(m))
  }

  setTitle(): void {
    if (this.isReadMode) this.title = ''
    else if (this.creationMode) this.title = 'Add new character'
    else this.title = `Modify ${characterFullName(this.editedCharacter as BaseCharacter)}`
  }

  loadInitialData(shouldLoadCharacter = false) {
    let data$ = zip(this.characterService.getCharacters(), this.professionService.getProfessions())
    data$.subscribe({
      next: ([characters, professions]) => {
        this.summary = characters
        this.professions = professions
        if (shouldLoadCharacter) {
          const params = this.activatedRoute.snapshot.queryParams
          if (params['id']) {
            this.loadCharacter(params['id'])
          }
        }
      },
      error: (err) => {
        this.snackBar.open(
          'Could not retrieve list of characters',
          undefined,
          getFailureSnackbarOptions(),
        )
        console.log(err)
      },
    })
  }

  private handleCharacterAction(message: DemoMessage<Character>): void {
    if (message.action === Action.DELETE) {
      this.removeCharacter(message.content)
    } else if (message.action === Action.UPDATE) {
      this.updateCharacter(message.content)
    } else if (message.action === Action.CREATE) {
      this.summary.push(message.content)
    }
  }

  loadCharacter(id: string) {
    if (isNullOrEmpty(id)) return

    const characterId = Number.parseInt(id)

    if (isNaN(characterId)) return

    const characterToLoad = this.summary.find((c) => c.id === characterId)
    if (!characterToLoad) return

    this.characterService.getCharacter(characterToLoad.id, this.professions).subscribe({
      next: (character) => {
        this.state = EditState.edit
        this.editedCharacter = character
        this.selectedCharacter = characterToLoad
        this.setTitle()
      },
      error: (err) => {
        this.resetState()
        this.snackBar.open(
          `Could not retrieve character to edit (${characterFullName(characterToLoad)})`,
          undefined,
          getFailureSnackbarOptions(),
        )
        console.log(err)
      },
    })
  }

  deleteCharacter(id: number) {
    this.characterService.deleteCharacter(id).subscribe({
      next: () => {
        this.removeCharacter({ id } as Character)
        this.snackBar.open('Character deleted successfully', undefined, getSuccessSnackbarOptions())
        if (this.editedCharacter?.id === id) {
          this.resetState()
        }
      },
      error: (err) => {
        this.snackBar.open(
          'An error happened while trying to delete the character. Please try again in a few minutes',
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
      ? this.characterService.udpateCharacter(this.editedCharacter!.id, this.editedCharacter!)
      : this.characterService.createCharacter(this.editedCharacter!)
    httpAction$.subscribe({
      next: (character) => {
        this.editionMode ? this.updateCharacter(character) : this.summary.push(character)
        this.snackBar.open(
          'Character submitted successfully',
          undefined,
          getSuccessSnackbarOptions(),
        )
      },
      error: (err) => {
        this.snackBar.open(
          'An error happened while trying to submit the character. Please try again in a few minutes',
          undefined,
          getFailureSnackbarOptions(),
        )
        console.log(err)
      },
      complete: () => this.resetState(),
    })
  }

  createNewCharacter(): void {
    this.state = EditState.create
    this.editedCharacter = {} as Character
    this.setTitle()
  }

  cancelEditing(): void {
    this.resetState()
  }

  private removeCharacter(character: Character): void {
    const idx = this.summary.findIndex((p) => p.id === character.id)
    if (idx > -1) {
      this.summary.splice(idx, 1)
    }
  }

  private updateCharacter(character: Character): void {
    const idx = this.summary.findIndex((p) => p.id === character.id)
    if (idx > -1) {
      this.summary[idx] = character
    }
  }

  private resetState(): void {
    this.editedCharacter = undefined
    this.selectedCharacter = undefined
    this.state = EditState.read
    this.setTitle()
    this.router.navigate([], {
      queryParams: { id: null },
    })
  }

  triggerAutoInvest(characterId: number): void {
    this.autoInvestService.triggerAutoInvest(characterId).subscribe()
  }
}
