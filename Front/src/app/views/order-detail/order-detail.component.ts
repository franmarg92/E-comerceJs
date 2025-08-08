import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../../models/cartModel';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Address } from '../../models/addressModel';
import { FormsModule } from '@angular/forms';
import { AddressServiceService } from '../../services/addressService/address-service.service';
import { OrderServiceService } from '../../services/orserService/order-service.service';
import Swal from 'sweetalert2';
import { CartService } from '../../services/cart/cart.service';

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
    private cartService: CartService,
    private fb: FormBuilder,
  @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
   if (!isPlatformBrowser(this.platformId)) return;

   this.userId = this.cartService.getUserId() || '';
 

  if (!this.userId) {
    this.router.navigate(['/account']);
    return;
  }

  this.cartService.getCart(this.userId).subscribe({
    next: (cart) => {
      this.items = cart.items;
      this.total = this.cartService.getTotal();
    },
    error: () => {
      Swal.fire('❌ Error', 'No se pudo cargar el carrito.', 'error');
    },
  });

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

     // 🟡 Suscripción reactiva
  this.addressService.addressesObservable$.subscribe(addresses => {
    this.addressList = addresses;
    if (!addresses.length) {
      Swal.fire('📭 Sin direcciones', 'Podés agregar una para continuar.', 'info');
    }
  });

  this.addressService.loadAddresses(this.userId);
  }

  // 🏠 Crear nueva dirección
onCreateAddress(): void {
  const addressData = this.addressForm.value;

  this.addressService.createAddress(addressData).subscribe({
    next: (response) => {
      const nuevaDireccion = response.address;
      this.selectedAddressId = nuevaDireccion._id; // 👈 la seleccionás automáticamente

      Swal.fire('📍 Dirección agregada', '', 'success');
      this.addressForm.reset();
      this.mostrarFormulario = false;

      this.addressService.loadAddresses(this.userId); // 🔁 recarga el listado
    },
    error: (err) =>
      Swal.fire('❌ Error', err.message || 'No se pudo guardar', 'error'),
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
        this.cartService.clearCart(this.userId).subscribe({
          next: () => {
            Swal.fire(
              '✅ Orden creada',
              'Gracias por tu compra! 🛍️',
              'success'
            );
            this.router.navigate(['/dashboard/my-purchases']);
          },
          error: () => {
            Swal.fire(
              '⚠️ Orden creada',
              'Compra registrada pero el carrito no pudo vaciarse.',
              'warning'
            );
            this.router.navigate(['/dashboard/my-purchases']);
          },
        });
      },
      error: () => {
        Swal.fire('❌ Error', 'No se pudo crear la orden.', 'error');
      },
    });
  }
}
