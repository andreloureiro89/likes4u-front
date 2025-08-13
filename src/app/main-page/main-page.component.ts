import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerifyUrlService } from '../services/verify-url.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  platform: 'instagram' | 'tiktok' | 'facebook' | 'youtube' | null = null;
  form = { link: '', service: '', quantity: 500 };
  private destroy$ = new Subject<void>();
  private linkInput$ = new Subject<string>();
  loadingDots = false;
  invalideUrl = false;

  constructor(
    private verifyService: VerifyUrlService
  ) { }

  ngOnInit() {
    this.linkInput$
      .pipe(
        debounceTime(1200),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(url => {
        this.invalideUrl = false;
        if (!url || url.trim() === '') {
          this.loadingDots = false;
          return;
        }

        this.loadingDots = true;

        setTimeout(() => {
              if (url) {
                this.verifyService.checkUrl(url).subscribe({
                  next: (res) => {
                    console.log('Validação:', res);
                    this.loadingDots = false;
                    if (res.valid) {
                      this.selectPlatform(res.platform);
                    } else {
                      this.form.service = '';
                      this.invalideUrl = true;
                      this.selectPlatform('');
                    }
                  },
                  error: (err) => {
                    this.loadingDots = false;
                    console.error('Erro ao validar URL:', err);
                  },
                  complete: () => {
                    // opcional
                  }
                });
              }
        }, 5000);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectPlatform(p: any) {
    this.platform = p;
    const ids = ['instagram', 'tiktok', 'facebook', 'youtube'];

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.backgroundColor = '';
      }
    });

    const selectedEl = document.getElementById(p);
    if (selectedEl) {
      selectedEl.style.backgroundColor = 'rgb(223, 242, 247)';
    }

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

  onLinkChange(event: Event) {
    const url = (event.target as HTMLInputElement).value;
    this.linkInput$.next(url);
  }


}