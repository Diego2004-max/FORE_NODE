import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-slate-900 px-4">
      <div class="w-full max-w-md p-8 bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl">
        <div class="flex items-center justify-center mb-6">
          <div class="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl">F</div>
        </div>
        <h2 class="text-2xl font-extrabold text-center text-white mb-2">Forenode Enterprise</h2>
        <p class="text-xs text-center text-slate-400 mb-6">Plataforma Global de Emparejamiento Agroindustrial con IA y Datos en Vivo</p>
        
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase mb-2">Ingrese su cuenta de Google (Gmail)</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">✉️</span>
              <input type="email" [(ngModel)]="gmailInput" name="gmailInput" 
                     class="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                     placeholder="tu.nombre&#64;gmail.com">
            </div>
          </div>

          @if (errorMessage()) {
            <p class="text-xs text-red-400 font-medium">{{ errorMessage() }}</p>
          }

          <button (click)="onGoogleLogin()" class="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl shadow-xl transition-all text-sm flex items-center justify-center gap-3 cursor-pointer">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.14C3.18 21.36 7.28 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.61H1.2C.44 8.16 0 9.92 0 12s.44 3.84 1.2 5.39l4.08-3.14z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.28 0 3.18 2.64 1.2 6.61l4.08 3.14c.95-2.84 3.6-4.95 6.72-4.95z"/>
            </svg>
            Continuar con Google Workspace
          </button>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  public gmailInput = 'diegoalejandromallama@gmail.com';
  public errorMessage = signal<string | null>(null);
  public loggedIn = output<boolean>();

  public onGoogleLogin(): void {
    if (!this.gmailInput || !this.gmailInput.includes('@')) {
      this.errorMessage.set('Por favor ingrese un correo válido.');
      return;
    }
    this.errorMessage.set(null);
    this.loggedIn.emit(true);
  }
}