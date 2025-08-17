import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerifyUrlService } from '../services/verify-url.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { JapService } from '../services/jap.service';

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

  form = { link: '', service: '', categoria: '', quantity: 500 };
  private destroy$ = new Subject<void>();
  private linkInput$ = new Subject<string>();
  comments: string[] = [];
  
  servicesList: any = [{
    name: null,
    value: null
  }];
  categoryList: any = [{
    name: null,
    value: null
  }];
  instagramServices = [
    {
      name: "Likes",
      value: "likes"
    },
    {
      name: "Followers",
      value: "followers"
    },
    {
      name: "Comments",
      value: "comments"
    },
    {
      name: "Views Reels",
      value: "viewReels"
    },
    {
      name: "Views Stories",
      value: "viewStories"
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
      name: "Views",
      value: "views"
    },
    {
      name: "Views e Likes",
      value: "viewLikes"
    },
    {
      name: "Views, Like e Comentários",
      value: "viewsLikeComments"
    }
  ];
  instagramLikesCategoryList = [
    {
      name: "ECONOMICO - Sem Reposição",
      value: "8219"
    },
    {
      name: "STANDART - Alta Qualide, reposição 30 dias",
      value: "1957"
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
      name: "ECONOMICO - Comentários EMOJIS, reposição 30 dias",
      value: "668"
    },
    {
      name: "STANDART - Comentário EMOJIS de contas naturais, reposição 30 dias",
      value: "1171"
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
      name: "ECONOMICO - Contas normais um storie",
      value: "312"
    },
    {
      name: "STANDART - Alta Qualidade, somente o último storie",
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


  loadingDots = false;
  invalideUrl = false;

  constructor(
    private verifyService: VerifyUrlService,
    private japServices: JapService
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

    if (p === 'instagram') {
      this.servicesList = this.instagramServices;
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
    this.form = { link: '', service: '', categoria: '', quantity: 500 };
    this.platform = null;
  }

  submit() {
    if (!this.form.link || !this.form.service) return;

    const payload: any = { ...this.form };

    if (this.isCustomComments554()) {
      const cleaned = this.comments.map(c => c.trim()).filter(Boolean);
      if (cleaned.length !== this.form.quantity) {
        alert(`Precisas de preencher ${this.form.quantity} comentários.`);
        return;
      }
      payload.comments = cleaned;
    }

    // exemplo de chamada
    console.log('PAYLOAD:', payload);
    this.japServices.getServices().subscribe(res => console.log(res));
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
    console.log("Rede Social escolhida: ", this.platform);
    console.log("Serviço selecionado:", this.form.service);
    console.log("Evento (value):", event.target.value);

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
  }

  isCustomComments554(): boolean {
    return this.form.service === 'comments' && this.form.categoria === '554';
  }

  getMinQuantity(): number {
    return this.isCustomComments554() ? 2 : 50;
  }

  getMaxQuantity(): number {
    return this.isCustomComments554() ? 20 : 5000;
  }

  getStepQuantity(): number {
    return this.isCustomComments554() ? 2 : 100;
  }

  onQuantityChange(n: number) {
    if (this.isCustomComments554()) {
      this.resizeComments(n);
    } else {
      this.comments = [];
    }
  }

  private resizeComments(n: number) {
    // aplica as regras: min 2, max 20, step 2
    const min = 2, max = 20, step = 2;
    let qty = Math.max(min, Math.min(max, n));
    if (qty % step !== 0) qty = qty - (qty % step);
    // mantém o que já foi escrito quando aumenta/diminui
    const next: string[] = new Array(qty).fill('');
    for (let i = 0; i < qty; i++) next[i] = this.comments[i] ?? '';
    this.comments = next;
    this.form.quantity = qty;
  }

  onCategoryChange() {
    this.ensureCommentsArray();
  }


}