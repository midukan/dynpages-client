import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {

  }

  del(key: string): Promise<any> {

    return Storage.remove({ key })

  }

  set(key: string, value: any): Promise<any> {

    value = value !== undefined ? JSON.stringify(value) : undefined

    return Storage.set({ key, value })

  }

  get(key: string): Promise<any> {

    return new Promise((resolve, reject) => {

      Storage.get({ key })
        .then((data) => {

          if (data.value === null) {
            resolve(null)
            return
          }

          resolve(JSON.parse(data.value))

        }).catch(erro => {

          reject(null)

        })

    })

  }

}
