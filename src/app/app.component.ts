import { Component, OnInit, ViewChild } from '@angular/core';

import { FormArray, NonNullableFormBuilder } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CourseArticleConfig, CustomStyles } from './custom-styles.model';
import { QuillEditorComponent, QuillModules } from 'ngx-quill';
import { base64HandlerService } from './services/base64handler.service';
import Quill from 'quill';
import { ViewEncapsulation } from '@angular/compiler';
encapsulation: ViewEncapsulation.None;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  quillContent$: Observable<string | null> = of(null);
  quillContent = '';
  quillStyle: object = {};
  viewMode: 'css' | 'json' | 'genCss' = 'css';
  @ViewChild(QuillEditorComponent) quillEditorComponent!: QuillEditorComponent;

  // ? Limitation Of Mark Color
  customBackgroundColorPalette: string[] = ['#cfcf'];
  quillInstance: any;
  selectedColor: string = 'yellow'; // Default color

  // Todo: Update This Everytem Custom Style Is Updated

  quillModules = {};

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
  css = '';

  onCssChange(css: string) {
    this.css = css;
  }
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
    // ? Add Bold
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
        color: 'red',
        fontFamily: 'Helvetica',
        fontSize: '4rem',
        textAlign: 'left',
        fontStyle: 'normal',
        lineHeight: '1.5',
        letterSpacing: '0',
      }),
      blockquote: this.fb.group({
        color: 'gray',
        fontFamily: 'serif',
        fontSize: '1.2rem',
        fontStyle: 'normal',
        maxWidth: '100%',
        padding: '10px',
        margin: '0px',
        backgroundColor: 'white',
        textAlign: 'left',
        // ? Added here
        borderRadius: '0px',
        border: this.fb.group({
          color: 'orange',
          style: 'solid',
          // ! As I Know There is No Border Support Here
          radius: '0px',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '10px',
        }),
      }),

      a: this.fb.group({
        color: 'blue',
        fontFamily: 'serif',
        fontSize: '1.2rem',
        fontStyle: 'normal',
      }),
      // '.test_box': this.fb.group({
      //   backgroundColor: 'black',
      // }),
      markColor: this.fb.group({
        backgroundColor: ['yellow'],
      }),
    }),
  });

  customStyles$ = new BehaviorSubject<CourseArticleConfig>(
    (this.quillStyle = this.customStyles.getRawValue())
  );

  constructor(
    private fb: NonNullableFormBuilder,
    private imageUploadService: base64HandlerService
  ) {}

  ngOnInit() {
    this.quillModules = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: this.customBackgroundColorPalette }],
          ['link', 'image'],
        ],
        handlers: {
          image: this.imageHandler.bind(this),
        },
      },
    };
    this.quillContent$ = of(localStorage.getItem('editor_content'));

    this.customStyles.valueChanges.subscribe((value) => {
      this.customStyles$.next(this.customStyles.getRawValue());

      this.quillStyle = this.customStyles.getRawValue();
    });

    // load saved custom styles from local storage if it exists, or use initial value otherwise
    const savedCustomStyles = localStorage.getItem('custom_styles');
    if (savedCustomStyles) {
      this.customStyles.setValue(JSON.parse(savedCustomStyles));
    }

    this.customStyles.valueChanges.subscribe((value) => {
      this.customStyles$.next(this.customStyles.getRawValue());

      // save custom styles to local storage when it changes
      localStorage.setItem(
        'custom_styles',
        JSON.stringify(this.customStyles.getRawValue())
      );

      this.quillStyle = this.customStyles.getRawValue();
    });
  }

  ngAfterViewInit() {
    const toolbar = this.quillEditorComponent.quillEditor.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler.bind(this));
  }

  //! This is Custom FileHandler
  imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files![0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        console.log(e.target.result);
        const range = this.quillEditorComponent.quillEditor.getSelection(true);

        // create img tag manually with 'Hello World' as src
        const img = document.createElement('img');
        img.src = 'Hello World';
        const Delta = Quill.import('delta');
        const delta = new Delta()
          .retain(range.index)
          .delete(range.length)
          .insert({ image: img.outerHTML });

        this.quillEditorComponent.quillEditor.updateContents(delta);
      };

      reader.readAsDataURL(file);
    };
  }

  onSubmit() {
    console.log(this.quillContent$);
  }

  onEditorCreated(editorInstance: any) {
    this.quillInstance = editorInstance;
  }

  onContentUpdated(newContent: string) {
    // Todo: Handle Applying Custom Styles on Typing (Any Action) In Quill Editor
    // ?  Updating Values of the QuillStyle When Content is Updated (FIXED)
    this.customStyles$ = new BehaviorSubject<CourseArticleConfig>(
      (this.quillStyle = this.customStyles.getRawValue())
    );
    localStorage.setItem(
      'custom_styles',
      JSON.stringify(this.customStyles.getRawValue())
    );
    this.quillContent = newContent;
    // ? Setting And Getting At tHe Same Time
    localStorage.setItem('editor_content', this.quillContent);
    this.quillContent$ = of(localStorage.getItem('editor_content'));
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

  // Log Styles
  logStylesheets(): void {
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i] as CSSStyleSheet;
      try {
        const rules = sheet.cssRules || sheet.rules; // cssRules for standards-compliant browsers, rules for IE
        for (let j = 0; j < rules.length; j++) {
          console.log(rules[j].cssText);
        }
      } catch (e) {
        console.warn(
          'Could not log CSS rules for stylesheet due to security restrictions:',
          sheet.href
        );
      }
    }
  }
}
