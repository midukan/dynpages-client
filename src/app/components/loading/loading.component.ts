import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {

  @Input() name: "bubbles" | "circles" | "circular" | "crescent" | "dots" | "lines" | "lines-sharp" | "lines-sharp-small" | "lines-small" = 'dots'

  constructor() {}

}
