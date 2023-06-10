import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill';

import { AppComponent } from './app.component';
import { CustomStylesDirective } from './custom-styles.directive';

@NgModule({
  declarations: [AppComponent, CustomStylesDirective],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
