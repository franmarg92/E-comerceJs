import { UserService } from './../../services/user/user.service';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddressServiceService } from '../../services/addressService/address-service.service';
import Swal from 'sweetalert2';
import { Address } from '../../models/addressModel';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  userForm!: FormGroup;
  passwordForm!: FormGroup;
  addressForm!: FormGroup;
  userId: string = '';
  addressList: Address[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private addressService: AddressServiceService
  ) {}

  ngOnInit(): void {
    const userlocal = JSON.parse(localStorage.getItem('user') || '{}');
   this.userId = userlocal.userId;

    // Inicializás el formulario vacío en ngOnInit()
this.userForm = this.fb.group({
  userId: this.userId,
  name: ['', Validators.required],
  lastName: [''],
  dni: [''],
  email: ['', [Validators.required, Validators.email]],
  phoneNumber: ['']
});

// Luego cargás los datos reales con patchValue
this.userService.getUserById(this.userId).subscribe(res => {
  this.userForm.patchValue({
    name: res.user.name,
    lastName: res.user.lastName,
    dni: res.user.dni,
    email: res.user.email,
    phoneNumber: res.user.phoneNumber || ''
  });
});

    // 🔒 Formulario contraseña
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
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
  }

  // 🧍 Guardar datos personales
  onUpdateUser(): void {
    const formData = this.userForm.value;
    console.log(formData);
    this.userService.editUser( formData).subscribe({
      
      next: () => Swal.fire('✅ Actualizado', 'Datos guardados.', 'success'),
      error: () =>
        Swal.fire('❌ Error', 'No se pudo guardar el perfil.', 'error'),
    });
  }

  // 🔐 Cambiar contraseña
changePassword(): void {
  const { currentPassword, newPassword, confirmPassword} =  this.passwordForm.value;
  

  if (!this.userId) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Usuario no encontrado.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Las contraseñas no coinciden.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    return;
  }

  this.userService.changePassword(this.userId, currentPassword, newPassword).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Contraseña actualizada correctamente.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error.message || 'Hubo un problema al cambiar la contraseña.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    }
  });
}


  // 🏠 Crear nueva dirección
  onCreateAddress(): void {
    const addressData = this.addressForm.value;
    console.log(addressData)
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
}
