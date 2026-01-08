export interface Task{
    id: number;
    name: string;
    description?: string;
    category?: string;
    createdBy?: number;
    updatedBy?: number;
    createdOn?: string;
    updatedOn?: string;
}

