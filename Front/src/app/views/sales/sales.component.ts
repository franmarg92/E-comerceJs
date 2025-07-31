import { OrderWithDetails } from './../../models/OrderWhitDetails';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderServiceService } from '../../services/orserService/order-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent {
  orders: OrderWithDetails[] = [];
  searchText: string = '';
  estadoOptions: string[] = ['pending', 'delivered', 'cancelled'];

  constructor(private orderService: OrderServiceService) {}

  ngOnInit(): void {
    this.orderService.getAllOrder().subscribe({
      next: (res) => {
        

        this.orders = res.orders || [];
       
      },
      error: (err) => {
        console.error('❌ Error al cargar todas las órdenes:', err);
      },
    });
  }

  filterOrders(
    orders: OrderWithDetails[],
    searchText: string
  ): OrderWithDetails[] {
    const text = searchText.trim().toLowerCase();
    if (!text) return orders;

    return orders.filter((order) => {
      const client = order.userId;
      const status = order.status || '';

      return (
        client.name.toLowerCase().includes(text) ||
        client.lastName.toLowerCase().includes(text) ||
        client.dni.toString().includes(text) ||
        status.toLowerCase().includes(text)
      );
    });
  }

cambiarEstado(orderId: string, event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const nuevoEstado = selectElement.value;

  this.orderService.updateOrderStatus(orderId, nuevoEstado).subscribe({
    next: (res) => {
      const index = this.orders.findIndex(o => o._id === orderId);
      if (index !== -1) this.orders[index].status = nuevoEstado;
      console.log('✅ Estado actualizado:', res);
    },
    error: (err) => {
      console.error('❌ Error al actualizar estado:', err);
    }
  });
}

}
