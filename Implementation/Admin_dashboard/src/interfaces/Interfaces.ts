export interface User {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    active?: boolean;
}

export interface UserForClient {
    email : string,
    id: string;
}

export interface Client {
    id: string;
    first_name: string;
    last_name: string;
    address: string;
    phone_number: string;
};