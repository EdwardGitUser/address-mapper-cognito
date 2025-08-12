import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { AddressFormComponent } from './address-form/address-form.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { AddressesService } from '../../services/addresses.service';
import { CreateAddressRequest } from '../../models/address.model';

@Component({
    selector: 'app-address-dialog',
    standalone: true,
    imports: [
        MatCardModule,
        MatDialogModule,
        MatButtonModule,
        MatSnackBarModule,
        AddressFormComponent,
        GoogleMapComponent,
    ],
    templateUrl: './address-dialog.component.html',
    styleUrl: './address-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressDialogComponent {
    //injections
    private readonly snackBar = inject(MatSnackBar);
    private readonly dialogRef = inject(MatDialogRef<AddressDialogComponent>);
    private readonly addressesService = inject(AddressesService);

    //signals
    public currentAddress = signal<CreateAddressRequest | null>(null);

    public onAddAddress(addressFromSubmit?: CreateAddressRequest): void {
        const address: CreateAddressRequest | null = addressFromSubmit ?? this.currentAddress();
        if (!address) return;

        this.addressesService.addAddress({
            street: address.street,
            city: address.city,
            stateProvince: address.stateProvince,
            country: address.country,
            postalCode: address.postalCode,
        });

        this.snackBar.open('Address added', 'Close', {
            duration: 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });

        this.dialogRef.close(true);
    }

    public onAddressChanged(address: CreateAddressRequest): void {
        this.currentAddress.set(address);
    }
}
