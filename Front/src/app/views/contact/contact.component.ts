import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      title: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      message: ['', Validators.required]
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

  const formData = {
    title: this.contactForm.value.title,
    name: this.contactForm.value.name,
    email: this.contactForm.value.email,
    phoneNumber: this.contactForm.value.phoneNumber,
    message: this.contactForm.value.message
  };

  Swal.fire({
    title: 'Enviando mensaje...',
    text: 'Por favor esperá un momento.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading(null);
    }
  });

  emailjs.send(
    'service_jjzxa0b',
    'template_l73cmo8',
    formData,
    '_DjtX78mWa3QF_N1V'
  ).then(() => {
    Swal.fire({
      icon: 'success',
      title: '¡Mensaje enviado!',
      text: 'Gracias por contactarnos. Te responderemos a la brevedad.',
      confirmButtonColor: '#d4af37'
    });
    this.contactForm.reset();
  }).catch((error) => {
    console.error('Error al enviar el mensaje:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al enviar',
      text: 'Hubo un problema al enviar el mensaje. Intentá nuevamente más tarde.',
      confirmButtonColor: '#d4af37'
    });
  });
}

}
