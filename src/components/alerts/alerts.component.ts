import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import * as _ from 'underscore';

@Component({
    selector: 'app-alerts',
    styleUrls: ['alerts.component.scss'],
    templateUrl: 'alerts.component.html'
})

export class AlertsComponent implements OnChanges {
    @Input() messagesList = [];
    @Input() messageType: string;
    showMessage = false;
    showPopUpMessage = false;

    ngOnChanges() {
        this.showMessage = false;
        this.showPopUpMessage = false;
        if (this.messageType === 'alert') {
            this.showMessage = true;
        } else {
            this.showPopUpMessage = true;
        }
    }
}
