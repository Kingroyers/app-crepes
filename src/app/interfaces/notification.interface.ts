export interface INotification {
  type?: string
  id?: string;
  to: string;
  from: string;
  message: string;
  date: string;
  read: boolean;
  event?: {
    title: string;
    start: string;
    end: string;
    description: string;
    department: string;
    responsible: string;
    pdv: string;
    uid: string;
  }
}
