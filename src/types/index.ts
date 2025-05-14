export interface FileInfo {
    name: string;
    path: string;
    isDirectory: boolean;
    size: number;
    created: Date;
    modified: Date;
}


export enum SortType {
    NAME_ASC = 'name_asc',
    NAME_DESC = 'name_desc',
    DATE_ASC = 'date_asc',
    DATE_DESC = 'date_desc',
}