import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormArray, NonNullableFormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CourseArticleConfig, CustomStyles } from './custom-styles.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  quillContent = '';
  quillStyle: object = {};
  viewMode: 'css' | 'json' = 'css'; // default to CSS view

  quillModules = {
    toolbar: [
      // your toolbar options
    ],
    imageResize: true,  // add this line
  };


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

  // *  Drop Down Options

  // ? Text Align Options
  textAlignOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  // ? Return Icon Class
  getIconClass(value: string) {
    switch (value) {
      case 'left': return 'bi bi-text-left';
      case 'center': return 'bi bi-text-center';
      case 'right': return 'bi bi-text-right';
      case 'justify': return 'bi bi-text-justify';
      default: return '';
    }
  }

  // ? Font Style Options
  fontStyleOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Italic', value: 'italic' },
    { label: 'Oblique', value: 'oblique' },
  ]


  //? Fonf Family Options
  defaultFontFamilies: string[] = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Lucida Console'];
  addedFontFamilies: string[] = [];


  // ? FontSize Options
  sizes: number[] = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 48, 60, 72];
  color: string = '#000000';

  customStyles = this.fb.group({
    fontFamilies: this.fb.array(['Helvetica', 'Serif']),
    globalFontFamily: 'Helvetica',
    elements: this.fb.group({
      h1: this.fb.group({
        color: 'black',
        fontFamily: 'Helvetica',
        fontSize: '2rem',
        textAlign: 'left',
        fontStyle: 'normal',
      }),

      h2: this.fb.group({
        color: 'black',
        fontFamily: 'Helvetica',
        textAlign: 'left',
        fontSize: '1.8rem',
        fontStyle: 'normal',
      }),

      h3: this.fb.group({
        color: 'black',
        fontFamily: 'Helvetica',
        fontSize: '1.6rem',
        textAlign: 'left',
        fontStyle: 'normal',
      }),

      p: this.fb.group({
        color: 'black',
        fontFamily: 'Helvetica',
        fontSize: '1.2rem',
        textAlign: 'left',
        fontStyle: 'normal',
      }),
      blockquote: this.fb.group({
        color: 'gray',
        fontFamily: 'serif',
        fontSize: '1.2rem',
      }),
      a: this.fb.group({
        color: 'blue',
        fontFamily: 'serif',
        fontSize: '1.2rem',
        fontStyle: 'normal',
      }),
      '.test_box': this.fb.group({
        backgroundColor: 'black',
      }),
    }),
  });

  customStyles$ = new BehaviorSubject<CourseArticleConfig>(
    this.quillStyle  = this.customStyles.getRawValue()

  );

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit() {
    const savedContent = localStorage.getItem('editor_content');
    if (savedContent) {
      this.quillContent = savedContent;
    }

    // ! Removed Timeout It was causing The Issue of not loading the content properly
    this.customStyles.valueChanges.subscribe((value) => {
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

    // ?  Updating Values of the QuillStyle When Oppening Modal
    this.quillStyle  = this.customStyles.getRawValue()
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


  onFileSelected(event: any) {
    const files: File[] = event.target.files;

    if (files && files.length) {
      for (let file of files) {
        this.uploadFile(file);
      }
    }
  }

  uploadFile(file: File) {
    const reader = new FileReader();

    // Extract the font name without the extension
    const fontName = file.name.split('.').slice(0, -1).join('.');

    reader.onload = (event: any) => {
      // Create a new blob object
      const blob = new Blob([event.target.result], { type: file.type });

      // Create a URL for the blob object
      const blobURL = URL.createObjectURL(blob);

      //? Add the @font-face rule to the stylesheet
      //? Creates Separate StyleSheet For FontFaces
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: "${fontName}";
          src: url("${blobURL}");
        }
      `;
      document.head.appendChild(style);

      // Add the font to the form control
      this.addFontFamily(fontName);
    };

    reader.readAsArrayBuffer(file);
  }

addFontFamily(fontName: string) {
  (this.customStyles.controls.fontFamilies as FormArray).push(this.fb.control(fontName));

  this.addedFontFamilies.push(fontName);
}





}
