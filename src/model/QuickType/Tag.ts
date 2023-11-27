// To parse this data:
//
//   import { Convert, Tag } from "./file";
//
//   const tag = Convert.toTag(json);

export interface Tag {
  tagFieldname: string
  tagName: string
  tagFgcolor: string
  tagBgcolor: string
}

// Converts JSON strings to/from your types
export class Convert {
  public static toTag(json: string): Tag {
    return JSON.parse(json)
  }

  public static tagToJson(value: Tag): string {
    return JSON.stringify(value)
  }
}
