import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

// import {Subject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private subjects: { [ID: string]: Subject<any> } = {}

  get<T>(ID: string): Subject<T> {

    if (!this.subjects[ID]) {
      this.subjects[ID] = new Subject<T>()
    }

    return this.subjects[ID]

  }

}

/*

 export class MessageService {
 private subject = new Subject<any>()

 sendMessage(message: string) {
 this.subject.next({ text: message })
 }

 clearMessage() {
 this.subject.next()
 }

 getMessage(): Observable<any> {
 return this.subject.asObservable()
 }
 }

 */
