import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JapService } from '../services/jap.service';
import { Order } from '../model/models/order';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ModalPopupComponent } from '../modal-popup/modal-popup.component';

@Component({
  selector: 'app-checkout-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalPopupComponent],
  templateUrl: './checkout-cart.component.html',
  styleUrls: ['./checkout-cart.component.scss']
})
export class CheckoutCartComponent implements OnInit {

  @ViewChild('confirm') confirm!: ModalPopupComponent;

  orders: Order[] = [];
  loading = true;
  editingId: string | null = null;
  editModel: Partial<Order> = {};
  commentsText = '';

  constructor(private japService: JapService) { }

  ngOnInit(): void {
    // busca os itens atuais do carrinho
    this.refresh('');
  }

  trackById = (_: number, o: Order) => o.id;

  refresh(from: string): void {
    if (from === "atualizar") {
      this.orders = [];
      this.loading = true;
      setTimeout(() => {
        // como o service mantém um array em memória, basta ler de novo
        this.orders = [...this.japService.getOrderList()];
        this.loading = false;
      }, 2000);
    } else {
        this.orders = [...this.japService.getOrderList()];
        this.loading = false;
    }

  }

  editar(order: Order): void {
    if (order.id !== undefined) {
      this.editingId = order.id;
    }
    // cria um draft independente para não “piscar” enquanto editas
    this.editModel = { ...order };
    this.commentsText = (order.comments ?? []).join('\n');
  }

  onCommentsTextareaChange(val: string): void {
    this.commentsText = val;
    this.editModel.comments = val.split('\n');
  }

  cancelarEdicao(): void {
    this.editingId = null;
    this.editModel = {};
  }

  async guardarEdicao() {
    if (!this.editingId) return;

    // validação simples p/ comentários personalizados 554 (ajusta à tua regra)
    if (this.editModel.service === 'comments' && this.editModel.categoria === '554') {
      const qtd = Number(this.editModel.quantity ?? 0);
      const limpos = (this.editModel.comments ?? []).map(c => (c ?? '').trim()).filter(Boolean);
      if (qtd < 2 || qtd > 20 || qtd % 2 !== 0 || limpos.length !== qtd) {
        await this.confirm.open({
          title: 'ATENÇÃO!',
          message: 'Para a categoria PREMIUM de comentários, a número de linhas deve ser igual á quantidade.',
          confirmText: 'OK',
          showCancel: false
        });
        return;
      }

      const ok = await this.confirm.open({
        title: 'Guardar alterações',
        message: 'Confirmas as alterações deste item?',
        confirmText: 'Guardar',
        cancelText: 'Voltar'
      });
      if (!ok) return;

      this.editModel.comments = limpos;
    }

    this.japService.updateServiceOrderList(this.editModel as Order);
    this.cancelarEdicao();
    this.refresh('atualizar');
  }

  async remove(order: Order) {
    const ok = await this.confirm.open({
      title: 'Remover item',
      message: 'Queres mesmo remover este serviço do carrinho?',
      confirmText: 'Remover',
      cancelText: 'Cancelar'
    });
    if (!ok) return;
    this.japService.removeServiceOrderList(order);
    this.refresh('atualizar');
  }

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

  private clampToStep50(n: number): number {
    if (!Number.isFinite(n)) return 50;
    const stepped = Math.round(n / 50) * 50;
    return Math.max(50, stepped);
  }

  decQty() {
    if (!this.editModel) return;

    if (this.editModel.service === 'comments') {
      // de 2 em 2, mínimo 2
      this.editModel.quantity = Math.max(2, (this.editModel.quantity || 2) - 2);
    } else {
      // de 50 em 50, mínimo 50
      this.editModel.quantity = Math.max(50, (this.editModel.quantity || 50) - 50);
    }
  }

  incQty() {
    if (!this.editModel) return;

    if (this.editModel.service === 'comments') {
      // de 2 em 2, máximo 20
      this.editModel.quantity = Math.min(20, (this.editModel.quantity || 2) + 2);
    } else {
      // de 50 em 50, máximo 5000
      this.editModel.quantity = Math.min(5000, (this.editModel.quantity || 50) + 50);
    }
  }

  get commentsAsString(): string {
    return (this.editModel?.comments ?? []).join('\n');
  }

  set commentsAsString(v: string) {
    if (!this.editModel) return;
    this.editModel.comments = (v ?? '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
  }

}