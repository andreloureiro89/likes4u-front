import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { Order } from '../model/models/order';
import { v4 as uuidv4 } from 'uuid';

const API = '/api';

@Injectable({
  providedIn: 'root'
})
export class JapService {

  private apiJapUrl = '/api/jap';

  private storageKey = 'likes4uOrderList';
  private orderList: Order[] = [];

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    // Carrega carrinho do localStorage ao iniciar o serviço (singleton)
    const data = localStorage.getItem(this.storageKey);
  }

  // adiciona serviço a lista e ao LocalStorage
  addServiceOrderList(order: Order): void {
    let orderId = uuidv4();
    const cartId = 'c_' + uuidv4();             // gera o id do carrinho
    this.http.post('/api/cart', { cartId, order })
      .subscribe({
        next: () => {},
        error: err => console.error('Falha ao enviar pedido para o backend', err)
      });
 
  }


  // Helper
  private saveOrderKeyToStorage(orderId: string): void {
    localStorage.setItem("OrderIdLikes4u", orderId);
  }

  getKeyValue() {
    const orderId = localStorage.getItem("OrderIdLikes4u");

    if (orderId) {
      // já existe → orderId contém a string que guardaste
      console.log("Order ID encontrado:", orderId);
    } else {
      // não existe → não faz nada
      console.log("Ainda não existe nenhum OrderIdLikes4u.");
    }
  }


}