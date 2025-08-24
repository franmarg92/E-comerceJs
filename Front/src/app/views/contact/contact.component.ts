import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { ZohoService } from '../../services/Zoho/zoho.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private zohoService: ZohoService) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      asunto: ['', Validators.required],
      mensaje: ['', Validators.required]
    });
  }

  sendEmail() {
    if (this.contactForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completá todos los campos obligatorios.',
        confirmButtonColor: '#d4af37'
      });
      return;
    }

    const datos = this.contactForm.value;

    Swal.fire({
      title: 'Enviando mensaje...',
      text: 'Por favor esperá un momento.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.zohoService.enviarMensaje(datos).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Mensaje enviado!',
          text: 'Gracias por contactarnos. Te responderemos a la brevedad.',
          confirmButtonColor: '#d4af37'
        });
        this.contactForm.reset();
      },
      error: (error) => {
        console.error('Error al enviar el mensaje:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar',
          text: 'Hubo un problema al enviar el mensaje. Intentá nuevamente más tarde.',
          confirmButtonColor: '#d4af37'
        });
      }
    });
  }

}
