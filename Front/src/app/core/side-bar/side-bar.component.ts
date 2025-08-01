import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
AuthService;

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  sidebarItems = [
    { label: 'Perfil', path: 'profile', roles: ['cliente', 'admin'] },
    { label: 'Mis compras', path: 'my-purchases', roles: ['cliente'] },
    { label: 'Cargar Productos', path: 'product-editor', roles: ['admin'] },

    { label: 'Ventas', path: 'sales', roles: ['admin'] },
  ];

  filteredSidebarItems: any[] = [];
  userRole: string = '';

  @Output() closeSidebar = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() ?? 'user';
    this.updateSidebarItems();
  }

  updateSidebarItems() {
    this.filteredSidebarItems = this.sidebarItems.filter((item) =>
      item.roles.includes(this.userRole)
    );
  }

  onItemClick() {
    this.closeSidebar.emit();
  }
}
