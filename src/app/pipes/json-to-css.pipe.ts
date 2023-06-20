import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonToCss',
})
export class JsonToCssPipe implements PipeTransform {
  // Implemented Update For Handling Nested Objects.
  transform(json: any): string {
    let css = '';

    if (typeof json !== 'object' || json === null) {
      console.error('Invalid JSON provided to JsonToCssPipe');
      return css;
    }

    if (!json.elements || typeof json.elements !== 'object') {
      console.error('Invalid elements property provided to JsonToCssPipe');
      return css;
    }

    for (let selector in json.elements) {
      if (!json.elements.hasOwnProperty(selector)) continue;

      let properties = json.elements[selector];

      if (typeof properties !== 'object' || properties === null) {
        console.error(
          `Invalid properties for selector ${selector} in JsonToCssPipe`
        );
        continue;
      }

      css += `${selector} {\n`;

      css += this.parseProperties(properties);

      css += `}\n\n`;
    }

    return css;
  }

  parseProperties(properties: any): string {
    let parsedProperties = '';

    for (let property in properties) {
      if (!properties.hasOwnProperty(property)) continue;

      if (
        typeof properties[property] === 'object' &&
        properties[property] !== null
      ) {
        // Recursively handle nested properties
        parsedProperties += `  ${property}: {\n`;
        parsedProperties += this.parseProperties(properties[property]);
        parsedProperties += `  }\n`;
      } else {
        parsedProperties += `  ${property}: ${properties[property]};\n`;
      }
    }

    return parsedProperties;
  }
}
