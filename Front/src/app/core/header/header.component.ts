import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { CartdropdownComponent } from '../../shared/cartdropdown/cartdropdown.component';
import { User } from '../../models/userModel';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CartdropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isAuthenticated = false;
  user: User | null = null;
  userRole = '';
  isCartOpen = false;
  dropdownOpen = false;
  mobileMenuOpen = false;
  platformId: Object;
  itemCount$!: Observable<number>;
  
  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.platformId = platformId;
    
  }

ngOnInit(): void {
  
    this.itemCount$ = this.cartService.getItemCount();
  // Primero nos suscribimos al estado de autenticación
  this.authService.authStatus$.subscribe((status) => {
    
    this.isAuthenticated = status;
    this.cdr.detectChanges();
  });

  // Luego nos suscribimos al usuario
  this.authService.user$.subscribe((user) => {
    
    this.user = user;

   if (user?._id) {
  this.cartService.loadCart(user._id);  // carrito del usuario logueado
} else {
  this.cartService.loadCart(); // carrito del visitante
}

    this.userRole = user?.role?.toLowerCase() || '';
    this.cdr.detectChanges();
  });
}


  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleCartDropdown(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnClickOutside(event: Event): void {
    const target = event.target as HTMLElement;

    if (
      this.dropdownOpen &&
      !target.closest('.user-dropdown') &&
      !target.closest('.user-toggle-button')
    ) {
      this.dropdownOpen = false;
    }

    if (
      this.isCartOpen &&
      !target.closest('.cart-dropdown') &&
      !target.closest('.cart-toggle-button')
    ) {
      this.isCartOpen = false;
    }

    const isMenuClick = target.closest('.mobile-menu');
    const isHamburgerClick = target.closest('.hamburger');
    const isInteractiveInsideMenu =
      target.closest('.mobile-menu a') || target.closest('.mobile-menu button');

    if (
      this.mobileMenuOpen &&
      (!isMenuClick && !isHamburgerClick || isInteractiveInsideMenu)
    ) {
      this.mobileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    Swal.fire({
      icon: 'info',
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión correctamente.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    }).then(() => this.router.navigate(['/']));
  }

  
}
