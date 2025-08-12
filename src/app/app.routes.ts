import { Routes } from '@angular/router';
import { AddressesMapComponent } from './features/address-map/addresses-map.component';
import { AddressDialogComponent } from './features/address-map/components/address-dialog/address-dialog.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'addresses' },
    { path: 'addresses', component: AddressesMapComponent, title: 'Addresses' },
];
