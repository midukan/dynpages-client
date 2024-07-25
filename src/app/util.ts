import { TrackByFunction } from '@angular/core'
import {
  AlertController,
  AlertOptions,
  AnimationController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
  ToastController
} from '@ionic/angular'
import { ToastOptions } from '@ionic/core'
import { cloneDeepWith, cloneWith, isFunction } from 'lodash'
import { Observable, Subject, firstValueFrom } from 'rxjs'

import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core'
import { environment } from '../environments/environment'
import { IBodyFile } from './abstracts/backend-service.abstract'

export type ThemeColors = 'tertiary' | 'secondary' | 'primary' | 'quaternary' | 'success' | 'danger' | 'warning' | 'black' | 'dark' | 'medium' | 'light' | 'white'

export interface GenericObj<T> extends Iterable<readonly [PropertyKey, any]> {
  [property: string | number]: T
}

export enum DateRange {
  HOJE,
  ONTEM,
  AMANHA,
  MES_ANTERIOR,
  ESTE_MES,
  PROXIMO_MES,
  ESTA_SEMANA,
  MES_PASSADO,
  SEMANA_PASSADA,
  ESTE_ANO,
  ANO_PASSADO,
  ULTIMOS_12_MESES,
  ULTIMOS_30_DIAS,
  ULTIMOS_7_DIAS,
  PROXIMOS_12_MESES,
  PROXIMOS_30_DIAS,
  PROXIMOS_7_DIAS,
}

export interface DateRangeObject {
  start: Date;
  end: Date;
}

export interface IRecordAudio {
  source: MediaStreamAudioSourceNode
  recorder: MediaRecorder
  audioRecording: Subject<{ time: number }>
  audioRecordEnd: Subject<{ dataUrl: string, base64: string, mimetype: string, time: number }>
}

export interface IUploadSelectResult {
  base64: string
  size: number
  name: string
  extension: string
  entity: any
}

export class Util {

  constructor(public platform: Platform, public toastCtrl: ToastController, public alertCtrl: AlertController,
    public navCtrl: NavController, public modalCtrl: ModalController, public animationCtrl: AnimationController,
    public loadingCtrl: LoadingController) { }

  midukan() {
    console.log(`%c \n
        __  __  ___  ____   _   _  _  __    _     _   _
      |  \\/  ||_ _||  _ \\ | | | || |/ /   / \\   | \\ | |
      | |\\/| | | | | | | || | | || ' /   / _ \\  |  \\| |
      | |  | | | | | |_| || |_| || . \\  / ___ \\ | |\\  |
      |_|  |_||___||____/  \\___/ |_|\\_\\/_/   \\_\\|_| \\_|
      \n
      Outsourcing - WEB E APP
      https://midukan.com.br
      `, `font-family: monospace;`)

  }

  roundFloat(float: number, scale = 2): number {

    return parseFloat(float.toFixed(scale))

  }

  timerPromise(startMS: number, endMS?: number): Promise<void> {
    const delay = endMS ? startMS + Math.random() * (endMS - startMS) : startMS;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  trackByFn(keys: string[]): TrackByFunction<any> {

    return (index: number, item: any) => {
      const trackKey = keys.map((key) => item[key]).join('_')
      return trackKey
    }

  }

  countdown(objeto: any, property: string, valorInicial: number, step = 1): Observable<number> {

    return new Observable(observer => {

      objeto[property] = valorInicial
      observer.next(objeto[property])

      const intervalo = setInterval(() => {

        objeto[property] = objeto[property] -= step

        if (objeto[property] <= 0) {
          observer.complete()
          clearInterval(intervalo)
        }

      }, 1000)

    })

  }

  async getRealIP() {

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Erro ao obter o IP real:', error);
      return null;
    }

  }

  openFileWindow(data: IBodyFile, download = false) {

    if (download && !data.filename) console.error('Para download, informe também o filename.')

    const byteCharacters = atob(data.data.split(',').reverse()[0]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: data.mimetype });

    const urlBlob = URL.createObjectURL(blob)

    if (download && data.filename) {

      const a = document.createElement('a');
      a.download = data.filename
      a.href = urlBlob
      document.getElementsByTagName('body')[0].appendChild(a);
      a.click();
      a.remove();

    } else {

      window.open(urlBlob, '_blank');

    }

