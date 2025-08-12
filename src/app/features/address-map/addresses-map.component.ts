import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AddressesService } from './services/addresses.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AddressTableComponent } from './components/address-table/address-table.component';
import { AddressDialogComponent } from './components/address-dialog/address-dialog.component';
import { Address } from './models/address.model';

enum SortOrder {
    Newest = 'newest',
    Oldest = 'oldest',
}

@Component({
    selector: 'app-addresses-map',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule,
        AddressTableComponent,
    ],
    templateUrl: './addresses-map.component.html',
    styleUrl: './addresses-map.component.scss',
})
export class AddressesMapComponent {
    //injections
    private readonly addressesService = inject(AddressesService);
    private readonly dialog = inject(MatDialog);

    public readonly SortOrder = SortOrder;

    //searching & sorting
    public readonly searchControl = new FormControl('');
    public readonly sortControl = new FormControl<SortOrder | null>(SortOrder.Newest);

    private readonly searchTerm = toSignal(
        this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
        { initialValue: '' }
    );
    private readonly sortOrder = toSignal(this.sortControl.valueChanges, {
        initialValue: SortOrder.Newest,
    });

    //addresses
    public readonly addresses = this.addressesService.addresses;
    public readonly filteredAddresses = computed<Address[]>(() => {
        const search: string = (this.searchTerm() || '').toLowerCase();
        const order: SortOrder | null = this.sortOrder();

        const base: Address[] = this.addresses();

        const filtered: Address[] = search
            ? base.filter(
                  address =>
                      address.street.toLowerCase().includes(search) ||
                      address.city.toLowerCase().includes(search) ||
                      address.stateProvince.toLowerCase().includes(search) ||
                      address.country.toLowerCase().includes(search) ||
                      address.postalCode.toLowerCase().includes(search)
              )
            : base.slice();

        if (order === null) {
            return filtered;
        }

        return filtered.sort((a, b) => {
            const diff: number = b.createdAt.getTime() - a.createdAt.getTime();
            return order === SortOrder.Newest ? diff : -diff;
        });
    });

    public onCreateAddress(): void {
        this.dialog.open(AddressDialogComponent, {
            width: '90vw',
            maxWidth: '100vw',
            height: '90vh',
            panelClass: 'create-address-dialog',
        });
    }

    public onRemoveAddress(id: string): void {
        this.addressesService.removeAddress(id);
    }
}
