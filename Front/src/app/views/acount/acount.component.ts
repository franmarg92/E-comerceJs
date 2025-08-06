import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-acount',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './acount.component.html',
  styleUrl: './acount.component.css',
})
export class AcountComponent {
  isLoginView = true;
  accountForm!: FormGroup;
  userRole: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole = localStorage.getItem('role') || 'user';
    }
  }

  toggleView() {
    this.isLoginView = !this.isLoginView;
    this.createForm();
  }

  createForm() {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      ...(this.isLoginView
        ? {}
        : {
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            dni: ['', Validators.required],
            date_of_birth: ['', Validators.required],
            phoneNumber: ['', Validators.required],
          }),
    });
  }

  onSubmit() {
    if (this.accountForm.invalid) return;

    const payload = this.accountForm.value;

    if (this.isLoginView) {
      this.authService.loginUser(payload).subscribe({
        next: (res) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.userRole = res.user.role;
            localStorage.setItem('role', this.userRole);
          }
          this.authService.setAuthState(res.user);
          const user = res.user;
          const role = user?.role;
          const token = res.token;

          Swal.fire({
            icon: 'success',
            title: 'Sesión iniciada',
            text: `¡Bienvenido ${user.name || ''}!`,
            timer: 1000,
            timerProgressBar: true,
          });

          const redirect = this.route.snapshot.queryParams['redirect'];
          const anonymousCart = this.cartService.getAnonymousCart();

          if (redirect === 'checkout' && anonymousCart.length > 0) {
            if (!user?._id) {
              Swal.fire('Error', 'No se pudo obtener el usuario.', 'error');
              return;
            }
            const mergePayload = {
              items: anonymousCart,
              userId: user._id,
            };

            this.cartService.mergeCart(mergePayload).subscribe({
              next: () => {
                localStorage.removeItem('anonymousCart');
                this.cartService.loadCart(user._id);
                this.router.navigate(['/order-detail']);
              },
              error: () => {
                Swal.fire('Error', 'No se pudo fusionar el carrito.', 'error');
              },
            });
          } else {
            if (role === 'admin') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/dashboard/profile']);
            }
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: err.error?.message || 'Usuario o contraseña no validos',
          });
        },
      });
    } else {
      this.authService.registerUser(payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: '¡Ya podés iniciar sesión!',
          });
          this.isLoginView = true;
          this.createForm();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            text: err.error?.message || 'Ocurrió un error inesperado',
          });
        },
      });
    }
  }
}
