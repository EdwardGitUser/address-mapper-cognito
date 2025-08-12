import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Address } from '../../models/address.model';

@Component({
    selector: 'app-address-table',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule],
    templateUrl: './address-table.component.html',
    styleUrl: './address-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressTableComponent {
    public readonly addresses = input.required<Address[]>();
    public readonly remove = output<string>();

    public readonly displayedColumns = [
        'street',
        'cityStatePostal',
        'country',
        'createdAt',
        'actions',
    ] as const;

    public readonly pageIndex = signal(0);
    public readonly pageSize = signal(10);

    public readonly pagedAddresses = computed(() => {
        const all = this.addresses();
        const start = this.pageIndex() * this.pageSize();
        const end = start + this.pageSize();
        return all.slice(start, end);
    });

    public onPage(event: PageEvent): void {
        this.pageIndex.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
    }
}
