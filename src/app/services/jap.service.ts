import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Order } from '../model/models/order';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

const API = '/api';

@Injectable({
  providedIn: 'root'
})
export class JapService {

  private storageKey = 'likes4uOrderList';
  private orderList: Order[] = [];
  cartId: string | null = '';

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const data = localStorage.getItem(this.storageKey);
    this.orderList = data ? JSON.parse(data) : [];
    this.cartCountSubject.next(this.orderList.length);
  }

  addServiceOrderList(order: Order): void {
    const cartId = 'c_' + uuidv4();
    this.http.post('/api/cart', { cartId, order }).subscribe({
      next: () => {
        this.orderList = [...this.orderList, order];
        this.saveOrderKeyToStorage(cartId);
        this.cartCountSubject.next(this.orderList.length);
        this.refreshComponent();
      },
      error: err => console.error('Falha ao enviar pedido para o backend', err)
    });
  }

  refreshComponent() {
    window.location.reload();
  }

  getCart(cartId: string): void {
    this.http.get(`/api/cart/${cartId}`).subscribe({
      next: (res: any) => {        
        if (res.orderList.length == 0) {
          // carrinho inexistente → limpa tudo e zera badge
          this.orderList = [];
          this.removeOrderKeyLocalStorage();
          this.deleteCart();
          return;
        }

        this.orderList = res.orderList ?? [];
        // >>> isto é o que faltava: emitir para o badge
        this.cartCountSubject.next(this.orderList.length);
      },
      error: err => {
        this.removeOrderKeyLocalStorage();
        console.error('Falha a obter cart', err);
        // em erro também não deixes o badge “preso”
        this.cartCountSubject.next(this.orderList.length || 0);
      }
    });
  }

  private saveOrderKeyToStorage(orderId: string): void {
    localStorage.setItem("OrderIdLikes4u", orderId);
  }

  getOrderList() {
    return this.orderList;
  }

  getOrderKeyValue() {
    this.cartId = localStorage.getItem("OrderIdLikes4u");    
    return this.cartId;
  }

  removeOrderKeyLocalStorage() {
    localStorage.removeItem('OrderIdLikes4u');
  }

  addItemToCart(cartId: string, order: Order): Observable<{
    cartId: string; itemsCount: number; totalCart: number; orderAdded: Order;
  }> {
    return this.http.post<{
      cartId: string; itemsCount: number; totalCart: number; orderAdded: Order;
    }>(`/api/cart/${cartId}/items`, order).pipe(
      tap(res => {
        // opcional: sincronizar estado local e badge
        this.orderList.push(order);
        this.cartCountSubject.next(this.orderList.length);
        this.refreshComponent();
      })
    );
  }

  removeService(serviceId: string) {
    this.http.delete(`/api/cart/${this.cartId}/${serviceId}`).subscribe({
      next: (res: any) => {
        this.orderList = res.cart.orderList;
        this.cartCountSubject.next(this.orderList.length);
      },
      error: err => console.error('Erro ao remover serviço', err)
    });
  }

  deleteCart(): void {
    this.http.delete(`/api/cart/${this.cartId}`).subscribe({
      next: () => {
        this.orderList = [];
        this.cartCountSubject.next(0);
        this.removeOrderKeyLocalStorage();
      },
      error: err => console.error('Erro ao apagar carrinho', err)
    });
  }

  // Atualiza uma order dentro do carrinho
  updateOrder(orderId: string, patch: Partial<Order>) {
    return this.http.put<any>(`/api/cart/${this.cartId}/items/${orderId}`, patch)
      .subscribe({
        next: (res) => {
          // sincroniza lista local e badge
          this.orderList = res.cart.orderList;
          this.cartCountSubject.next(this.orderList.length);
        },
        error: (err) => console.error('Erro ao atualizar serviço', err)
      });
  }

}