    URL.revokeObjectURL(urlBlob);

  }

  recordAudio(): Promise<IRecordAudio> {

    return new Promise((resolve, reject) => {

      // Verifica se o navegador suporta as APIs necessárias
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        // Solicita acesso ao microfone
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(function (stream) {

            // Cria um objeto AudioContext
            const audioContext = new AudioContext();

            // Cria um nó de entrada do microfone
            const source = audioContext.createMediaStreamSource(stream);

            const workerOptions = {
              // OggOpusEncoderWasmPath: 'http://localhost:4200/assets/misc/opus/OggOpusEncoder.wasm',
              // WebMOpusEncoderWasmPath: 'http://localhost:4200/assets/misc/opus/WebMOpusEncoder.wasm',
              OggOpusEncoderWasmPath: location.origin + '/assets/misc/opus/OggOpusEncoder.wasm',
              WebMOpusEncoderWasmPath: location.origin + '/assets/misc/opus/WebMOpusEncoder.wasm',
            };

            // Cria um nó de gravação
            const recorder = new (window as any).MediaRecorder(stream, { mimeType: 'audio/ogg; codecs=opus' }, workerOptions);
            const audioChunks: Blob[] = [];

            const audioRecording = new Subject<{ time: number }>()

            const time = new Date().getTime()

            const timeInterval = setInterval(() => audioRecording.next({ time: new Date().getTime() - time }), 100)

            // Escuta o evento de gravação de dados
            recorder.addEventListener('dataavailable', function (event) {
              audioChunks.push(event.data);
            })

            const audioRecordEnd = new Subject<{ dataUrl: string, base64: string, mimetype: string, time: number }>()

            // Escuta o evento de parar a gravação
            recorder.addEventListener('stop', function () {
              // Concatena os fragmentos de áudio em um único Blob
              const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' })

              // Cria um leitor de arquivo para ler o conteúdo do Blob
              const reader = new FileReader();
              reader.onloadend = function () {
                // Converte o áudio para Base64
                let [mimetype, base64] = (reader.result as string).split(',')
                mimetype = mimetype.split(':')[1].split(';')[0]
                // console.log('Áudio em Base64:', base64Audio);
                recorder.stream.getAudioTracks().forEach(track => { track.stop() })
                clearInterval(timeInterval)
                audioRecordEnd.next({ dataUrl: (reader.result as string), base64, mimetype, time: new Date().getTime() - time })
              };
              reader.readAsDataURL(audioBlob)
            })

            resolve({ source, recorder, audioRecording, audioRecordEnd })

            // // Inicia a gravação quando o botão for clicado
            // document.getElementById('start-recording')!.addEventListener('click', function () {
            //   recorder.start();
            // });

            // // Para a gravação quando o botão for clicado
            // document.getElementById('stop-recording')!.addEventListener('click', function () {
            //   recorder.stop();
            // });

          })
          .catch(function (error) {
            reject('Erro ao acessar o microfone: ' + error.toString())
          });
      } else {
        reject('As APIs necessárias não são suportadas pelo navegador.')
      }

    })

  }

  procuraPorLoopInfinito(arr: GenericObj<any>[], relKey: string, idKey = 'id') {

    const visited: Set<number> = new Set();
    const loopStack: Set<number> = new Set();
    let loopFound = false;

    const traverse = (obj: GenericObj<any>) => {
      visited.add(obj[idKey]);
      loopStack.add(obj[idKey]);

      if (obj[relKey] === obj[idKey]) {
        console.log(`Loop infinito encontrado para o objeto com ID ${obj[idKey]}`);
        loopFound = true;
        return;
      }

      if (loopStack.has(obj[relKey])) {
        const loopPath = Array.from(loopStack);
        console.log(`Loop infinito encontrado entre os objetos: ${loopPath.join(" -> ")}`);
        loopFound = true;
        return;
      }

      const parentObj = arr.find(item => item[idKey] === obj[relKey]);

      if (parentObj) {
        traverse(parentObj);
      }

      loopStack.delete(obj[idKey]);
    }

    arr.forEach(obj => {
      if (!visited.has(obj[idKey]) && !loopFound) {
        traverse(obj);
      }
    });

    return loopFound;

  }

  sendNotification(data: { title: string, body: string, icon?: string }, click: () => void = () => { }) {

    if ('Notification' in window) {
      // Solicita permissão ao usuário para exibir notificações
      Notification.requestPermission()
        .then(function (permission) {
          if (permission === 'granted') {
            // Cria uma nova notificação
            var notification = new Notification(data.title, {
              body: data.body,
              icon: data.icon || 'assets/images/logo-icon.png' // opcional
            })
            notification.onclick = click
          }
        })
        .catch(function (error) {
          console.error('Erro ao solicitar permissão de notificação:', error);
        });
    }

  }

  playSound(src: string, volume = 1) {

    const audio = document.createElement('audio')
    audio.src = src
    audio.volume = volume
    audio.play()
    audio.addEventListener('ended', () => {
      audio.remove()
    })

  }

  escapeHtmlEntities(input: string): string {

    const entities: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return input.replace(/[&<>"']/g, (match) => entities[match]);

  }

  valorBD(valorStr) {

    if (valorStr) {

      if (!valorStr.includes(',')) {

        if (valorStr.includes('.')) {

          if (valorStr.split('.').length > 2) {

            //this.alertError('Informe um valor válido!')
            return undefined

          }
          valorStr = valorStr.replace('.', ',')
        }

      }

    }

    if (!valorStr) valorStr = '0'

    return this.dinheiro(valorStr, false)

  }

  getDateRange(range: DateRange, tz: number = environment.configs.DATE_ONLY_TIMEZONE_OFFSET): DateRangeObject {

    const now = new Date();
    now.setMinutes(now.getMinutes() + now.getTimezoneOffset())

    let result: DateRangeObject

    switch (range) {

      case DateRange.HOJE: {
        const startOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1, -1, 59, 59, 999));
        result = { start: startOfDay, end: endOfDay };
        break
      }
      case DateRange.ONTEM: {
        const startOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), -1, 59, 59, 999));
        result = { start: startOfDay, end: endOfDay };
        break
      }
      case DateRange.AMANHA: {
        const startOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 2, -1, 59, 59, 999));
        result = { start: startOfDay, end: endOfDay };
        break
      }
      case DateRange.ESTE_MES: {
        const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0));
        const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));
        result = { start: startOfMonth, end: endOfMonth };
        break
      }
      case DateRange.MES_ANTERIOR: {
        const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0));
        const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999));
        result = { start: startOfMonth, end: endOfMonth };
        break
      }
      case DateRange.PROXIMO_MES: {
        const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0));
        const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999));
        result = { start: startOfMonth, end: endOfMonth };
        break
      }
      case DateRange.ESTA_SEMANA: {
        const startOfWeek = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()));
        const endOfWeek = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()), 23, 59, 59, 999));
        result = { start: startOfWeek, end: endOfWeek };
        break
      }
      case DateRange.MES_PASSADO: {
        const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0));
        const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999));
        result = { start: startOfMonth, end: endOfMonth };
        break
      }
      case DateRange.SEMANA_PASSADA: {
        const startOfWeek = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7, 0, 0, 0, 0));
        const endOfWeek = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 1, 23, 59, 59, 999));
        result = { start: startOfWeek, end: endOfWeek };
        break
      }
      case DateRange.ESTE_ANO: {
        const startOfYear = new Date(Date.UTC(now.getFullYear(), 0, 1, 0, 0, 0, 0));
        const endOfYear = new Date(Date.UTC(now.getFullYear(), 11, 31, 23, 59, 59, 999));
        result = { start: startOfYear, end: endOfYear };
        break
      }
      case DateRange.ANO_PASSADO: {
        const startOfYear = new Date(Date.UTC(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0));
        const endOfYear = new Date(Date.UTC(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999));
        result = { start: startOfYear, end: endOfYear };
        break
      }
      case DateRange.ULTIMOS_12_MESES: {
        const startOfLast12Months = new Date(Date.UTC(now.getFullYear() - 1, now.getMonth(), now.getDate(), 0, 0, 0, 0));
        const endOfLast12Months = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));
        result = { start: startOfLast12Months, end: endOfLast12Months };
        break
      }
      case DateRange.ULTIMOS_30_DIAS: {
        const startOfLast30Days = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0, 0));
        const endOfLast30Days = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));
        result = { start: startOfLast30Days, end: endOfLast30Days };
        break
      }
      case DateRange.ULTIMOS_7_DIAS: {
        const startOfLast7Days = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0));
        const endOfLast7Days = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));
        result = { start: startOfLast7Days, end: endOfLast7Days };
        break
      }
      case DateRange.PROXIMOS_12_MESES: {
        const startOfLast12Months = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
        const endOfLast12Months = new Date(Date.UTC(now.getFullYear() + 1, now.getMonth(), now.getDate(), 23, 59, 59, 999));
        result = { start: startOfLast12Months, end: endOfLast12Months };
        break
      }
      case DateRange.PROXIMOS_30_DIAS: {
        const startOfLast30Days = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
        const endOfLast30Days = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 29, 23, 59, 59, 999));
        result = { start: startOfLast30Days, end: endOfLast30Days };
        break
      }
      case DateRange.PROXIMOS_7_DIAS: {
        const startOfLast7Days = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
        const endOfLast7Days = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 6, 23, 59, 59, 999));
        result = { start: startOfLast7Days, end: endOfLast7Days };
        break
      }

    }

    result.start.setMinutes(result.start.getMinutes() + -tz)
    result.end.setMinutes(result.end.getMinutes() + -tz)

    return result

  }

  async uploadSelect(entity: any, property: string, accept = '.jpg', multipleKey?: string, maxWidth = 1920, maxHeight = 1920, quality = 0.8, showCamera?: 'user' | 'environment', files?: FileList):
    Promise<IUploadSelectResult[]> {

    if (!entity) {
      if (multipleKey) {
        entity = []
      } else {
        entity = {
          [property + 'Upload']: null,
          [property + 'Nome']: null,
        }
      }
    }

    return new Promise((res, rej) => {

      const that = this

      const inputFile = document.createElement('input')

      if (!files) {

        inputFile.type = 'file'
        inputFile.accept = showCamera ? 'image/*' : accept
        inputFile.multiple = !!multipleKey
        if (showCamera) {
          inputFile.capture = showCamera
        }

        document.getElementsByTagName('body')[0].appendChild(inputFile)

        inputFile.click()

        inputFile.onchange = async event => {

          if (!event || !inputFile.files) {
            this.alertError('Algo de errado ocorreu.')
            return
          }

          processaFiles(inputFile.files)

        }

      } else {

        processaFiles(files)

      }

      async function processaFiles(files: FileList) {

        const loading = await that.loadingCtrl.create({ message: 'Processando...' })
        loading.present()

        const filesResult: any[] = []

        await that.asyncForEach([].constructor(files.length).fill(0), async (file, idx) => {

          const { base64, size, name, extension } = (await new Promise((resolve, reject) => {

            if (!inputFile.files) {
              reject('Algo de errado ocorreu.')
              return
            }

            const reader = new FileReader();
            reader.readAsDataURL(inputFile.files[idx]);
            reader.onload = () => {

              if (!inputFile.files) {
                reject('Algo de errado ocorreu.')
                return
              }

              const extension = inputFile.files[idx].name.split('.').pop()

              if (!accept.split(',').includes('.' + extension)) {
                reject('Extensão inválida selecionada. É aceito apenas "' + accept + '".')
                return
              }

              return resolve({
                base64: reader.result,
                size: inputFile.files[idx].size,
                name: inputFile.files[idx].name,
                extension,
              })

            }
            reader.onerror = error => {
              reject(error)
            }

          }).catch(err => {
            loading.dismiss()
            rej(err)
          })) as IUploadSelectResult // if (result instanceof Error) {

          filesResult.push({ base64, size, name, extension, entity })

          if (base64) {

            let base64Resized

            const type = base64.split(';')[0].split(':')[1].split('/')[1]

            if (['jpg', 'jpeg', 'png', 'gif'].includes(type)) {

              base64Resized = (await that.resizeImage(base64, maxWidth, maxHeight, quality)
                .catch(err => {
                  rej(err)
                }))

            }

            const result = base64Resized || base64

            if (result) {
              if (multipleKey) {
                entity[multipleKey].push({ [property + 'Upload']: result, [property + 'Nome']: name })
              } else {
                entity[property + 'Upload'] = result
                entity[property + 'Nome'] = name
              }

            }

          }

        })

        loading.dismiss()

        res(filesResult)

      }

    })

  }

  enterAnimation = (animationType: 'grow' = 'grow', duration = 300): any => {

    return (baseEl: HTMLElement) => {

      const root = baseEl.shadowRoot;

      const baseAnimation = this.animationCtrl.create().addElement(baseEl)
      const backdropAnimation = this.animationCtrl.create().addElement(root?.querySelector('ion-backdrop')!)
      const wrapperAnimation = this.animationCtrl.create().addElement(root?.querySelector('.modal-wrapper')!)

      if (animationType === 'grow') {

        const loopFixScrollToTop = setInterval(() => {
          baseEl.querySelector('.ion-page ion-content')?.shadowRoot?.querySelector('.inner-scroll')?.scrollTo(0, 0) // .setAttribute('style', 'height: 100%; overflow: hidden;')
        }, 20)
        setTimeout(() => clearInterval(loopFixScrollToTop), duration + 100)

        backdropAnimation.fromTo('opacity', '0.01', 'var(--backdrop-opacity)')

        wrapperAnimation.keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '1', transform: 'scale(1)' },
        ])

        return baseAnimation
          .easing('ease-out')
          .duration(duration)
          .addAnimation([backdropAnimation, wrapperAnimation]);

      }

    }

  }

  leaveAnimation = (animationType: 'grow' = 'grow', duration = 400) => {

    return (baseEl: HTMLElement) => {
      return this.enterAnimation(animationType, duration)(baseEl)?.direction('reverse');
    }

  }

  objForEach<T>(obj: GenericObj<T>, callback: (item: T, key: string | number) => void) {
    Object.fromEntries(obj)['forEach'](arr => callback(arr[1], arr[0]))
  }

  async asyncForEach<T>(array: T[], callback: (item: T, key: number, array: T[]) => void) {
    for (const k of array.keys()) { await callback(array[k], k, array) }
  }

  // async parallelForEach<T>(array: T[], callback: (item: T, key: number, array: T[]) => void) {
  //   await Promise.all(array.map((v, k) => callback(v, k, array)));
  // }

  async parallelForEach<T>(array: T[], callback: (item: T, key: number, array: T[]) => Promise<void>) {
    const results = await Promise.allSettled(array.map(async (v, k) => await callback(v, k, array)))
    for (const result of results) {
      if (result.status === "rejected") {
        throw result.reason
      }
    }
  }

  requestPromise<T>(observables: Observable<T>[]): Promise<Awaited<T>[]> {

    const array = observables.map(obs => firstValueFrom(obs))

    return Promise.all(array)

  }

  setDataGroup(dataGroup: void | any[], that: any): boolean {

    if (!dataGroup) return false

    dataGroup.forEach(obj => {
      if (!obj) return

      const ret: any[] = []
      Object.keys(obj).forEach(item => ret.push([item, obj[item]]))
      Object.assign(that, Object.fromEntries(ret))
    })

    return true

  }

  setFocus(input: any, mobileFocus = false) {

    if (!input) {
      return
    }

    if (mobileFocus || window.innerWidth > (window as any).GLOBAL_MOBILE_WIDTH) { //  !this.platform.is('mobile') // mobile zoado no FF
      input.setFocus()
    }

  }

  async toast(data: any, time = 2000, color: ThemeColors = 'light', extraOptions: ToastOptions = {}) {

    if (typeof data === 'string' || data instanceof Array) {
      data = { message: data }
    }

    if (!data.message) {
      return
    }

    if (data.message instanceof Array) {
      data.message = '- ' + data.message.map(m => m.text || m).join('<br />- ')
    }

    const toast = await this.toastCtrl.create({
      message: data.message,
      duration: time,
      position: 'bottom',
      color,
      buttons: [{ text: 'X', role: 'cancel' }],
      ...extraOptions
    })

    toast.present()

  }

  alertMessage(data: any, options: AlertOptions = {}, handler = () => { }, handlerNot?: Function) {

    if (typeof data === 'string') {
      data = { message: data }
    }

    if (!data.message) {
      handler()
      return
    }

    if (data.message instanceof Array) {
      data.message = '- ' + data.message.map(m => m.text || m).join('<br />- ')
    }

    const buttons = [{
      text: data.button !== undefined ? data.button : 'Ok',
      handler: () => {
        handler()
      }
    }]

    if (handlerNot) {
      buttons.push({
        text: data.buttonCancel !== undefined ? data.buttonCancel : 'Cancelar',
        handler: () => {
          handlerNot()
        }
      })
    }

    this.alertCtrl.create({
      header: data.title !== undefined ? data.title : 'Atenção',
      message: data.message,
      buttons,
      ...options
    }).then(a => a.present())

  }

  alertError(err: any, options: AlertOptions = {}, handler = () => { }, handlerNot?: Function) {

    if (typeof err === 'string') {
      err = { message: err }
    }

    if (!err.message) {
      handler()
      return
    }

    if (err.message instanceof Array) {
      err.message = '- ' + err.message.map(m => m.text || m).join('<br />- ')
    }

    const buttons = [{
      text: err.button !== undefined ? err.button : 'Ok',
      handler: () => {
        handler()
      }
    }]

    if (handlerNot) {
      buttons.push({
        text: err.button !== undefined ? err.button : 'Cancelar',
        handler: () => {
          handlerNot()
        }
      })
    }

    this.alertCtrl.create({
      header: err.title !== undefined ? err.title : 'Ops!',
      message: err.message,
      buttons,
      ...options
    }).then(a => a.present())

  }

  async pageError(err: any, errorPagePath = '/erro') {

    if (typeof err === 'string') {
      err = { message: err }
    }

    if (err.message instanceof Array) {
      err.message = '- ' + err.message.map(m => m.text || m).join('<br />- ')
    }

    this.navCtrl.navigateBack(errorPagePath, { skipLocationChange: true, state: err })

  }

  async pageRequestError(err: any, type: 'page' | 'alert' | 'toast' = 'page', options: AlertOptions = {}, handler = () => { }, errorPagePath = '/erro') {

    const modalTop = await this.modalCtrl.getTop()

    if (modalTop) {
      type = 'alert';
      modalTop.dismiss()
    }

    if (type === 'page') {
      this.pageError(err, errorPagePath)
    } else if (type === 'alert') {
      this.alertError(err, options, handler)
    } else if (type === 'toast') {
      this.toast(err, 2000, 'danger')
    }

  }

  realApp() {

    // return (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8100'))

    return this.platform.is('capacitor') && (this.platform.is('ios') || this.platform.is('android'))

  }

  ambDev() {

    return !this.realApp() && (location.hostname === 'localhost' || location.hostname.substr(0, 7) === '10.0.0.')

  }

  baixarApp() {

    if (this.realApp()) {
      return
    }

    let url = ''
    if (this.platform.is('ios')) {
      // url = environment.paths.appStore
    } else if (this.platform.is('android')) {
      // url = environment.paths.playStore
    }

    const buttons = [{
      text: url ? 'Agora não' : 'Legal!',
      handler: () => {

      }
    }]

    if (url) {
      buttons.push({
        text: 'Baixar',
        handler: () => {
          this.openUrl(url, '_blank')
        }
      })
    }

    this.alertCtrl.create({
      header: 'Baixe o aplicativo :)',
      message: 'Tudo fica mais fácil com ele no seu celular!',
      buttons
    }).then(a => a.present())

  }

  /**
   * brmasker
   * @param type
   */
  getMask(type: string) {

    return {
      CPF: { mask: '000.000.000-00', type: 'num', len: 14 },
      CNPJ: { mask: '00.000.000/0000-00', type: 'num', len: 18 },
      IE: { mask: '000.000.000.000', type: 'num', len: 15 },
      RG: { mask: '00.000.000-0', type: 'num', len: 12 },
      CEP: { mask: '00000-000', type: 'num', len: 9 },
      CELULAR: { mask: '(00) 00000-0000', type: 'num', len: 15 },
      FIXO: { mask: '(00) 0000-0000', type: 'num', len: 14 },
      FIXO_CELULAR: { phone: true },
      DATA: { mask: '00/00/0000', type: 'num', len: 10 },
      DATAHORA: { mask: '00/00/0000 00:00', type: 'num', len: 16 },
      PERFIL: { person: true },
    }[type] as any

  }

  /**
   * maskito
   * @param type
   */
  getMaskito(type: string): MaskitoOptions {

    return {
      CPF: {
        mask: [
          ...Array(3).fill(/\d/),
          '.',
          ...Array(3).fill(/\d/),
          '.',
          ...Array(3).fill(/\d/),
          '-',
          ...Array(2).fill(/\d/),
        ],
      },
      CNPJ: {
        mask: [
          ...Array(2).fill(/\d/),
          '.',
          ...Array(3).fill(/\d/),
          '.',
          ...Array(3).fill(/\d/),
          '/',
          ...Array(4).fill(/\d/),
          '-',
          ...Array(2).fill(/\d/),
        ],
      },
      IE: { mask: '000.000.000.000', type: 'num', len: 15 },
      RG: { mask: '00.000.000-0', type: 'num', len: 12 },
      CEP: { mask: '00000-000', type: 'num', len: 9 },
      CELULAR: { mask: '(00) 00000-0000', type: 'num', len: 15 },
      FIXO: { mask: '(00) 0000-0000', type: 'num', len: 14 },
      DATA: { mask: '00/00/0000', type: 'num', len: 10 },
      DATAHORA: { mask: '00/00/0000 00:00', type: 'num', len: 16 },
      PERFIL: { person: true },
    }[type] as any

  }

  getMaskitoPredicate(): MaskitoElementPredicate {

    return async (el) => (el as HTMLIonInputElement).getInputElement();

  }

  getPathnameVar(key?): any {

    const query = window.location.pathname.substring(1);
    const vars = query.split('/');

    const params: Array<string> = [];
    for (const i in vars) {
      if (params.hasOwnProperty(i)) {
        params.push(decodeURIComponent(vars[i]));
      }
    }

    if (typeof key === 'undefined') {
      return params;
    } else {
      if (typeof params[key] === 'undefined') {
        return null;
      } else {
        return params[key];
      }
    }

  }

  getUrlVar(key?, queryString?): any {

    if (!queryString) {
      queryString = location.search.replace('?', '');
    }

    if (!queryString) {
      return key ? '' : {};
    }

    const vars = queryString.split('&');

    const params: any = {};
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
    }

    if (!key) {
      return params
    } else {
      if (params[key] === undefined) {
        return null
      } else {
        return params[key]
      }
    }

  }

  openUrl(url, target = '_blank', html?, options?: { width?: number, height?: number }) {

    let opt = '';

    if (options?.width && options?.height) {

      const left = (window.outerWidth / 2 - options.width / 2) || 0;
      const top = (window.outerHeight / 2 - options.height / 2) || 0;

      opt = target === 'popup' ? 'width=' + options.width + ', height=' + options.height + ', top=' + top + ', left=' + left + ', ' +
        'scrollbars=no, toolbar=no, titlebar=no, location=no, status=no, menubar=no' : '';

    }

    const win = window.open(url || 'about:blank', target, opt);

    if (html && win) {
      win.document.write(html);
      setTimeout(() => {
        // win.document.body.innerHTML = html;
      }, 300);
      // win.document.write(html);
      // win.document.html = html;
    }

    return win;

  }

  fullScreen(elem?: any, forceOpenClose?: boolean) {

    // console.log('FullScreen')

    const dcmt = (document as any)

    // check if user allows full screen of elements. This can be enabled or disabled in browser config. By default its enabled.
    // its also used to check if browser supports full screen api.
    if ('fullscreenEnabled' in dcmt || 'webkitFullscreenEnabled' in dcmt || 'mozFullScreenEnabled' in dcmt || 'msFullscreenEnabled' in dcmt) {

      const element = elem || dcmt.getElementsByTagName('ion-app')[0];

      try {

        if (forceOpenClose || (forceOpenClose === undefined && !dcmt.fullscreenElement && !dcmt.webkitFullscreenElement && !dcmt.mozFullScreenElement && !dcmt.msFullscreenElement)) {
          // requestFullscreen is used to display an element in full screen mode.
          if ('requestFullscreen' in element) {
            element.requestFullscreen();
          } else if ('webkitRequestFullscreen' in element) {
            element.webkitRequestFullscreen();
          } else if ('mozRequestFullScreen' in element) {
            element.mozRequestFullScreen();
          } else if ('msRequestFullscreen' in element) {
            element.msRequestFullscreen();
          }
        } else if (forceOpenClose !== undefined && !forceOpenClose && (dcmt.fullscreenElement || dcmt.webkitFullscreenElement || dcmt.mozFullScreenElement || dcmt.msFullscreenElement)) {
          // exitFullscreen us used to exit full screen manually
          if ('exitFullscreen' in dcmt) {
            dcmt.exitFullscreen();
          } else if ('webkitExitFullscreen' in dcmt) {
            dcmt.webkitExitFullscreen();
          } else if ('mozCancelFullScreen' in dcmt) {
            dcmt.mozCancelFullScreen();
          } else if ('msExitFullscreen' in dcmt) {
            dcmt.msExitFullscreen();
          }
        }

      } catch (err) { }

    }

  }

  screenChange() {

    const dcmt = document as any;

    // fullscreenElement is assigned to html element if any element is in full screen mode.
    if (dcmt.fullscreenElement || dcmt.webkitFullscreenElement || dcmt.mozFullScreenElement || dcmt.msFullscreenElement) {
      // console.log("Current full screen element is : " + (dcmt.fullscreenElement || dcmt.webkitFullscreenElement |
      // dcmt.mozFullScreenElement || dcmt.msFullscreenElement))
    } else {
      // exitFullscreen us used to exit full screen manually
      if ('exitFullscreen' in dcmt) {
        dcmt.exitFullscreen();
      } else if ('webkitExitFullscreen' in dcmt) {
        dcmt.webkitExitFullscreen();
      } else if ('mozCancelFullScreen' in dcmt) {
        dcmt.mozCancelFullScreen();
      } else if ('msExitFullscreen' in dcmt) {
        dcmt.msExitFullscreen();
      }
    }
  }

  nl2br(txt) {

    if (!txt) {
      return '';
    }

    while (txt.includes('\n')) {
      txt = txt.replace('\n', '<br />');
    }

    return txt;

  }

  async copyToClipboard(text, onOk?, OnErr?) {

    await navigator.clipboard.writeText(text)
      .catch(err => (OnErr ? OnErr(err) : null))

    if (onOk) onOk()

  }

  timer(time: string, type: 'short' | 'long' = 'short'): Observable<string> { // {text: 00:00:00}

    return new Observable(observer => {

      let [segundos = 0, minutos = 0, horas = 0]: any = time.split(':').reverse()

      setInterval(() => {

        +segundos++

        if (segundos === 60) {
          segundos = 0
            + minutos++
          if (minutos === 60) {
            minutos = 0
              + horas++
          }
        }

        const textArr = [(minutos + '').padStart(2, '0'), (segundos + '').padStart(2, '0')]

        if (horas) {
          textArr.unshift((horas + '').padStart(2, '0'))
        } else if (type === 'long') {
          textArr.unshift('00')
        }

        observer.next(textArr.join(':'))

      }, 1000)

    })

  }

  timeDiffToStr(tempoMenor: Date | string, tempoMaior: Date | string = new Date(), type: 'long' | 'short' | 'cron' = 'short') {

    if (typeof tempoMenor === 'string' && tempoMenor.indexOf('T')) {
      tempoMenor = new Date(tempoMenor)
    }

    if (typeof tempoMenor === 'string') {

      const data = tempoMenor.split(' ')[0].split('-');
      const hora = tempoMenor.split(' ')[1].split(':');

      tempoMenor = new Date();
      tempoMenor.setFullYear(parseInt(data[0], 10));
      tempoMenor.setMonth(parseInt(data[1], 10));
      tempoMenor.setDate(parseInt(data[2], 10));
      tempoMenor.setHours(parseInt(hora[0], 10));
      tempoMenor.setMinutes(parseInt(hora[1], 10));
      tempoMenor.setSeconds(parseInt(hora[2], 10));
    }

    if (typeof tempoMaior === 'string' && tempoMaior.indexOf('T')) {
      tempoMaior = new Date(tempoMaior)
    }

    if (typeof tempoMaior === 'string') {

      const data = tempoMaior.split(' ')[0].split('-');
      const hora = tempoMaior.split(' ')[1].split(':');

      tempoMaior = new Date();
      tempoMaior.setFullYear(parseInt(data[0], 10));
      tempoMaior.setMonth(parseInt(data[1], 10));
      tempoMaior.setDate(parseInt(data[2], 10));
      tempoMaior.setHours(parseInt(hora[0], 10));
      tempoMaior.setMinutes(parseInt(hora[1], 10));
      tempoMaior.setSeconds(parseInt(hora[2], 10));
    }

    const strArr: string[] = [];
    let str = '';

    const diferenca = Math.floor((tempoMaior.getTime() - tempoMenor.getTime()) / 1000);

    let dias = Math.floor(diferenca / 3600 / 24);
    const horas = Math.floor(diferenca / 3600) - dias * 24;
    const minutos = Math.floor(diferenca / 60) - (horas + dias * 24) * 60;
    const segundos = diferenca - (minutos + ((horas + (dias * 24)) * 60)) * 60;

    // Fix para exibir os dias certos caso a dif seja 1 dia e 20 horas no short exibia apenas 1 dia..
    if (type === 'short' && horas > 0 && dias > 0) dias++

    if (type === 'short' || type === 'long') {

      if (dias >= 1) {
        strArr.push(dias + ' ' + ((dias !== 1) ? 'dias' : 'dia'));
      }
      if (horas >= 1 || dias >= 1) {
        strArr.push(horas + ' ' + ((horas !== 1) ? 'horas' : 'hora'));
      }
      if (minutos >= 1 || horas >= 1 || dias >= 1) {
        strArr.push(minutos + ' ' + ((minutos !== 1) ? 'minutos' : 'minuto'));
      }
      strArr.push(segundos + ' ' + ((segundos !== 1) ? 'segundos' : 'segundo'));

      if (strArr.length > 1) {
        const last: string = strArr.pop() as string;
        str = strArr.join(', ') + ' e ' + last;
      } else {
        str = strArr.join(', ');
      }

      if (type === 'short') {
        str = str.split(', ')[0].split(' e ')[0];
      }

    } else if (type === 'cron') {

      if (horas || dias) {
        strArr.push(((horas + (dias * 24)) + '').padStart(2, '0'))
      }
      if (minutos) {
        strArr.push((minutos + '').padStart(2, '0'))
      }
      if (segundos) {
        strArr.push((segundos + '').padStart(2, '0'))
      }

      str = strArr.join(':')

    }

    return str;

  }

  setEqualDate(dateTo: Date, dateFrom: Date): void {

    dateTo.setUTCDate(dateFrom.getUTCDate());
    dateTo.setMonth(dateFrom.getMonth());
    dateTo.setDate(dateFrom.getDate());
    dateTo.setHours(dateFrom.getHours());
    dateTo.setMinutes(dateFrom.getMinutes());
    dateTo.setSeconds(dateFrom.getSeconds());
    dateTo.setMilliseconds(dateFrom.getMilliseconds());

  }

  // horário vem do front, sempre no locale em tela
  strToDate(data: string, hour?: string): Date {

    let expDate: string[];
    if (data.indexOf('-') !== -1) {
      expDate = data.split('-');
    } else {
      expDate = data.split('/');
    }

    const expHour: string[] = (hour ? hour : '00:00:00').split(':');

    let ano, dia;

    if (expDate[2].length === 4) {
      ano = expDate[2];
      dia = expDate[0];
    } else {
      ano = expDate[0];
      dia = expDate[2];
    }

    return new Date(+ano, +expDate[1] - 1, +dia, +expHour[0], +expHour[1], +expHour[2] || 0);

  }

  dateToStr(date: Date, dbStyle = false, withHour = false): string {

    let str = '';

    if (dbStyle) {

      str = date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' +
        date.getDate().toString().padStart(2, '0');

      if (withHour) {
        str += ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
      }

    } else {

      str = date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1 + '').padStart(2, '0') + '/' +
        date.getFullYear();

      if (withHour) {
        str += ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
      }
    }

    return str;

  }

  semanaStr(dateStr: string, tresChar: boolean = false) {

    return this._mesSemana('weekday', dateStr, tresChar).split('-')[0];

  }

  mesStr(dateStr: string, tresChar: boolean = false) {

    return this._mesSemana('month', dateStr, tresChar);

  }

  cartaoBandeira(cardnumber: any) {

    if (!cardnumber || typeof cardnumber !== 'string') return

    const card = cardnumber.replace(/[^0-9]+/g, '');

    const cards = {
      amex: /^3[47][0-9]{13}$/,
      aura: /^((?!504175))^((?!5067))(^50[0-9])/,
      banesecard: /^636117/,
      cabal: /(60420[1-9]|6042[1-9][0-9]|6043[0-9]{2}|604400)/,
      diners: /(36[0-8][0-9]{3}|369[0-8][0-9]{2}|3699[0-8][0-9]|36999[0-9])/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
      elo: /^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/,
      fortbrasil: /^628167/,
      grandcard: /^605032/,
      hipercard: /^606282|^3841(?:[0|4|6]{1})0/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}/,
      mastercard: /^((5(([1-2]|[4-5])[0-9]{8}|0((1|6)([0-9]{7}))|3(0(4((0|[2-9])[0-9]{5})|([0-3]|[5-9])[0-9]{6})|[1-9][0-9]{7})))|((508116)\\d{4,10})|((502121)\\d{4,10})|((589916)\\d{4,10})|(2[0-9]{15})|(67[0-9]{14})|(506387)\\d{4,10})/,
      personalcard: /^636085/,
      sorocred: /^627892|^636414/,
      valecard: /^606444|^606458|^606482/,
      visa: /^4[0-9]{6,}(?:[0-9]{3})?$/
    }

    for (var flag in cards) {
      if (cards[flag].test(card)) {
        return flag;
      }
    }

    return false;
  }

  private _mesSemana(prop: string, dateStr: string, tresChar: boolean = false) {

    if (!dateStr) {
      return '';
    }

    const dia = dateStr.split(' ')[0];
    const hora = dateStr.indexOf(' ') > 0 ? dateStr.split(' ')[1] : '';

    const opt: Intl.DateTimeFormatOptions = prop === 'month' ? { month: tresChar ? 'short' : 'long' }
      : { weekday: tresChar ? 'short' : 'long' };
    const retStr = this.strToDate(dia, hora).toLocaleString('pt-br', opt);

    return retStr.charAt(0).toUpperCase() + retStr.slice(1);

  }

  calculaIdade(anoAniversario: any, mesAniversario: any, diaAniversario: any) { // 05/09/1988
    const d = new Date(),
      anoAtual = d.getFullYear(),
      mesAtual = d.getMonth() + 1,
      diaAtual = d.getDate(),

      anoAniversario2: any = +anoAniversario,
      mesAniversario2: any = +mesAniversario,
      diaAniversario2: any = +diaAniversario;

    let quantosAnos = anoAtual - anoAniversario2;

    if (mesAtual < mesAniversario2 || mesAtual === mesAniversario2 && diaAtual < diaAniversario2) {
      quantosAnos--;
    }

    return quantosAnos < 0 ? 0 : quantosAnos;
  }

  separaNomeSobrenome(nomeCompleto: string) {

    const nomeSplit: string[] = nomeCompleto.split(' ')
    const divisaoNome = Math.floor(nomeSplit.length / 2)
    const nome = nomeSplit.slice(0, divisaoNome).join(' ')
    const sobrenome = nomeSplit.slice(divisaoNome).join(' ')

    return { nome, sobrenome }

  }

  validaPassword(password: string): string | null {

    if (!password?.trim()) {
      return 'Informe uma senha.'
    }

    if (password.length < 8) {
      return 'A senha deve conter ao menos 8 caracteres.'
    }

    if (password.search(/[0-9]/) < 0) {
      return 'A senha não possui nenhum caractere numérico.'
    }

    if (password.search(/[A-Z]/) < 0) {
      return 'A senha não possui nenhuma letra maiúscula.'
    }

    if (password.search(/[a-z]/) < 0) {
      return 'A senha não possui nenhuma letra minúscula.'
    }

    return null

  }

  validaDataNascimento(dataNascimento: string, idadeMinima = 18, strict = true): boolean {

    let birthDate: Date

    // Use uma expressão regular para verificar se a string de data de nascimento está no formato "DD/MM/YYYY".
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento)) {
      birthDate = new Date(dataNascimento)
    } else {
      // Use a classe Date para parsear a string de data de nascimento.
      const [day, month, year] = dataNascimento.split('/');
      birthDate = new Date(`${year}-${month}-${day}`);
    }

    // Obtenha o número de milissegundos desde 1 de janeiro de 1970 para a data de nascimento.
    const birthTime = birthDate.getTime();

    // Obtenha o número de milissegundos desde 1 de janeiro de 1970 para a data atual.
    const currentTime = new Date().getTime();

    // Calcule a diferença em milissegundos.
    let ageInMilliseconds = currentTime - birthTime;

    // Se o parâmetro strict for verdadeiro, adicione um dia em milissegundos para garantir que a idade seja calculada corretamente.
    if (strict) {
      ageInMilliseconds += 86400000;  // 86400000 é o número de milissegundos em um dia.
    }

    // Calcule a idade em anos dividindo a diferença em milissegundos pelo número de milissegundos
    const age = ageInMilliseconds / 31557600000;

    // Verifique se a idade é maior ou igual a 18.
    return age >= idadeMinima;

  }

  validaNome(nome: string): boolean {
    // Verifique se a string não está vazia e se contém apenas caracteres alfabéticos.
    return !!nome && nome.length >= 3 && /^[a-zA-Z\s]+$/.test(nome);
  }

  validaUsername(str: string): boolean {
    return !str?.trim() && str.match(/^[a-z0-9]{3,20}$/) !== null;
  }

  validaLinkname(str: string): boolean {
    return !str?.trim() && str.match(/^[a-z0-9\-]+$/) !== null;
  }

  validaCelular(number: string): boolean {
    return /^\(\d{2,3}\) \d{4,5}-\d{4}$/.test(number);
  }

  validaEmail(email: string): boolean {
    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }

  validaCPF(cpf: string): boolean {
    // Remova os pontos e o hífen do CPF
    cpf = cpf.replace(/\./g, '').replace(/-/g, '');

    // Verifique se o CPF tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifique se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Calcule o primeiro e o segundo dígito verificador
    let sum = 0;
    let rest = 0;
    for (let i = 1; i <= 9; i++) sum = sum + (+cpf.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== (+cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + (+cpf.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== (+cpf.substring(10, 11))) return false;

    // Se chegou até aqui, o CPF é válido
    return true;
  }

  validaCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj === '') {
      return false;
    }

    if (cnpj.length !== 14) {
      return false;
    }

    // Elimina CNPJs invalidos conhecidos
    if (cnpj === '00000000000000' ||
      cnpj === '11111111111111' ||
      cnpj === '22222222222222' ||
      cnpj === '33333333333333' ||
      cnpj === '44444444444444' ||
      cnpj === '55555555555555' ||
      cnpj === '66666666666666' ||
      cnpj === '77777777777777' ||
      cnpj === '88888888888888' ||
      cnpj === '99999999999999') {

      return false;
    }

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado + '' !== digitos.charAt(0)) {
      return false;
    }

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado + '' !== digitos.charAt(1)) {

      return false;
    }

    return true;

  }

  validaCartao(cardNumber, cardType) {
    cardNumber = cardNumber.replace('.', '').replace('.', '').replace('.', '').replace(' ', '').replace(' ', '').replace(' ', '');
    const ccCheckRegExp = /[^\d ]/;
    let isValid = !ccCheckRegExp.test(cardNumber);
    let cardNumberLength;
    let cardNumbersOnly;
    if (isValid) {
      cardNumbersOnly = cardNumber.replace(/ /g, '');
      cardNumberLength = cardNumbersOnly.length;
      let lengthIsValid = false;
      let prefixRegExp;
      switch (cardType) {
        case 'mastercard':
          lengthIsValid = cardNumberLength === 16;
          prefixRegExp = /^5[1-5]/;
          break;
        case 'visa':
          lengthIsValid = cardNumberLength === 16 || cardNumberLength === 13;
          prefixRegExp = /^4/;
          break;
        case 'diners':
        case 'elo':
          return true; // sem validação
        case 'amex':
          lengthIsValid = cardNumberLength === 15;
          prefixRegExp = /^3(4|7)/;
          break;
        default:
          prefixRegExp = /^$/;
          return false;
      }

      const prefixIsValid = prefixRegExp.test(cardNumbersOnly);
      isValid = prefixIsValid && lengthIsValid;
    }

    if (isValid) {
      let numberProduct;
      // var numberProductDigitIndex;
      let checkSumTotal = 0;
      let digitCounter;
      for (digitCounter = cardNumberLength - 1; digitCounter >= 0; digitCounter--) {
        checkSumTotal += parseInt(cardNumbersOnly.charAt(digitCounter), 10);
        digitCounter--;
        numberProduct = String(cardNumbersOnly.charAt(digitCounter) * 2);
        for (let productDigitCounter = 0; productDigitCounter < numberProduct.length; productDigitCounter++) {
          checkSumTotal += parseInt(numberProduct.charAt(productDigitCounter), 10);
        }
      }
      isValid = checkSumTotal % 10 === 0;
    }

    return isValid;
  }

  validaCVV(number: string): boolean {
    return /^[0-9]{3,4}$/.test(number);
  }

  validaCartaoValidade(dataStr: string): boolean {

    let data: Date

    dataStr = '01/' + dataStr

    const [day, month, year] = dataStr.split('/');
    data = new Date(`${year}-${month}-${day}`);

    return data instanceof Date && data > new Date()

  }

  validaCartaoNumero(numero: string) {

    const numeroStr = numero.replace(/ /g, '');
    const bandeira = this.cartaoBandeira(numeroStr)

    if (!bandeira || numeroStr.length < 12) return false

    //console.log('numero: ', numeroStr)
    return (typeof bandeira === 'string') && numeroStr.length > 12

  }

  // Cria um novo objeto removendo recursivamente as keys informadas
  objRemoveIdKey(obj: any, keysToRemove: string[] = ['id']): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.objRemoveIdKey(item, keysToRemove))
    } else if (typeof obj === 'object' && obj !== null) {
      const newObj = {}
      for (const key in obj) {
        if (!keysToRemove.includes(key)) {
          newObj[key] = this.objRemoveIdKey(obj[key], keysToRemove)
        }
      }
      return newObj
    } else {
      return obj
    }
  }

  // Mantém endereço de memória e faz limpeza rasa (shallow)
  clearObj(obj, ignores: string[] = []) {

    for (const a in obj) {

      if (ignores.indexOf(a) >= 0) {
        continue;
      }

      // if (typeof obj[a] === 'object') {
      //    this.clearObj(obj[a]);
      // }
      // else {
      delete obj[a];
      // }
    }

    return obj

  }

  populateObj(objReceive, objSend, ignore: string[] = []) {

    for (const a in objSend) {

      if (objSend.hasOwnProperty(a)) {

        // Array
        if (objSend[a] instanceof Array) {
          if (!objReceive.hasOwnProperty(a)) {
            objReceive[a] = [];
          }
          this.populateObj(objReceive[a], objSend[a]);
          continue;
        }

        // Object
        if (typeof objSend[a] === 'object') {
          if (!objReceive.hasOwnProperty(a)) {
            objReceive[a] = (objSend[a] == null ? null : {});
          }
          this.populateObj(objReceive[a], objSend[a]);
          continue;
        }

        // Ignore
        if (ignore.indexOf(a) >= 0) {
          continue;
        }

        // Define
        objReceive[a] = objSend[a];

      }

    }

  }

  deepCopy(objSend: any, v: 'v1' | 'v2' = 'v2') {

    if (null == objSend || typeof objSend !== 'object') {
      return objSend;
    }

    if (v === 'v2') {
      return cloneDeepWith(objSend, (value) => {
        return isFunction(value) ? value : undefined;
      })
    } else {
      return JSON.parse(JSON.stringify(objSend));
    }

  }

  shallowCopy(objSend: any, v: 'v1' | 'v2' = 'v2') {

    if (null == objSend || 'object' !== typeof objSend) {
      return objSend
    }

    if (v === 'v2') {
      return cloneWith(objSend, (value) => {
        return isFunction(value) ? value : undefined;
      })
    } else {
      const copy = objSend.constructor()
      for (const attr in objSend) {
        if (objSend.hasOwnProperty(attr)) {
          copy[attr] = objSend[attr]
        }
      }
      return copy
    }

  }

  dinheiro(value: number, exibirRS: boolean, decimals?: number): string;
  dinheiro(value: string, exibirRS: boolean, decimals?: number): number;
  dinheiro(value: string | number, exibirRS: boolean = true, decimals: number = 2): string | number {

    if (typeof value === 'number') {
      // Se o valor é um número, formate-o como uma string de dinheiro
      const formattedValue = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

      // Adicione o símbolo do Real (RS) se necessário
      if (exibirRS) {
        return formattedValue;
      } else {
        return (formattedValue.includes('-') ? '-' : '') + formattedValue.replace('R$', '').replace('-', '').trim();
      }
    } else if (typeof value === 'string') {
      // Se o valor é uma string, remova os pontos de casas de milhares, substitua a vírgula por ponto e analise como número
      const cleanedValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));

      if (!isNaN(cleanedValue)) {
        return cleanedValue;
      } else {
        throw new Error('A string de entrada não é um número válido.');
      }
    } else {
      throw new Error('Tipo de valor inválido (' + value + '). Apenas números e strings são suportados.');
    }

  }

  dataURLtoFile(dataUrl, filename): File {

    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });

  }

  resizeImage(srcBase64: string, newWidth?: number, newHeight?: number, quality: number = 0.8): Promise<string> {

    return new Promise((resolve, reject) => {

      if (!newWidth || !newHeight) {
        reject('newWidth ou newHeight não foram informados.')
        return
      }

      const img = new Image()

      img.src = srcBase64

      img.onload = () => {

        if (img.naturalWidth < newWidth && img.naturalHeight < newHeight) {
          resolve(srcBase64)
          return
        }

        const elem = document.createElement('canvas')

        if (newWidth && newHeight) {

          const imgProp = img.naturalWidth / img.naturalHeight
          const setupProp = newWidth / newHeight

          if (imgProp > setupProp) {
            elem.width = newWidth
            elem.height = (newWidth / img.naturalWidth) * img.naturalHeight
          } else {
            elem.width = (newHeight / img.naturalHeight) * img.naturalWidth
            elem.height = newHeight
          }

        } else {

          elem.width = newWidth ? newWidth : ((newHeight / img.naturalHeight) * img.naturalWidth)
          elem.height = newHeight ? newHeight : ((newWidth / img.naturalWidth) * img.naturalHeight)

        }

        const ctx = elem.getContext('2d') as CanvasRenderingContext2D
        ctx.drawImage(img, 0, 0, elem.width, elem.height)
        const data = ctx.canvas.toDataURL(srcBase64.split(':')[1].split(';')[0], quality)

        resolve(data)

      }

      img.onerror = error => reject(error)

    })

  }

  getBase64Image(url, viaCanvas = false): Promise<string> {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        reject(environment.request.timeoutErroPadrao);

      }, 10000);

      if (viaCanvas) {

        const img = new Image();
        img.src = url;

        img.onload = () => {

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/jpg');

          // return dataURL;//.replace(/^data:image\/(png|jpg);base64,/, "");

          resolve(dataURL);

        };

      } else {

        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = () => {
            reject(environment.request.erroPadrao);
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();

      }

    });

    // .timeout(200, new Error('Tempo limite excedido. Tente novamente'));

  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {

    const byteCharacters = atob(b64Data);
    const byteArrays: any[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });

  }

  base64 = {

    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    encode(input) {

      let output = '';
      let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      let i = 0;

      input = this._utf8_encode(input);

      while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
          this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

      }

      return output;
    },

    decode(input) {

      let output = '';
      let chr1, chr2, chr3;
      let enc1, enc2, enc3, enc4;
      let i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

      while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
          output = output + String.fromCharCode(chr3);
        }

      }

      output = this._utf8_decode(output);

      return output;

    },

    _utf8_encode(stringe) {

      stringe = stringe.replace(/\r\n/g, '\n');
      let utftext = '';

      for (let n = 0; n < stringe.length; n++) {

        const c = stringe.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode(c >> 6 | 192);
          utftext += String.fromCharCode(c & 63 | 128);
        } else {
          utftext += String.fromCharCode(c >> 12 | 224);
          utftext += String.fromCharCode(c >> 6 & 63 | 128);
          utftext += String.fromCharCode(c & 63 | 128);
        }

      }

      return utftext;
    },

    _utf8_decode(utftext) {

      let stringe = '';
      let i = 0;
      let c = 0;
      // var c1 = 0;
      let c2 = 0;
      let c3 = 0;

      while (i < utftext.length) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
          stringe += String.fromCharCode(c);
          i++;
        } else if (c > 191 && c < 224) {
          c2 = utftext.charCodeAt(i + 1);
          stringe += String.fromCharCode((c & 31) << 6 | c2 & 63);
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          stringe += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          i += 3;
        }

      }

      return stringe;
    }

  };

}
