import { User } from "./user";

export interface Activity {
    name: string,
    description: string,
    startDate?: Date,
    endDate?: Date,
    participants: Array<User>,
    attachments?: Array<string>,
    subtask?: Array<Activity>
}