import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import html2canvas from 'html2canvas';
import { finalize } from 'rxjs';
import { AppUtil } from 'src/app/app-util';
import { MessageService } from 'src/app/providers/message.service';
import { MiscService } from 'src/app/providers/misc.service';

@Component({
  selector: 'app-bug-reporter',
  templateUrl: './bug-reporter.component.html',
  styleUrls: ['./bug-reporter.component.scss']
})
export class BugReportComponent {

  modalReportOpen = false

  reportText = ''

  enviando = false

  constructor(
    public appUtil: AppUtil,
    private miscService: MiscService,
    private loadingCtrl: LoadingController,
    private messageService: MessageService,
  ) {

  }

  async submitReport(): Promise<void> {

    if (!this.reportText.trim().length) {
      this.appUtil.alertError('É necessário informar a descrição da solicitação.')
      return
    }

    this.enviando = true

    setTimeout(async () => {

      const screenshot = await this.captureScreen();

      const loading = await this.loadingCtrl.create({ message: 'Enviando...' });
      loading.present();

      this.miscService.enviaBugReport({ file: { dataNome: this.reportText, dataUpload: screenshot } })
        .pipe(finalize(() => {
          loading.dismiss()
          this.enviando = false
        }))
        .subscribe({
          next: (data) => {

            this.appUtil.toast('Reporte enviado. Agradecemos pela colaboração.', 3000, 'success')

            this.modalReportOpen = false
            this.reportText = ''

          },
          error: (err) => this.appUtil.alertError(err),
        });

    })

  }

  openModalReport() {

    this.modalReportOpen = true

  }

  keyUpTxtArea() {

    setTimeout(() => this.messageService.get('modal.resize').next(null))

  }

  private async captureScreen(): Promise<string> {
    const canvas = await html2canvas(document.body);
    return canvas.toDataURL('image/png');
  }

}
