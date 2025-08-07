import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderServiceService } from '../../services/orserService/order-service.service';
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
    
   
  if (typeof window !== 'undefined') {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      this.userId = user.userId || '';
     
    } catch (e) {
      console.error('❌ Error parseando userData:', e);
    }
  }
}

  if (this.userId) {
    this.loadOrders();
  }
  }

  constructor(private orderService: OrderServiceService) {}

  loadOrders(): void {
    this.orderService.getOrderByUserId(this.userId).subscribe({
      next: (res) => {
        console.log(res.orders)
        this.orders = res.orders || [];
       
      },
      error: (err) => {
        console.error('❌ Error al cargar órdenes:', err);
      },
    });
  }
}
