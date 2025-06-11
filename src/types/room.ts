export interface RoomMember {
  userId: string;
  role: "admin" | "user";
}

export interface RoomProps {
  name: string;
  description: string;
  imageUrl: string;
}

export interface Room extends RoomProps {
  createdBy: string;
  members: RoomMember[];
}

export type CreateRoom = (
  name: string,
  description: string,
  imageUrl: string,
  userId: string
) => Promise<string>;

export type UpdateRoom = (
  roomId: string,
  updates: Partial<RoomProps>
) => Promise<void>;

export type DeleteRoom = (roomId: string) => Promise<void>;

export type AddUserToRoom = (roomId: string, email: string) => Promise<void>;
