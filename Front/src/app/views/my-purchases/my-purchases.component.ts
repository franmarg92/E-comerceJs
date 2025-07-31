import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderServiceService } from '../../services/orserService/order-service.service';
import { Order } from '../../models/orderModel';
import { FormsModule } from '@angular/forms';
import { OrderWithDetails } from '../../models/OrderWhitDetails';

@Component({
  selector: 'app-my-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-purchases.component.html',
  styleUrl: './my-purchases.component.css',
})
export class MyPurchasesComponent implements OnInit {
  userId: string = '';
  orders: OrderWithDetails[] = [];

  ngOnInit(): void {
    // Recuperar desde localStorage (modo SSR safe)
    if (typeof window !== 'undefined') {
      this.userId = localStorage.getItem('userId') || '';
    }

    if (this.userId) {
      this.loadOrders();
    }
  }

  constructor(private orderService: OrderServiceService) {}

  loadOrders(): void {
    this.orderService.getOrderByUserId(this.userId).subscribe({
      next: (res) => {
        this.orders = res.orders || [];
        console.log('📦 Órdenes recibidas:', this.orders);
      },
      error: (err) => {
        console.error('❌ Error al cargar órdenes:', err);
      },
    });
  }
}
