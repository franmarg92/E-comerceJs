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
  console.log('[Header] ngOnInit');

  this.authService.authStatus$.subscribe((status) => {
    console.log('[Header] authStatus$', status);
    this.isAuthenticated = status;
    this.cdr.detectChanges();
  });

  this.authService.user$.subscribe(user => {
    console.log('[Header] user$', user);
    this.user = user;
    if (this.isAuthenticated && user?._id) {
      this.cartService.loadCart(user._id);
    }

    this.userRole = this.authService.getUserRole()?.toLowerCase() || '';
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
