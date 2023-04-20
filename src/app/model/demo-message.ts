import { Action } from 'src/app/model/action'

export interface DemoMessage<T> {
  action: Action
  message: T
  id: number
  sessionId: string
}
