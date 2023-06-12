import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { CourseArticleConfig } from './custom-styles.model';

@Directive({
  selector: '[appCustomStyles]',
})
export class CustomStylesDirective implements OnChanges {
  @Input() config!: CourseArticleConfig | null;

  constructor(private hostElement: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const config = changes['config'].currentValue as CourseArticleConfig | null;
    this.setStyles(config);
    console.log(config)
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
          console.error(
            'Could not select the element: ' + tag,
            this.hostElement
          );
        }
      });
    }
  }
}
