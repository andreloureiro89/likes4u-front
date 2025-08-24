import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JapService } from '../services/jap.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule], // <— precisa do CommonModule p/ *ngIf
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  orderCount = 0;

  constructor(private router: Router, private japService: JapService) {}

  ngOnInit(): void {
    // valor inicial (caso já exista algo no storage)
    this.orderCount = this.japService.getOrderList().length;

    // atualizações reativas sempre que o service mudar a lista
    this.japService.cartCount$.subscribe(n => this.orderCount = n);
  }

}