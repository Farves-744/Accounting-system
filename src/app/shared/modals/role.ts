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

export class privilege {
    id: number;
    privilege: string;
    action: number;
    parentId: number;
    length: number;
    hasChild: number;
    isChild: number;
    name: string;
    //extra
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
}

