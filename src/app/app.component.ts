import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/components';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, HeaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
