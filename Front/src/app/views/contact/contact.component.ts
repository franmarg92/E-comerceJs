import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';

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
      alert('Por favor completá todos los campos obligatorios.');
      return;
    }

    const formData = {
      title: this.contactForm.value.title,
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      phoneNumber: this.contactForm.value.phoneNumber,
      message: this.contactForm.value.message
    };

    emailjs.send(
      'service_jjzxa0b',
      'template_l73cmo8',
      formData,
      '_DjtX78mWa3QF_N1V'
    ).then(() => {
      alert('¡Mensaje enviado con éxito!');
      this.contactForm.reset();
    }).catch((error) => {
      console.error('Error al enviar el mensaje:', error);
      alert('Hubo un error al enviar el mensaje.');
    });
  }
}
