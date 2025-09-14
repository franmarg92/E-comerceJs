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
import { MercadoPagoService } from '../../services/mercadoPago/mercado-pago.service';

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
    private mercadoPagoService: MercadoPagoService,
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
      this.total = this.cartService.getCartTotal(cart);
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
    Swal.fire('Atención', 'Completá dirección y/o método de pago.', 'warning');
    return;
  }

  let totalConDescuento = this.total;

if (this.selectedPayment === 'Transferencia') {
  totalConDescuento = this.total * 0.8; // Aplica 20% de descuento
}

  const payload = {
    userId: this.userId,
    shippingAddressId: this.selectedAddressId,
    items: this.items,
    totalAmount: this.total,
    paymentMethod: this.selectedPayment,
    notes: this.notes,
  };
  console.log(payload)
if (this.selectedPayment === 'MercadoPago') {
  this.mercadoPagoService.createPreference(payload).subscribe({
    next: (url) => {
      console.log(payload)
      Swal.fire({
        title: 'Redirigiendo a Mercado Pago...',
        text: 'Serás redirigido para completar el pago.',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(null);
          setTimeout(() => {
            window.location.href = url;
          }, 3000); // Pequeño delay para que el usuario vea el mensaje
        }
      });
    },
    error: () => {
      Swal.fire('❌ Error', 'No se pudo iniciar el pago.', 'error');
    }
  }); // Cierre de suscripción
} else if (this.selectedPayment === 'Transferencia') {
  this.orderService.createOrder(payload).subscribe({
    next: (order) => {
      Swal.fire('✅ Orden confirmada', 'Gracias por tu compra.', 'success');
      this.cartService.clearCart(this.userId);
      this.router.navigate(['/dashboard/orders']);
    },
    error: () => {
      Swal.fire('❌ Error', 'No se pudo confirmar la orden.', 'error');
    }
  }); // Cierre de suscripción

}}

abrirWhatsApp() {
  window.open('https://wa.me/5493515194113?text=Hola! Quisiera consultar por envíos al interior desde Distinzione 💎', '_blank');
}

}
