import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JapService } from '../services/jap.service';
import { Order } from '../model/models/order';

@Component({
  selector: 'app-checkout-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-cart.component.html',
  styleUrls: ['./checkout-cart.component.scss']
})
export class CheckoutCartComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(private japService: JapService) {}

  ngOnInit(): void {
    // busca os itens atuais do carrinho
    this.refresh();
  }

  refresh(): void {
    // como o service mantém um array em memória, basta ler de novo
    this.orders = [...this.japService.getOrderList()];
    this.loading = false;
  }

  remove(order: Order): void {
    this.japService.removeServiceOrderList(order);
    this.refresh();
  }

  trackById = (_: number, o: Order) => o.id;

  // helpers para UI
  serviceLabel(s?: string): string {
    const map: Record<string, string> = {
      likes: 'Likes',
      followers: 'Seguidores',
      comments: 'Comentários',
      viewReels: 'Views Reels',
      viewStories: 'Views Stories',
      views: 'Views'
    };
    return map[s ?? ''] ?? s ?? '';
  }

  categoryLabel(c?: string): string {
    const map: Record<string, string> = {
      econ: 'Económico',
      standard: 'Standard',
      premium: 'Premium',
      // códigos específicos como “554” podes mapear aqui se quiseres:
      '554': 'Premium – Comentário personalizado'
    };
    return map[c ?? ''] ?? c ?? '';
  }

  shortUrl(url?: string): string {
    if (!url) return '';
    try {
      const u = new URL(url);
      const path = u.pathname.replace(/\/+$/, '');
      return `${u.hostname}${path.length > 40 ? path.slice(0, 40) + '…' : path}`;
    } catch {
      return url.length > 60 ? url.slice(0, 60) + '…' : url;
    }
  }

  commentsCount(o: Order): number {
    return Array.isArray(o.comments) ? o.comments.filter(Boolean).length : 0;
  }

  clearOrderList() {
    this.japService.clearOrderList();
  }
}