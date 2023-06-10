// This one is just for a simple playground
export interface CustomStyles {
  color: {
    h1: string;
    p: string;
  };
  size: {
    h1: string;
    p: string;
  };
}

export interface CourseArticleConfig {
  // Probably just strings?
  fontFamilies: string[];
  globalFontFamily: string;

  // {h1: { fontFamily: 'Helvetica', color: 'red'...}}
  elements: Partial<Record<ElementName, Partial<ElementStyles>>>;
}

export interface ElementStyles {
  fontFamily: string;
  fontSize: string;
  fontStyle: string;
  // Changed For String 
  textAlign: string;
  textDecoration: string;
  lineLeight: string;
  letterSpacing: string;
  color: string;
  backgroundColor: string;
  border: Partial<BorderStyles>;
  margin: string;
  padding: string;
}


export interface BorderStyles {
  width: string;
  color: string;
  style: 'none' | 'dotted' | 'inset' | 'solid' | 'dashed';
  radius: string;
  radiusTopLeft: string;
  radiusTopRight: string;
  radiusBottomLeft: string;
  radiusBottomRight: string;
}

export type ElementName =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'p'
  | 'a'
  | 'mark'
  | 'blockquote'
  | 'img';
