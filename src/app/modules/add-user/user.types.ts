export interface User
{
    _id?: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    dateOfBirth: Date | string;
}


export interface UserList
{
    users?: User[];
    count: number;
}
