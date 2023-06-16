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
  maxWidth: string;
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
  //? Changed For String (Had A Problem With Border Style)
  style: string;
  radius: string;
  radiusTopLeft: string;
  radiusTopRight: string;
  radiusBottomLeft: string;
  radiusBottomRight: string;
  top: string;
  right: string;
  bottom: string;
  left: string;
  
}

export type ElementName =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'p'
  | 'a'
  | 'mark'
  | 'blockquote'
  | '.test_box'
  | 'img';
