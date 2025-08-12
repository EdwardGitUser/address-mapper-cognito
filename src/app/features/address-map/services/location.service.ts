import { Injectable } from '@angular/core';
import { Country, State, City, ICity, IState, ICountry } from 'country-state-city';

export interface LocationCountry {
    code: string;
    name: string;
    flag: string;
}

export interface LocationState {
    code: string;
    name: string;
    countryCode: string;
}

export interface LocationCity {
    name: string;
    stateCode: string;
    countryCode: string;
    latitude?: string | null;
    longitude?: string | null;
}

const SUPPORTED_COUNTRY_CODES = [
    'AD', // Andorra
    'AL', // Albania
    'AM', // Armenia
    'AT', // Austria
    'AZ', // Azerbaijan
    'BA', // Bosnia and Herzegovina
    'BE', // Belgium
    'BG', // Bulgaria

    'CH', // Switzerland
    'CY', // Cyprus
    'CZ', // Czechia
    'DE', // Germany
    'DK', // Denmark
    'EE', // Estonia
    'ES', // Spain
    'FI', // Finland
    'FR', // France
    'GB', // United Kingdom
    'GE', // Georgia
    'GR', // Greece
    'HR', // Croatia

    'NL', // Netherlands
    'NO', // Norway
    'PL', // Poland
    'PT', // Portugal

    'SE', // Sweden

    'TR', // Türkiye
    'UA', // Ukraine

    'US', // United States
] as const;

type SupportedCountryCode = (typeof SUPPORTED_COUNTRY_CODES)[number];

export const DEFAULT_COUNTRY_CODE: SupportedCountryCode = 'UA';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    public getSupportedCountries(): LocationCountry[] {
        const allCountries: ICountry[] = Country.getAllCountries();

        return allCountries
            .filter(country =>
                SUPPORTED_COUNTRY_CODES.includes(country.isoCode as SupportedCountryCode)
            )
            .map(country => ({
                code: country.isoCode,
                name: country.name,
                flag: country.flag,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    public getStatesByCountry(countryCode: string): LocationState[] {
        if (!SUPPORTED_COUNTRY_CODES.includes(countryCode as SupportedCountryCode)) {
            return [];
        }

        const states: IState[] = State.getStatesOfCountry(countryCode);

        return states
            .map(state => ({
                code: state.isoCode,
                name: state.name,
                countryCode: state.countryCode,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    public getCitiesByState(countryCode: string, stateCode: string): LocationCity[] {
        if (!SUPPORTED_COUNTRY_CODES.includes(countryCode as SupportedCountryCode)) {
            return [];
        }

        const cities: ICity[] = City.getCitiesOfState(countryCode, stateCode);

        return cities
            .map(city => ({
                name: city.name,
                stateCode: city.stateCode,
                countryCode: city.countryCode,
                latitude: city.latitude || undefined,
                longitude: city.longitude || undefined,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    public getAllCitiesByCountry(countryCode: string): LocationCity[] {
        if (!SUPPORTED_COUNTRY_CODES.includes(countryCode as SupportedCountryCode)) {
            return [];
        }

        const states: LocationState[] = this.getStatesByCountry(countryCode);
        const allCities: LocationCity[] = [];

        states.forEach(state => {
            const cities: LocationCity[] = this.getCitiesByState(countryCode, state.code);
            allCities.push(...cities);
        });

        return allCities
            .filter(
                (city, index, self) =>
                    index ===
                    self.findIndex(c => c.name === city.name && c.countryCode === city.countryCode)
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    public getCountryByCode(countryCode: string): LocationCountry | null {
        const countries: LocationCountry[] = this.getSupportedCountries();
        return countries.find(country => country.code === countryCode) || null;
    }

    public getStateByCode(countryCode: string, stateCode: string): LocationState | null {
        const states: LocationState[] = this.getStatesByCountry(countryCode);
        return states.find(state => state.code === stateCode) || null;
    }

    public isCountrySupported(countryCode: string): boolean {
        return SUPPORTED_COUNTRY_CODES.includes(countryCode as SupportedCountryCode);
    }
}
