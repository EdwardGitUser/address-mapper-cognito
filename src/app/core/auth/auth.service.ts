import { Injectable, signal } from '@angular/core';
import { fetchAuthSession, signInWithRedirect, signOut } from 'aws-amplify/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly authenticated = signal<boolean>(false);

    constructor() {
        fetchAuthSession()
            .then(session => this.authenticated.set(!!session.tokens?.idToken))
            .catch(() => this.authenticated.set(false));
    }

    public isAuthenticated(): boolean {
        return this.authenticated();
    }

    public signIn(): void {
        signInWithRedirect();
    }

    public signUp(): void {
        signInWithRedirect();
    }

    public signOut(): void {
        signOut();
        this.authenticated.set(false);
    }
}
