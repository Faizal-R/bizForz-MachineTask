export interface PermissionsDTO{
    id:string;
    name:string;
    category:string;
    description:string;
    tenantId:string | null;
}