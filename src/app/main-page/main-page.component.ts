import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerifyUrlService } from '../services/verify-url.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { JapService } from '../services/jap.service';
import { v4 as uuidv4 } from 'uuid';
import { Order } from '../model/models/order';
import { PricingService } from '../services/pricing.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  platform: 'instagram' | 'tiktok' | 'facebook' | 'youtube' | null = null;

  form = { link: '', service: '', categoria: '', quantity: 1000, comments: [] as string[], total: 0 };
  private destroy$ = new Subject<void>();
  private linkInput$ = new Subject<string>();
  comments: string[] = [];
  keyOrder: string | null | undefined;
  commentPremium = false;
  isInstaProfile = false;
  isInstaReels = false;
  isInstaStorie = false;
  showCommentsInputs = false;
  loadingDots = false;
  invalideUrl = false;

  trackByIndex = (_: number, __: unknown) => _;

  servicesList: any = [{
    name: null,
    value: null
  }];
  categoryList: any = [{
    name: null,
    value: null
  }];
  instagramFollowersServices = [
    {
      name: "Followers",
      value: "followers"
    }
  ];
  instagramReelsServices = [
    {
      name: "Views Reels",
      value: "viewReels"
    }
  ];
  instagramStoreisServices = [
    {
      name: "Views Stories",
      value: "viewStories"
    }
  ];
  instagramServices = [
    {
      name: "Likes",
      value: "likes"
    },
    {
      name: "Comments",
      value: "comments"
    }
  ];
  tiktokServices = [{
    name: "Views",
    value: "views"
  }];
  facebookServices = [
    {
      name: "Likes",
      value: "likes"
    }
  ];
  youtubeServices = [
    {
      name: "Views, Like e Comentários",
      value: "viewsLikeComments"
    }
  ];
  instagramLikesCategoryList = [
    {
      name: "ECONOMICO- Qualidade normal, reposição 30 dias",
      value: "1957"
    },
    {
      name: "STANDART - Alta Qualide, sem Reposição",
      value: "8219"
    },
    {
      name: "PREMIUM - Alta Qualidade, não caem",
      value: "1845"
    }
  ];
  instagramFollowersCategoryList = [
    {
      name: "ECONOMICO - Bots, reposição 30 dias",
      value: "1812"
    },
    {
      name: "STANDART - Contas Normais, reposição 30 dias",
      value: "9430"
    },
    {
      name: "PREMIUM - Alta Qualidade, reposição 30 dias",
      value: "3245"
    }
  ];
  instagramCommentsCategoryList = [
    {
      name: "ECONOMICO - Comentário aleatórios com EMOJIS de contas naturais, reposição 30 dias",
      value: "1171"
    },
    {
      name: "STANDART- Comentários aleatórios com EMOJIS, reposição 30 dias",
      value: "668"
    },
    {
      name: "PREMIUM - Comentário personalizados",
      value: "554"
    }
  ];
  instagramReelsViewsCategoryList = [
    {
      name: "ECONOMICO - Contas normais",
      value: "513"
    },
    {
      name: "STANDART - Video Feeds, IGTV, REELS Stories",
      value: "6469"
    },
    {
      name: "PREMIUM - Alta Qualidade, maior retenção",
      value: "6498"
    }
  ];
  instagramStoriesViewsCategoryList = [
    {
      name: "ECONOMICO - Contas normais",
      value: "312"
    },
    {
      name: "STANDART - Alta Qualidade",
      value: "667"
    },
    {
      name: "PREMIUM - Visualizações durante 30 dias, alta qualidade",
      value: "7008"
    }
  ];
  tiktokCategoryList = [
    {
      name: "ECONOMICO - Contas normais",
      value: "9054"
    },
    {
      name: "STANDART - Rápido, contas normais",
      value: "7513"
    },
    {
      name: "PREMIUM - Alta qualidade, reposição 30 dias",
      value: "3365"
    }
  ];
  facebookCategoryList = [
    {
      name: "ECONOMICO - Likes, contas normais",
      value: "1722"
    },
    {
      name: "STANDART - Likes, reposição 30 dias, alta qualidade",
      value: "6297"
    },
    {
      name: "PREMIUM - Likes e seguidores",
      value: "1251"
    }
  ];
  youtubeCategoryList = [
    {
      name: "ECONOMICO - Views, reposição 365 dias",
      value: "876"
    },
    {
      name: "STANDART - Views e 2% likes, reposição 365 dias",
      value: "8089"
    },
    {
      name: "PREMIUM - Views, sem drop out, alta qualidade",
      value: "8466"
    }
  ];

  constructor(
    private verifyService: VerifyUrlService,
    private japService: JapService,
    private pricing: PricingService
  ) { }

  ngOnInit() {

    this.keyOrder = this.japService.getOrderKeyValue();
    
    if (this.keyOrder) {
      this.japService.getCart(this.keyOrder);
    }

    this.linkInput$.pipe(
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
        this.isInstaProfile = false;
        this.isInstaReels = false;
        this.isInstaStorie = false;

        setTimeout(() => {
          if (url) {
            this.verifyService.checkUrl(url).subscribe({
              next: (res) => {
                this.loadingDots = false;
                if (res.valid) {
                  this.isInstaProfile = this.isInstagramProfileLink(url);
                  this.isInstaReels = this.isInstagramReel(url);
                  this.isInstaStorie = this.isInstagramStory(url);
                  this.selectPlatform(res.platform);
                } else {
                  this.form.service = '';
                  this.invalideUrl = true;
                  this.selectPlatform('');
                  this.servicesList = [];
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
    this.ensureCommentsArray();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectPlatform(p: any) {
    this.platform = p;
    const ids = ['instagram', 'tiktok', 'facebook', 'youtube'];

    if (p === 'instagram' && !this.isInstaProfile && !this.isInstaReels && !this.isInstaStorie) {
      this.servicesList = this.instagramServices;
    } else if (p === 'instagram' && this.isInstaProfile) {
      this.servicesList = this.instagramFollowersServices;
    } else if(p === 'instagram' && this.isInstaReels){
      this.servicesList = this.instagramReelsServices;
    } else if(p === 'instagram' && this.isInstaStorie) {
      this.servicesList = this.instagramStoreisServices;
    } else if (p === 'tiktok') {
      this.servicesList = this.tiktokServices;
    } else if (p === 'facebook') {
      this.servicesList = this.facebookServices;
    } else {
      this.servicesList = this.youtubeServices;
    }

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
    this.form = { link: '', service: '', categoria: '', quantity: 1000, comments: [], total: 0 };
    this.platform = null;
    this.showCommentsInputs = false;
  }

  submit() {

    if (!this.form.link || !this.form.service) return;

    let cleanedComments: string[] | undefined;
    if (this.isCustomComments554()) {
      cleanedComments = (this.comments ?? []).map(c => c.trim()).filter(Boolean);
      if (cleanedComments.length !== this.form.quantity) {
        alert(`Precisas de preencher ${this.form.quantity} comentários.`);
        return;
      }
    }

    let keyOrder = this.japService.getOrderKeyValue();

    const payload: Order = {
        id: uuidv4(),
        categoria: this.form.categoria,
        comments: cleanedComments,
        link: this.form.link,
        quantity: this.form.quantity,
        service: this.form.service,
        total:  this.form.total
      };

    if (keyOrder) {
      this.japService.addItemToCart(keyOrder, payload).subscribe();
    } else {
      this.japService.addServiceOrderList(payload);
      this.reset();
    }

  }

  ensureCommentsArray() {
    if (this.isCustomComments554()) {
      this.resizeComments(this.form.quantity || 2);
    } else {
      this.comments = [];
    }
  }

  onLinkChange(event: Event) {
    const url = (event.target as HTMLInputElement).value;
    this.linkInput$.next(url);
  }

  onServiceChange(event: any) {

    if (this.isCustomComments554()) {
      this.onQuantityChange(this.form.quantity);
    } else {
      this.comments = [];
    }

    if (this.platform === 'instagram') {
      if (this.form.service === 'likes') {
        this.categoryList = this.instagramLikesCategoryList;
      } else if (this.form.service === 'followers') {
        this.categoryList = this.instagramFollowersCategoryList;
      } else if (this.form.service === 'comments') {
        this.categoryList = this.instagramCommentsCategoryList;
      } else if (this.form.service === 'viewReels') {
        this.categoryList = this.instagramReelsViewsCategoryList;
      } else {
        this.categoryList = this.instagramStoriesViewsCategoryList;
      }
    } else if (this.platform === 'facebook') {
      this.categoryList = this.facebookCategoryList;
    } else if (this.platform === 'tiktok') {
      this.categoryList = this.tiktokCategoryList;
    } else {
      this.categoryList = this.youtubeCategoryList;
    }

    this.ensureCommentsArray();
    this.showCommentsInputs = this.isCustomComments554();
    this.onQuantityChange(this.form.quantity);
  }

  private isCustomComments554(): boolean {
    return Number(this.form.categoria) === 554;
  }

  getMinQuantity(): number {
    if (this.isCustomComments554()) {
      this.commentPremium = true;
      return 10;
    } else {
      this.commentPremium = false;
      return 1000;
    }
  }

  getMaxQuantity(): number {
    if (this.isCustomComments554()) {
      this.commentPremium = true;
      return 10;
    } else {
      this.commentPremium = false;
      return 50000;
    }
  }

  getStepQuantity(): number {
    if (this.isCustomComments554()) {
      this.commentPremium = true;
      return 10;
    } else {
      this.commentPremium = false;
      return 100
    }
  }

  onQuantityChange(n: number) {
    const serviceId = Number(this.form.categoria);
    if (!serviceId) return;

    // aplica regras específicas para comentários premium (id 554)
    if (this.isCustomComments554()) {
      this.commentPremium = true;
      const min = 10, max = 10, step = 10;
      const clamped = Math.min(max, Math.max(min, Math.round(n / step) * step));
      this.form.quantity = clamped;
      this.resizeComments(this.form.quantity);
    } else {
      this.commentPremium = false;
      const min = 1000, max = 50000, step = 100;
      const clamped = Math.min(max, Math.max(min, Math.round(n / step) * step));
      this.form.quantity = clamped;
      this.resizeComments(this.form.quantity);
    }

    // calcula com margem e mínimo
    this.form.total = this.pricing.calculateEUR(serviceId, this.form.quantity);
  }

  private resizeComments(n: number) {
    const prev = this.comments ?? [];
    const next = Array.from({ length: n }, (_, i) => prev[i] ?? '');
    this.comments = next;
  }

  onCategoryChange() {
    this.ensureCommentsArray();
    this.showCommentsInputs = this.isCustomComments554();
    this.onQuantityChange(this.form.quantity);
  }

  isInstagramProfileLink(link: string): boolean {
    try {
      const url = new URL(link);
      const host = url.hostname.replace(/^www\./, '');

      if (!host.endsWith('instagram.com')) return false;

      const path = url.pathname.replace(/\/+$/, '');
      const segs = path.split('/').filter(Boolean);

      const notProfiles = [
        'p', 'reel', 'tv', 'stories', 'explore', 'accounts', 'about',
        'developer', 'directory', 'legal', 'privacy', 'terms', 'help',
        'web', 'challenge', 'graphql', 'api', 'ads'
      ];

      return segs.length === 1 && !notProfiles.includes(segs[0]);
    } catch {
      return false;
    }
  }

  isInstagramReel(url: string): boolean {
    if (!url) return false;
    const regex = /^https?:\/\/(www\.)?instagram\.com\/reel\//;
    return regex.test(url);
  }

  isInstagramStory(url: string): boolean {
    if (!url) return false;
    const regex = /^https?:\/\/(www\.)?instagram\.com\/stories\//;
    return regex.test(url);
  }

}