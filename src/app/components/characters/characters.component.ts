import { Component } from '@angular/core'
import {
  BaseCharacter,
  Character,
  characterFullName,
} from 'src/app/model/character'
import { CharacterService } from 'src/app/services/characters.service'
import {
  notNullNorEmpty,
  notNullNorUndefined,
} from 'src/app/utils/object-utils'

enum EditState {
  create,
  edit,
  read,
}

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
})
export class CharactersComponent {
  characterFullName = characterFullName
  summary: BaseCharacter[] = []
  editedCharacter?: Character
  selectedCharacter?: BaseCharacter
  state = EditState.read
  title = ''

  setTitle(): void {
    if (this.isReadMode) this.title = ''
    else if (this.creationMode) this.title = 'Add new character'
    else
      this.title = `Modify ${characterFullName(
        this.editedCharacter as BaseCharacter
      )}`
  }

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
      notNullNorUndefined(this.editedCharacter) &&
      notNullNorEmpty(this.editedCharacter!.firstName) &&
      notNullNorEmpty(this.editedCharacter!.lastName) &&
      notNullNorEmpty(this.editedCharacter!.email)
    )
  }

  constructor(private characterService: CharacterService) {}

  loadCharacters() {
    this.characterService.getCharacters().subscribe({
      next: (characters) => (this.summary = characters),
      error: (err) => console.log(err),
    })
  }

  loadCharacter(characterToLoad: BaseCharacter) {
    this.characterService.getCharacter(characterToLoad.id).subscribe({
      next: (character) => {
        this.state = EditState.edit
        this.editedCharacter = { ...character }
        this.selectedCharacter = characterToLoad
        this.setTitle()
      },
      error: (err) => console.log(err),
    })
  }

  deleteCharacter(id: number) {
    this.characterService.deleteCharacter(id).subscribe({
      next: () => this.loadCharacters(),
      error: (err) => console.log(err),
    })
  }

  submit(): void {
    if (!this.canSubmit) return
    let httpAction$ = this.editionMode
      ? this.characterService.udpateCharacter(
          this.editedCharacter!.id,
          this.editedCharacter!
        )
      : this.characterService.createCharacter(this.editedCharacter!)
    httpAction$.subscribe({
      next: (character) => {
        // this.editedCharacter = undefined
        // this.state = EditState.read
        this.loadCharacters()
      },
      error: (err) => console.log(err),
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

  private resetState(): void {
    this.editedCharacter = undefined
    this.selectedCharacter = undefined
    this.state = EditState.read
    this.setTitle()
  }
}
