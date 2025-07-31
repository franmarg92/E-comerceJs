import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../../models/cartModel';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Address } from '../../models/addressModel';
import { FormsModule } from '@angular/forms';
import { AddressServiceService } from '../../services/addressService/address-service.service';
import { OrderServiceService } from '../../services/orserService/order-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent implements OnInit {
  items: CartItem[] = [];
  total: number = 0;
  userId: string = '';
  selectedAddressId: string = '';
  selectedPayment: string = '';
  notes: string = '';
  addressList: Address[] = [];
  addressForm!: FormGroup;
  mostrarFormulario: boolean = false;

  constructor(
    private router: Router,
    private orderService: OrderServiceService,
    private addressService: AddressServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.items = state.payloadDraft?.items || [];
    this.total = state.payloadDraft?.total || 0;
    this.userId = state.userId || '';

    

    // 🏠 Formulario dirección
    this.addressForm = this.fb.group({
      userId: this.userId,
      street: ['', Validators.required],
      number: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      isDefault: [false],
    });

    this.loadUserAddresses()
  }

  // 🏠 Crear nueva dirección
  onCreateAddress(): void {
    const addressData = this.addressForm.value;
    console.log(addressData);
    this.addressService.createAddress(addressData).subscribe({
      next: () => {
        Swal.fire('📍 Dirección agregada', '', 'success');
        this.addressForm.reset();
      },
      error: (err) =>
        Swal.fire('❌ Error', err.message || 'No se pudo guardar', 'error'),
    });
  }
 loadUserAddresses(): void {
  if (!this.userId) {
    console.warn('🛑 userId no definido');
    Swal.fire('⚠️ Usuario no definido', 'No se puede cargar direcciones.', 'warning');
    return;
  }

  console.log('📤 Solicitando direcciones para userId:', this.userId);

  this.addressService.getAddresses(this.userId).subscribe({
  next: (res) => {
    this.addressList = res.addresses;

    if (!res.addresses.length) {
      Swal.fire(
        '📭 Sin direcciones',
        'Podés agregar una para continuar.',
        'info'
      );
    }

    console.log('📥 Direcciones recibidas:', res.addresses);
  },
  error: (err) => {
    console.error('❌ Error al cargar direcciones:', err);
    this.addressList = [];
    Swal.fire(
      '❌ Error',
      'No se pudieron cargar las direcciones.',
      'error'
    );
  }
});

}


  confirmarOrden(): void {
    if (!this.selectedAddressId || !this.selectedPayment) {
      Swal.fire('Atención', 'Completá dirección y método de pago.', 'warning');
      return;
    }

    const payload = {
      userId: this.userId,
      shippingAddressId: this.selectedAddressId,
      items: this.items,
      totalAmount: this.total, // ⬅️ este es el nombre correcto
      paymentMethod: this.selectedPayment,
      notes: this.notes,
    };

    

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        Swal.fire('✅ Orden creada', 'Gracias por tu compra!', 'success');
        this.router.navigate(['/mi-cuenta/ordenes']);
      },
      error: () => {
        Swal.fire('❌ Error', 'No se pudo crear la orden.', 'error');
      },
    });
  }
}
