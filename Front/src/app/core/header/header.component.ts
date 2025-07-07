import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/userModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuOpen = false;
  dropdownOpen = false;
  isAuthenticated = false;
  user: User | null = null;
  userRole = '';
  isBrowser = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
  

    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.isAuthenticated = !!user;
      this.userRole = this.authService.getUserRole()?.toLowerCase() || '';
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.dropdownOpen && !target.closest('.user-dropdown')) {
      this.dropdownOpen = false;
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
