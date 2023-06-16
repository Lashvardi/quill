import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { CourseArticleConfig } from './custom-styles.model';
ViewEncapsulation.None;
@Directive({
  selector: '[appCustomStyles]',
})
export class CustomStylesDirective implements OnChanges {
  @Input() config!: CourseArticleConfig | null;

  constructor(
    private hostElement: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.setStyles(this.config);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const config = changes['config'].currentValue as CourseArticleConfig | null;

    this.cdr.detectChanges(); // Force view update

    this.setStyles(config);
  }

  setStyles(config: CourseArticleConfig | null) {
    if (config) {
      Object.entries(config.elements).forEach(([tag, styles]) => {
        const elements = this.hostElement.nativeElement.querySelectorAll(tag);
        if (elements.length) {
          Object.entries(styles).forEach(([prop, value]) => {
            if (prop === 'border') {
              elements.forEach((el: any) => {
                el.style.borderStyle = styles.border?.style;
                el.style.borderWidth = styles.border?.width;
                el.style.borderColor = styles.border?.color;
              });
            } else {
              elements.forEach((el: any) => {
                el.style[prop] = value;
              });
            }
          });
        } else {
          console.warn(
            'Could not select the element: ' + tag,
            this.hostElement
          );
        }
      });
    }
  }
}
