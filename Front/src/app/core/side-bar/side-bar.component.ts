
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
AuthService

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, CommonModule ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
 sidebarItems = [
    { label: 'Perfil', path: 'profile', roles: ['cliente'] },
    { label: 'Mis compras', path: 'attendance', roles: ['cliente'] },
    { label: 'Cargar Productos', path: 'product-editor', roles: ['admin'] },
    { label: 'Clientes', path: 'wods', roles: ['admin'] },
    { label: 'Configuracion', path: 'users', roles: ['admin'] },
    { label: 'Ventas', path: 'medicalFit', roles: ['admin'] },
    
  ];

  filteredSidebarItems: any[] = [];
  userRole: string = '';

  @Output() closeSidebar = new EventEmitter<void>(); 

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole()?? 'user';
    this.updateSidebarItems();
  }

  updateSidebarItems() {
    this.filteredSidebarItems = this.sidebarItems.filter(item =>
      item.roles.includes(this.userRole)
    );
  }

  onItemClick() {
    this.closeSidebar.emit(); 
  }
}
