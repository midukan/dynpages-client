import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'
import { AlertController, Platform } from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private SW_UPDATE_INTERVAL = 30000

  public preventDupTest = false

  constructor(
    private platform: Platform,
    public http: HttpClient,
    private swUpdate: SwUpdate,
    private alertCtrl: AlertController,
  ) {


  }

  async updateHandle(frontendRealCommit: string, frontendCommit: string) {

    if (this.swUpdate.isEnabled) {

      if (await this.swUpdate.checkForUpdate()) {
        // await this.swUpdate.activateUpdate(); // não usar se os chunks todos mudam de nome
        (location as any).reload()
        return
      }

      setInterval(() => {
        // console.log('Verificando atualizações...')
        this.swUpdate.checkForUpdate()
      }, this.SW_UPDATE_INTERVAL)

      // Melhor forçar sempre o reload() (sem perguntar)
      this.swUpdate.versionUpdates.subscribe(async event => {

        // console.log('[VersionEvent]: ', event)

        switch (event.type) {

          case 'NO_NEW_VERSION_DETECTED':
            // console.log(`Nenhuma versão do app detectada: ${event.version.hash}`);
            break

          case 'VERSION_DETECTED':
            console.log(`Baixando nova versão do app: ${event.version.hash}`);
            break

          case 'VERSION_READY':

            console.log(`Versão do app atual: ${event.currentVersion.hash}`);
            console.log(`Nova versão do app pronta para uso: ${event.latestVersion.hash}`);

            this.promptUpdate()

            break

          case 'VERSION_INSTALLATION_FAILED':
            console.log(`Falha na versão do app: '${event.version.hash}': ${event.error}`);
            break

        }

      })

    } else {

      this.checkManualUpdate(frontendRealCommit, frontendCommit)

    }

  }

  checkManualUpdate(frontendRealCommit: string, frontendCommit: string, prompt = false) {

    if (frontendRealCommit && !frontendRealCommit.includes('replace')) {

      // precisa do trim porque salva com espaço no final do build.json
      if (frontendRealCommit.trim() !== frontendCommit.trim()) {

        if (prompt) {
          this.promptUpdate()
        } else {
          console.log('Atualizando cache...');
          (location as any).reload(true)
        }

      }

    }

  }

  async promptUpdate() {

    if (this.preventDupTest) {
      return
    }

    this.preventDupTest = true

    const alert = await this.alertCtrl.create({
      header: 'Nova versão',
      message: 'Uma atualização está disponível. Recomendamos atualizar agora.',
      buttons: [{
        text: 'Atualizar',
        handler: async () => {
          // await this.swUpdate.activateUpdate(); // pode dar zica entre diferentes nomes de chunks, não usar então
          this.preventDupTest = false
          console.log('Atualizando cache...');
          (location as any).reload(!this.swUpdate.isEnabled) // sem true não limpa cache (tutorial não tinha true)
        }
      }, {
        text: 'Não',
        role: 'cancel',
        handler: () => this.preventDupTest = false
      }]
    })

    alert.present()

  }

}
