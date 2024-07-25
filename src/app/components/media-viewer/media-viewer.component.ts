import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppUtil } from 'src/app/app-util';
import { environment } from 'src/environments/environment';

export type MediaViewerType = 'image' | 'video'

@Component({
  selector: 'app-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['./media-viewer.component.scss'],
})
export class MediaViewerComponent {

  environment = environment

  type: MediaViewerType
  src: string
  options: any

  modalHeight: number

  @ViewChild('img') img: ElementRef

  constructor(private elementRef: ElementRef, private appUtil: AppUtil, private modalCtrl: ModalController) {



  }

  ngOnInit() {

    this.getModalHeight()

    setInterval(() => {
      this.getModalHeight()
    }, 500)

  }

  getModalHeight() {

    this.modalHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.modalHeight -= 40

  }

  dismiss() {

    this.modalCtrl.dismiss(null)

  }

}
