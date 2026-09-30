import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-slate-900 px-4">
      <div class="w-full max-w-md p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl">
        <div class="flex items-center justify-center mb-6">
          <div class="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">F</div>
        </div>
        <h2 class="text-2xl font-bold text-center text-white mb-2">Acceso a Forenode Enterprise</h2>
        <p class="text-xs text-center text-slate-400 mb-6">Plataforma Global de Emparejamiento Agroindustrial</p>
        
        <form (submit)="onLogin($event)" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Correo Institucional / Operativo</label>
            <input type="email5" [(ngModel)]="email" name="email" required 
                   class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                   placeholder="admin&#64;forenode.org">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Contraseña de Acceso</label>
            <input type="password" [(ngModel)]="password" name="password" required 
                   class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                   placeholder="••••••••">
          </div>
          <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-all text-sm">
            Iniciar Sesión Global
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  public email = 'admin@forenode.org';
  public password = 'secretpassword';
  public loggedIn = output<boolean>();

  public onLogin(event: Event): void {
    event.preventDefault();
    if (this.email && this.password) {
      this.loggedIn.emit(true);
    }
  }
}