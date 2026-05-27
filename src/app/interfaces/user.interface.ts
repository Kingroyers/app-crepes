export type userRoles = 'admin' | 'super-admin' | 'user' | 'jefe';
export interface IUser {
  doc: string | '';
  uid: string;
  name: string;
  lastName: string;
  department: string;
  email: string;
  password: string;
  photoURL?: string;
  rol?: userRoles
  state?: string;
  active?: boolean;
  fcmToken?: string;
  fcmTokenUpdatedAt?: string;
  fcmPlatform?: string;
}

export interface IUserCreate extends Omit<IUser, 'uid'> { };
