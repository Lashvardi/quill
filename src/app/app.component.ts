import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
} from '@angular/core';
import { FormArray, NonNullableFormBuilder } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CourseArticleConfig, CustomStyles } from './custom-styles.model';
import { QuillEditorComponent, QuillModules } from 'ngx-quill';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  quillContent$: Observable<string | null> = of(null);
  quillStyle: object = {};
  viewMode: 'css' | 'json' = 'css';

  // ? Limitation Of Mark Color
  customBackgroundColorPalette: string[] = ['#cfcf'];

  quillModules: QuillModules = {
    // ? Commented Parts Which I Thought Are Not Needed
    toolbar: [
      [
        //'bold',
        //'italic',
        //'underline',
        //'strike',
        'blockquote',
        'code-block',
        { header: 1 },
        { header: 2 },
        //{ list: 'ordered' },
        //{ list: 'bullet' },
        //{ script: 'sub' },
        //{ script: 'super' },
        //{ indent: '-1' },
        //{ indent: '+1' },
        //{ direction: 'rtl' },
        //{ size: ['small', false, 'large', 'huge'] },
        { header: [1, 2, 3, 4, 5, 6, false] },
        //{ font: [] },
        //{ align: [] },
        'link',
        'image',
        'video',
        'clean',
      ],
      [{ background: this.customBackgroundColorPalette }],
    ],
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
    { label: 'Justify', value: 'justify' },
  ];

  // ? Return Icon Class
  getIconClass(value: string) {
    switch (value) {
      case 'left':
        return 'bi bi-text-left';
      case 'center':
        return 'bi bi-text-center';
      case 'right':
        return 'bi bi-text-right';
      case 'justify':
        return 'bi bi-justify';
      default:
        return '';
    }
  }

  // ? Font Style Options
  fontStyleOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Italic', value: 'italic' },
    { label: 'Oblique', value: 'oblique' },
  ];

  //? Fonf Family Options
  defaultFontFamilies: string[] = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Lucida Console',
  ];
  addedFontFamilies: string[] = [];

  // ? FontSize Options
  sizes: number[] = [
    8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 48, 60,
    72,
  ];

  //? Spacing && Line Height Options
  lineHeightOptions: number[] = [1, 1.15, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9];
  letterSpacingOptions: number[] = [0, 0.5, 1, 1.5, 2, 2.5, 3];

  // * Form Group
  customStyles = this.fb.group({
    fontFamilies: this.fb.array(['Helvetica', 'Serif']),
    globalFontFamily: 'Helvetica',
    elements: this.fb.group({
      h1: this.fb.group({
        // ! Appp APP
        color: 'red',
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
        lineHeight: '1.5',
        letterSpacing: '0',
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
      markColor: this.fb.group({
        backgroundColor: 'yellow',
      }),
    }),
  });

  customStyles$ = new BehaviorSubject<CourseArticleConfig>(
    (this.quillStyle = this.customStyles.getRawValue())
  );

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit() {
    this.quillContent$ = of(localStorage.getItem('editor_content'));

    this.customStyles.valueChanges.subscribe((value) => {
      this.customStyles$.next(this.customStyles.getRawValue());
    });
  }

  onSubmit() {
    console.log(this.quillContent$);
  }

  // Modal Code
  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;

    // ?  Updating Values of the QuillStyle When Oppening Modal
    this.quillStyle = this.customStyles.getRawValue();
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
      //! Not The Best Solution
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
    if (!this.addedFontFamilies.includes(fontName)) {
      this.addedFontFamilies.push(fontName);
      this.defaultFontFamilies.push(fontName);
      this.customStyles.controls.fontFamilies.push(this.fb.control(fontName));

      this.defaultFontFamilies = [...new Set(this.defaultFontFamilies)];
    }
  }

  removeFontFamily(fontName: string) {
    const fontIndex = this.addedFontFamilies.indexOf(fontName);
    if (fontIndex !== -1) {
      this.addedFontFamilies.splice(fontIndex, 1);

      const fontControl = this.customStyles.controls.fontFamilies as FormArray;
      const fontIndexControl = fontControl.controls.findIndex(
        (control) => control.value === fontName
      );
      if (fontIndexControl !== -1) {
        fontControl.removeAt(fontIndexControl);
      }

      //! Remove the font styles from the document's head (Not Best Solution For angular)
      const styleElements = Array.from(
        document.head.querySelectorAll(`style[data-font-name="${fontName}"]`)
      );
      styleElements.forEach((element) => {
        element.remove();
      });

      // Update the default font families if the font is not already in the array
      if (!this.defaultFontFamilies.includes(fontName)) {
        this.defaultFontFamilies.push(fontName);
      }
    }
  }
}
