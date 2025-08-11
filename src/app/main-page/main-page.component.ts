import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,     // *ngIf, *ngFor, pipes básicos
    FormsModule,      // ngModel, ngForm
    DecimalPipe       // pipe "number"
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  platform: 'instagram' | 'tiktok' | 'facebook' | 'youtube' | null = null;
  form = { link: '', service: '', quantity: 500 };

  selectPlatform(p: any) {
    this.platform = p;
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  reset() {
    this.form = { link: '', service: '', quantity: 500 };
    this.platform = null;
  }

  submit() {
    if (!this.form.link || !this.form.service) return;
    console.table({ platform: this.platform, ...this.form });
    alert('Perfeito! Vamos continuar para o pagamento em breve.');
  }
}