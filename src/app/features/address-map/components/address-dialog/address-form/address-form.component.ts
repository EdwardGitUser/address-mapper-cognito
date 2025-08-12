import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    signal,
    inject,
    DestroyRef,
    computed,
    output,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, merge, map } from 'rxjs';
import {
    LocationCountry,
    LocationState,
    LocationCity,
    LocationService,
    DEFAULT_COUNTRY_CODE,
} from '../../../services/location.service';
import { CreateAddressRequest } from '../../../models/address.model';

export interface AddressFormControls {
    country: FormControl<string>;
    streetAddress: FormControl<string>;
    addressLine2: FormControl<string>;
    city: FormControl<string>;
    stateProvince: FormControl<string>;
    postalCode: FormControl<string>;
}

export type AddressForm = FormGroup<AddressFormControls>;

@Component({
    selector: 'app-address-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
    ],
    templateUrl: './address-form.component.html',
    styleUrl: './address-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent implements OnInit {
    // outputs-inputs
    public readonly addressChanged = output<CreateAddressRequest>();
    public readonly addAddress = output<CreateAddressRequest>();

    // form
    public addressForm!: AddressForm;
    public readonly isGeneratingQrCode = signal<boolean>(false);

    public readonly countries = signal<LocationCountry[]>([]);
    public readonly selectedCountry = signal<string>('');
    public readonly selectedState = signal<string>('');

    public readonly availableStates = computed<LocationState[]>(() => {
        const countryCode: string = this.selectedCountry();
        return countryCode ? this.locationService.getStatesByCountry(countryCode) : [];
    });

    public readonly availableCities = computed<LocationCity[]>(() => {
        const countryCode: string = this.selectedCountry();
        const stateCode: string = this.selectedState();
        return countryCode && stateCode
            ? this.locationService.getCitiesByState(countryCode, stateCode)
            : [];
    });

    // injections
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly locationService = inject(LocationService);

    public ngOnInit(): void {
        this.initializeLocationData();
        this.buildForm();
        this.subscribeToAddressChanges();
        this.subscribeToFormValueChanges();
    }

    public get countryControl(): FormControl<string> {
        return this.addressForm.controls.country;
    }

    public get streetAddressControl(): FormControl<string> {
        return this.addressForm.controls.streetAddress;
    }

    public get addressLine2Control(): FormControl<string> {
        return this.addressForm.controls.addressLine2;
    }

    public get cityControl(): FormControl<string> {
        return this.addressForm.controls.city;
    }

    public get stateProvinceControl(): FormControl<string> {
        return this.addressForm.controls.stateProvince;
    }

    public get postalCodeControl(): FormControl<string> {
        return this.addressForm.controls.postalCode;
    }
    public onGenerateQrCode(): void {
        if (this.addressForm.valid) {
            this.isGeneratingQrCode.set(true);
            const userAddress: CreateAddressRequest = this.getCurrentAddressValue();

            this.addAddress.emit(userAddress);

            setTimeout(() => this.isGeneratingQrCode.set(false), 1000);
        } else {
            this.addressForm.markAllAsTouched();
        }
    }
    private initializeLocationData(): void {
        this.countries.set(this.locationService.getSupportedCountries());
        this.selectedCountry.set(DEFAULT_COUNTRY_CODE);
    }

    private buildForm(): void {
        const defaultCountryCode = DEFAULT_COUNTRY_CODE;

        this.addressForm = this.fb.group<AddressFormControls>({
            country: this.fb.control(defaultCountryCode, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            streetAddress: this.fb.control('', {
                nonNullable: true,
                validators: [Validators.required, Validators.minLength(5)],
            }),
            addressLine2: this.fb.control('', {
                nonNullable: true,
                validators: [],
            }),
            city: this.fb.control('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            stateProvince: this.fb.control('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            postalCode: this.fb.control('', {
                nonNullable: true,
                validators: [Validators.required, Validators.pattern(/^[A-Z0-9\s-]{3,10}$/i)],
            }),
        });
    }

    private subscribeToAddressChanges(): void {
        this.addressForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
            .subscribe(formValue => {
                if (formValue.country && formValue.city && formValue.stateProvince) {
                    const userAddress: CreateAddressRequest = {
                        country: formValue.country,
                        street: formValue.streetAddress?.trim() || '',
                        addressLine2: formValue.addressLine2?.trim() || undefined,
                        city: formValue.city.trim(),
                        stateProvince: formValue.stateProvince.trim(),
                        postalCode: formValue.postalCode?.trim() || '',
                    };

                    this.addressChanged.emit(userAddress);
                }
            });
    }

    private subscribeToFormValueChanges(): void {
        this.addressForm
            .get('country')!
            .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(countryCode => {
                this.selectedCountry.set(countryCode);
                this.addressForm.patchValue(
                    {
                        stateProvince: '',
                        city: '',
                    },
                    { emitEvent: false }
                );
            });

        this.addressForm
            .get('stateProvince')!
            .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(stateCode => {
                this.selectedState.set(stateCode);
                this.addressForm.patchValue(
                    {
                        city: '',
                    },
                    { emitEvent: false }
                );
            });
    }

    private getCurrentAddressValue(): CreateAddressRequest {
        const formValue = this.addressForm.getRawValue();
        return {
            country: formValue.country,
            street: formValue.streetAddress.trim(),
            addressLine2: formValue.addressLine2?.trim() || undefined,
            city: formValue.city.trim(),
            stateProvince: formValue.stateProvince.trim(),
            postalCode: formValue.postalCode.trim(),
        };
    }
}
