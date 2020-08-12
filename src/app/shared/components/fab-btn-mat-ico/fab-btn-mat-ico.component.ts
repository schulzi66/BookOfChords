import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'shared-fab-btn',
	templateUrl: './fab-btn-mat-ico.component.html',
	styleUrls: [ './fab-btn-mat-ico.component.scss' ]
})
export class FabBtnMatIcoComponent implements OnInit {
	@Input('icon') icon: string;
	@Input('disabled') disabled: boolean;

	@Output('onClick') onClick: EventEmitter<any> = new EventEmitter<any>();

	constructor() {}

	ngOnInit() {}

	public onClickEvent(event: any): void {
		this.onClick.emit(event);
	}
}
