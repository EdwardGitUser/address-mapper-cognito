import { Address } from '../models/address.model';

const streets = [
    'Main',
    'Oak',
    'Pine',
    'Maple',
    'Cedar',
    'Elm',
    'Birch',
    'Willow',
    'Chestnut',
    'Walnut',
];

const cityCatalog = [
    { city: 'New York', stateProvince: 'NY', postalCode: '10001', country: 'USA' },
    { city: 'Los Angeles', stateProvince: 'CA', postalCode: '90001', country: 'USA' },
    { city: 'Chicago', stateProvince: 'IL', postalCode: '60601', country: 'USA' },
    { city: 'Houston', stateProvince: 'TX', postalCode: '77001', country: 'USA' },
    { city: 'Phoenix', stateProvince: 'AZ', postalCode: '85001', country: 'USA' },
    { city: 'Toronto', stateProvince: 'ON', postalCode: 'M5H', country: 'Canada' },
    { city: 'Vancouver', stateProvince: 'BC', postalCode: 'V5K', country: 'Canada' },
    { city: 'London', stateProvince: 'ENG', postalCode: 'SW1A', country: 'UK' },
    { city: 'Berlin', stateProvince: 'BE', postalCode: '10115', country: 'Germany' },
    { city: 'Paris', stateProvince: 'IDF', postalCode: '75001', country: 'France' },
];

function createAddress(id: number): Address {
    const cityInfo = cityCatalog[id % cityCatalog.length];
    const streetName = streets[id % streets.length];
    const streetNumber = 100 + id;

    return {
        id: String(id),
        street: `${streetNumber} ${streetName} Street`,
        city: cityInfo.city,
        stateProvince: cityInfo.stateProvince,
        country: cityInfo.country,
        postalCode: cityInfo.postalCode,
        createdAt: new Date(2024, 0, 1 + (id % 28)),
    };
}

export const DEFAULT_ADDRESSES: Address[] = Array.from({ length: 20 }, (_, i) =>
    createAddress(i + 1)
);
