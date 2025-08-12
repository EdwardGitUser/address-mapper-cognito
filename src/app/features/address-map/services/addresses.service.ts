import { Injectable, signal } from '@angular/core';
import { DEFAULT_ADDRESSES } from '../constants/default-addresses';
import { Address, CreateAddressRequest } from '../models/address.model';

@Injectable({
    providedIn: 'root',
})
export class AddressesService {
    private readonly _addresses = signal<Address[]>(DEFAULT_ADDRESSES);

    public readonly addresses = this._addresses.asReadonly();

    public addAddress(address: CreateAddressRequest): void {
        const newAddress: Address = {
            ...address,
            id: this.generateId(),
            createdAt: new Date(),
        };

        this._addresses.update(addresses => [...addresses, newAddress]);
    }

    public removeAddress(id: string): void {
        this._addresses.update(addresses => addresses.filter(addr => addr.id !== id));
    }

    public updateAddress(id: string, updates: Partial<Omit<Address, 'id' | 'createdAt'>>): void {
        this._addresses.update(addresses =>
            addresses.map(addr => (addr.id === id ? { ...addr, ...updates } : addr))
        );
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}
