export interface Address {
    id: string;
    street: string;
    city: string;
    stateProvince: string;
    country: string;
    postalCode: string;
    createdAt: Date;
}

export interface CreateAddressRequest {
    country: string;
    street: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
}

export interface GetAddressRequest {
    country: string;
    street: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
}
