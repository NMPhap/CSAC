import { User } from "./user";

export interface Project {
    id: string;
    name: string;
    startTime?: Date;
    endTime?: Date;
    status?: string;
    participants: Array<User>
}