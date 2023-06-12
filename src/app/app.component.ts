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

  textAlignOptions = [
    { label: 'Left', value: 'left', icon: 'bi bi-text-left' },
    { label: 'Center', value: 'center', icon: 'bi bi-text-center' },
    { label: 'Right', value: 'right', icon: 'bi bi-text-right' },
    { label: 'End', value: 'end', icon: 'bi bi-text-indent-end' },
  ];



  customStyles = this.fb.group({
    fontFamilies: this.fb.array(['Helvetica', 'Serif']),
    globalFontFamily: 'Helvetica',
    elements: this.fb.group({
      h1: this.fb.group({
        color: 'black',
        fontFamily: 'Helvetica',
        fontSize: '2rem',
        textAlign: 'left',
      }),

      h2: this.fb.group({
        color: 'black',
        fontFamily: 'Helvetica',
        textAlign: 'left',

        fontSize: '1.8rem',
      }),

      h3: this.fb.group({
        color: 'black',
        fontFamily: 'Helvetica',
        fontSize: '1.6rem',
        textAlign: 'left',
      }),

      p: this.fb.group({
        color: 'black',
        fontFamily: 'Helvetica',
        fontSize: '1.2rem',
        textAlign: 'left',
      })
      ,
      blockquote: this.fb.group({
        color: 'gray',
        fontFamily: 'serif',
        fontSize: '1.2rem',
      }),

      a: this.fb.group({
        color: 'blue',
        fontFamily: 'serif',
        fontSize: '1.2rem',

      })
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

    // ! Removed Timeout It was causing The Issue of not loading the content properly
    this.customStyles.valueChanges.subscribe(value => {
      this.customStyles$.next(this.customStyles.getRawValue());
    });

  }

  onContentUpdated(newContent: string) {
    this.quillContent = newContent;
    localStorage.setItem('editor_content', this.quillContent);
  }

  onSubmit() {
    console.log(this.quillContent);
  }


  // Modal Code
  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
