import { CommonModule, DatePipe } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { IonicModule } from '@ionic/angular'

import { MaskitoDirective } from '@maskito/angular'
import { ActionButtonsComponent } from './components/action-buttons/action-buttons.component'
import { AnexoComponent } from './components/app/anexo/anexo.component'
import { PlanosComponent } from './components/app/planos/planos.component'
import { ResumoPgtoComponent } from './components/app/resumo-pgto/resumo-pgto.component'
import { BugReportComponent } from './components/bug-reporter/bug-reporter.component'
import { BulkWarningComponent } from './components/bulk-warning/bulk-warning.component'
import { DatetimeGroupComponent } from './components/datetime-group/datetime-group.component'
import { DatetimeComponent } from './components/datetime/datetime.component'
import { FiltersSelectedComponent } from './components/filters-selected/filters-selected.component'
import { FiltersComponent } from './components/filters/filters.component'
import { FooterComponent } from './components/footer/footer.component'
import { FormButtonsComponent } from './components/form-buttons/form-buttons.component'
import { HeaderComponent } from './components/header/header.component'
import { ListSummaryComponent } from './components/list-summary/list-summary.component'
import { LoadingComponent } from './components/loading/loading.component'
import { MediaViewerComponent } from './components/media-viewer/media-viewer.component'
import { MediaViewerService } from './components/media-viewer/media-viewer.service'
import { NumberComponent } from './components/number/number.component'
import { PagerComponent } from './components/pager/pager.component'
import { SelectComponent } from './components/select/select.component'
import { TaskbarComponent } from './components/taskbar/taskbar.component'
import { TooltipComponent } from './components/tooltip/tooltip.component'
import { AutocompleteDirective } from './directives/autocomplete.directive'
import { BrMaskDirective } from './directives/brmasker.directive'
import { ContextMenuDirective } from './directives/context-menu.directive'
import { FiltersOrderDirective } from './directives/filters-order.directive'
import { HintDirective } from './directives/hint.directive'
import { HotkeyDirective } from './directives/hotkey.directive'
import { InputDisplayErrorsDirective } from './directives/ion-input-error.directive'
import { ModalAdjustDirective } from './directives/modal-adjust.directive'
import { ModalDragabbleDirective } from './directives/modal-draggable.directive'
import { MoneyMaskerDirective } from './directives/money-masker.directive'
import { ClickPreventDefaultDirective } from './directives/prevent-default.directive'
import { PreventDoubleClickDirective } from './directives/prevent-double-click.directive'
import { ShowHidePassDirective } from './directives/show-hide-pass.directive'
import { ClickStopPropagationDirective } from './directives/stop-propagation.directive'
import { DinheiroPipe } from './pipes/dinheiro.pipe'
import { FilterPipe } from './pipes/filter.pipe'
import { TrustHTMLPipe } from './pipes/trust-html.pipe'

@NgModule({
	declarations: [
		FiltersComponent,
		ActionButtonsComponent,
		PagerComponent,
		SelectComponent,
		LoadingComponent,
		DatetimeComponent,
		DatetimeGroupComponent,
		BulkWarningComponent,
		NumberComponent,
		FiltersSelectedComponent,
		HeaderComponent,
		FooterComponent,
		MediaViewerComponent,
		TaskbarComponent,
		ListSummaryComponent,
		FormButtonsComponent,
		TooltipComponent,
		AnexoComponent,
		ResumoPgtoComponent,
		BugReportComponent,
		PlanosComponent,
		BrMaskDirective,
		ModalAdjustDirective,
		ClickStopPropagationDirective,
		ClickPreventDefaultDirective,
		InputDisplayErrorsDirective,
		FiltersOrderDirective,
		ModalDragabbleDirective,
		ShowHidePassDirective,
		PreventDoubleClickDirective,
		MoneyMaskerDirective,
		HotkeyDirective,
		HintDirective,
		AutocompleteDirective,
		ContextMenuDirective,
		FilterPipe,
		DinheiroPipe,
		TrustHTMLPipe,
	],
	imports: [
		CommonModule,
		RouterModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		MaskitoDirective,
	],
	exports: [
		CommonModule,
		RouterModule,
		IonicModule,
		FormsModule,
		FiltersComponent,
		ActionButtonsComponent,
		PagerComponent,
		SelectComponent,
		LoadingComponent,
		DatetimeComponent,
		DatetimeGroupComponent,
		BulkWarningComponent,
		NumberComponent,
		FiltersSelectedComponent,
		HeaderComponent,
		FooterComponent,
		MediaViewerComponent,
		TaskbarComponent,
		ListSummaryComponent,
		FormButtonsComponent,
		TooltipComponent,
		AnexoComponent,
		ResumoPgtoComponent,
		BugReportComponent,
		PlanosComponent,
		BrMaskDirective,
		ModalAdjustDirective,
		ClickStopPropagationDirective,
		ClickPreventDefaultDirective,
		InputDisplayErrorsDirective,
		FiltersOrderDirective,
		ModalDragabbleDirective,
		ShowHidePassDirective,
		PreventDoubleClickDirective,
		MoneyMaskerDirective,
		HotkeyDirective,
		HintDirective,
		ContextMenuDirective,
		FilterPipe,
		DinheiroPipe,
		TrustHTMLPipe,
		MaskitoDirective,
		AutocompleteDirective,
	],
	providers: [DatePipe, MediaViewerService],
})
export class SharedModule { }
