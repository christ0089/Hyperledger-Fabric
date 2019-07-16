export interface Address {
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}


export interface Shelter {
    shelterId: string;
    name: string;
    capacity: number;
    address: Address;
}
