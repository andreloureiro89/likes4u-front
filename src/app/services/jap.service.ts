import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../model/models/order';

@Injectable({
  providedIn: 'root'
})
export class JapService {

  private apiUrl = '/api/jap';
  private storageKey = 'likes4uOrderList';
  private orderList: Order[] = [];

  constructor(private http: HttpClient) {
    // Carrega carrinho do localStorage ao iniciar o serviço (singleton)
    const data = localStorage.getItem(this.storageKey);
    this.orderList = data ? JSON.parse(data) : [];
  }

  getBalance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/balance`);
  }

  // Ver lista de serviços
  getServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/services`);
  }

  // Criar encomenda
  createOrder(service: number, link: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/order`, { service, link, quantity });
  }

  // Consultar status de encomenda
  getOrderStatus(order: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/status`, { order });
  }

  // pedir refill de uma ordem
  refill(order: number) {
    return this.http.post(`${this.apiUrl}/refill`, { order });
  }

  // estado de um refill
  refillStatus(refill: number) {
    return this.http.post(`${this.apiUrl}/refill-status`, { refill });
  }

  // histórico/lista de refills de uma ordem
  listRefills(order: number) {
    return this.http.post(`${this.apiUrl}/refills`, { order });
  }

  // cancelar uma ordem (se o serviço permitir)
  cancelOrder(order: number) {
    return this.http.post(`${this.apiUrl}/cancel`, { order });
  }

  // (opcional) estado de várias ordens de uma vez
  ordersStatus(orders: number[]) {
    return this.http.post(`${this.apiUrl}/orders-status`, { orders });
  }

  // --------- Carrinho (localStorage) ---------

  getOrderList(): Order[] {
    return this.orderList;
  }

  // adiciona serviço a lista e ao LocalStorage
  addServiceOrderList(order: Order): void {
    this.orderList.push(order);
    this.saveToStorage();
  }

  // editar um pedido
  updateServiceOrderList(updated: Order): void {

    this.getOrderList();

    const idx = this.orderList.findIndex(o => o.id === updated.id);
    if (idx === -1) return; // nada a fazer se não existir

    // substitui o item
    this.orderList[idx] = { ...this.orderList[idx], ...updated };

    // persiste
    localStorage.setItem('likes4uOrderList', JSON.stringify(this.orderList));
  }

  // remove serviço da lista e ao LocalStorage
  removeServiceOrderList(order: Order): void {
    this.orderList = this.orderList.filter(o => o.id !== order.id);
    this.saveToStorage();
  }

  /** Limpa completamente o carrinho (memória + localStorage) */
  clearOrderList(): void {
    this.orderList = [];
    localStorage.removeItem(this.storageKey);
  }

  // Helper
  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.orderList));
  }

}