export class GetRole {
    search: any = null;
    limit: number = null;
    startDate: number = null;
    endDate: number = null;
    offset: number = 0;
    userId: number = null;
}

export interface Role {
    privileges: string;
}
