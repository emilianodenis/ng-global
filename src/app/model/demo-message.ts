import { Action } from 'src/app/model/action'

export interface DemoMessage<T> {
  action: Action
  content: T
  id: number
  sessionId: string
}
