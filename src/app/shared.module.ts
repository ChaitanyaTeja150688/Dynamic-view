import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// Import commmon components
import { DropDownListComponent } from '../components/drop-down-list/drop-down-list.component';
import { MultiSelectDropDownComponent } from '../components/multi-select-dropdown/multi-select-dropdown.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { InputComponent } from '../components/input/input.component';
import { NumericInputComponent } from '../components/numeric-input/numeric-input.component';
import { PanelContentComponent } from '../components/panel-content/panel-content.component';
import { TextAreaComponent } from '../components/textarea/textarea.component';
import { HeaderComponent } from '../components/header/header.component';
import { SideNavComponent } from '../components/side-nav/side-nav.component';
import { AccordionComponent } from '../components/accordion/accordion.component';
import { FieldListComponent } from '../components/field-list/field-list.component';
import { ToggleSwitchComponent } from '../components/toggle-switch/toggle-switch.component';
import { ComponentPanelComponent } from '../components/component-panel/component-panel.component';
import { TabsComponent } from '../components/tabs/tabs.component';
import { TableComponent } from '../components/table/table.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { ModalComponent } from '../components/modal/modal.component';
import { AlertsComponent } from '../components/alerts/alerts.component';
import { TableComponentPanelComponent } from '../components/table-component-panel/table-component-panel.component';

const components = [
    HeaderComponent,
    SideNavComponent,
    AccordionComponent,
    FieldListComponent,
    ToggleSwitchComponent,
    ComponentPanelComponent,
    TabsComponent,
    LoaderComponent,
    DropDownListComponent,
    MultiSelectDropDownComponent,
    PaginationComponent,
    InputComponent,
    NumericInputComponent,
    PanelContentComponent,
    TextAreaComponent,
    ModalComponent,
    AlertsComponent,
    TableComponent,
    TableComponentPanelComponent
];
@NgModule({
    declarations: components,
    exports: components,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule.forRoot()
    ],
    providers: [DatePipe],
    bootstrap: []
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
            ]
        };
    }
}
