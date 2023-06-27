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
  ) {}

  ngAfterViewInit(): void {
    this.setStyles(this.config);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const config = changes['config'].currentValue as CourseArticleConfig | null;
    setTimeout(() => {
      this.setStyles(config);
    }, 500); // ? Added Timeout to fix the issue (Not the best solution)
  }

  setStyles(config: CourseArticleConfig | null) {
    if (config) {
      Object.entries(config.elements).forEach(([tag, styles]) => {
        const elements = this.hostElement.nativeElement.querySelectorAll(tag);
        if (elements.length) {
          Object.entries(styles).forEach(([prop, value]) => {
            if (prop === 'border') {
              elements.forEach((el: any) => {
                const borderStyles = styles.border;
                if (borderStyles) {
                  el.style.borderStyle = borderStyles.style;
                  el.style.borderColor = borderStyles.color;
                  el.style.borderTopWidth = borderStyles.top;
                  el.style.borderRightWidth = borderStyles.right;
                  el.style.borderBottomWidth = borderStyles.bottom;
                  el.style.borderLeftWidth = borderStyles.left;
                  el.style.borderWidth = borderStyles.width;
                }
              });
            } else {
              elements.forEach((el: any) => {
                el.style[prop] = value;
              });
            }
          });
        } else {
          console.warn('Could not select the element: ' + tag, this.hostElement);
        }
      });
    }
  }
}
