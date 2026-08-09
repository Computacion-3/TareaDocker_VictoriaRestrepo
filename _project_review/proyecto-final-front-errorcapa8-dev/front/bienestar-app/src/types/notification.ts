export interface UserNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  relatedEntityId?: number | null;
  userId: number;
  userName: string;
}

export interface NotificationRequest {
  title?: string;
  message: string;
  type?: string;
  relatedEntityId?: number;
  userId: number;
}
