import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonToCss'
})
export class JsonToCssPipe implements PipeTransform {
  transform(json: any): string {
    let css = '';
    for (let selector in json.elements) {
      css += `${selector} {\n`;
      for (let property in json.elements[selector]) {
        css += `  ${property}: ${json.elements[selector][property]};\n`;
      }
      css += `}\n\n`;
    }
    return css;
  }
}
