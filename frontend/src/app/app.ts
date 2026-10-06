import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { DashboardComponent } from './dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, DashboardComponent],
  template: `
    @if (!isAuthenticated()) {
      <app-login (loggedIn)="isAuthenticated.set($event)" />
    } @else {
      <app-dashboard (logout)="isAuthenticated.set(false)" />
    }
  `
})
export class App {
  public isAuthenticated = signal<boolean>(false);
}