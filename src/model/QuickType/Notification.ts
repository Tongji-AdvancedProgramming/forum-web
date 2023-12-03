// To parse this data:
//
//   import { Convert, Notification } from "./file";
//
//   const notification = Convert.toNotification(json);

export interface Notification {
  id: string
  type: string
  title: string
  content: string
  receiver: string
  dateTime: Date
  read: boolean
}

// Converts JSON strings to/from your types
export class Convert {
  public static toNotification(json: string): Notification {
    return JSON.parse(json)
  }

  public static notificationToJson(value: Notification): string {
    return JSON.stringify(value)
  }
}
