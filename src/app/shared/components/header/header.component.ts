import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    public readonly title = input.required<string>();

    private readonly authService = inject(AuthService);

    public isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    public onSignIn() {
        this.authService.signIn();
    }

    public onSignUp() {
        this.authService.signUp();
    }

    public onSignOut() {
        this.authService.signOut();
    }
}
