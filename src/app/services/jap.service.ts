import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JapService {

  private apiUrl = '/api/jap'; // URL do teu back-end

  constructor(private http: HttpClient) { }

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
    // o backend pode aceitar array ou string "1,2,3"; aqui envio array
    return this.http.post(`${this.apiUrl}/orders-status`, { orders });
  }

}
