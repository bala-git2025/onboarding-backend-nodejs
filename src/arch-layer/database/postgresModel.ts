export interface PostgresRecord extends IdRecord {
    createdBy: string,
    updatedBy: string,
    createdOn: string,
    updatedOn: string
}

export interface IdRecord {
    id: number
}