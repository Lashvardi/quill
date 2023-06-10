import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CourseArticleConfig, CustomStyles } from './custom-styles.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  quillContent = '';

  someConfig: CourseArticleConfig = {
    fontFamilies: ['Helvetica', 'Arial', 'Roboto'],
    globalFontFamily: 'Serif',
    elements: {
      h1: {
        color: 'purple',
        fontFamily: 'Helvetica',
        fontSize: '2.2rem',
      },
      blockquote: {
        border: {
          color: '#4ace',
          width: '4px',
          style: 'solid',
        },
      },
    },
  };

  customStyles = this.fb.group({
    fontFamilies: this.fb.array(['Helvetica', 'Serif']),
    globalFontFamily: 'Helvetica',
    elements: this.fb.group({
      h1: this.fb.group({
        color: 'black',
        fontFamily: 'Helvetica',
        fontSize: '2rem',
      }),
      blockquote: this.fb.group({
        color: 'gray',
        fontFamily: 'serif',
        fontSize: '1.2rem',
      }),
    }),
  });

  customStyles$ = new BehaviorSubject<CourseArticleConfig>(
    this.customStyles.getRawValue()
  );

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit() {
    const savedContent = localStorage.getItem('editor_content');
    if (savedContent) {
      this.quillContent = savedContent;
    }
    setTimeout(() => {
      this.customStyles$.next(this.customStyles.getRawValue());
    }, 2000);
  }

  onContentUpdated(newContent: string) {
    this.quillContent = newContent;
    localStorage.setItem('editor_content', this.quillContent);
  }

  onSubmit() {
    console.log(this.quillContent);
  }
}
