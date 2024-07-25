import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AlertController,
  AnimationController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';

import { MessageService } from './providers/message.service';
import { MiscService } from './providers/misc.service';
import { Util } from './util';

/* tslint:disable:no-bitwise */
@Injectable()
export class AppUtil extends Util {

  environment = environment

  constructor(public alertCtrl: AlertController, public platform: Platform, public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public messageService: MessageService, private miscService: MiscService, public modalCtrl: ModalController, public navCtrl: NavController,
    public domSanitizer: DomSanitizer, public animationCtrl: AnimationController) {

    super(platform, toastCtrl, alertCtrl, navCtrl, modalCtrl, animationCtrl, loadingCtrl)

  }

  async enviaContato(formData: any) {

    if (!formData.nome?.trim().length || !formData.email?.trim().length ||
      !formData.telefone?.trim().length || !formData.mensagem?.trim().length) {

      this.alertError('Todos os campos são obrigatórios.')
      return

    }

    const loading = await this.loadingCtrl.create({
      message: 'Enviando...'
    })
    loading.present()

    formData.assunto = 'Contato pelo Site'

    this.miscService.enviaContato(formData)
      .pipe(finalize(() => this.loadingCtrl.dismiss()))
      .subscribe({
        next: data => {

          formData.mensagem = ''

          this.alertMessage(data)

        },
        error: err => {

          this.alertError(err)

        }
      });

  }

}
