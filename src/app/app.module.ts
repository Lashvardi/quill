import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill';

import { AppComponent } from './app.component';
import { CustomStylesDirective } from './custom-styles.directive';
import { OutputComponent } from './components/output/output.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';

// * Ng Zorro Modules
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { JsonToCssPipe } from './pipes/json-to-css.pipe';
import { HighlightCssPipe } from './pipes/high-light-css.pipe';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, CustomStylesDirective, OutputComponent, JsonToCssPipe, HighlightCssPipe],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    NzCollapseModule,
    NzButtonModule,
    NzModalModule,
    NzSelectModule,
    ColorPickerModule,
    NzDropDownModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
