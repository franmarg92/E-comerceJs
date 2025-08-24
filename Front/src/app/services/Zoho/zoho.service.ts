import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZohoService {
  private apiUrl = 'https://distinzionejoyas.com/api/zoho';
  constructor(private http: HttpClient) {}

  enviarMensaje(datos: any): Observable<any> {
    const payload = {
      to: 'contacto@distinzione.com',
      subject: `💎 Contacto desde Joyas Distinzione: ${datos.asunto}`,
      content: `
👤 Nombre: ${datos.nombre}
📧 Email: ${datos.email}
📞 Teléfono: ${datos.telefono}

💬 Mensaje:
${datos.mensaje}
    `,
    };

    return this.http.post(`${this.apiUrl}/send`, payload);
  }
}
