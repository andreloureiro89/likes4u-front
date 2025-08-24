import { Injectable } from '@angular/core';
// ajusta o caminho conforme a localização do service
import catalog from '../../assets/service-catalog.json';

type CatalogItem = { 
  id: number; 
  ratePerThousandEUR: number; 
  marginMultiplier: number;
  minChargeEUR: number;
};

@Injectable({ providedIn: 'root' })
export class PricingService {
  private map = new Map<number, CatalogItem>();

  constructor() {
    (catalog as CatalogItem[]).forEach(i => this.map.set(i.id, i));
  }


  calculateEUR(id: number, quantity: number): number {
    const item = this.map.get(id);
    if (!item || !quantity) return 0;

    const base = (item.ratePerThousandEUR * quantity) / 1000;
    const withMargin = base * item.marginMultiplier;
    const final = Math.max(withMargin, item.minChargeEUR);

    return parseFloat(final.toFixed(2));
  }
}