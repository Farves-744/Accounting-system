export class GetRole {
    search: any = null;
    limit: number = null;
    startDate: number = null;
    endDate: number = null;
    offset: number = 0;
    userId: number = null;
}

export class AddRole {
    roleName: string;
    permissions: any = [];
    userId: number = null;
    id?: number = null;
}

export class GetRoleById {
    roleName: string;
    permissions: string[];
    userId: number = null;
    id: number = null;
}

