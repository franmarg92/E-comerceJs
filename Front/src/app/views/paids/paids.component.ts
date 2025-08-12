import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { decodeExternalReference } from '../../helpers/decodeExternalReference';
import { OrderData } from '../../models/orderData';
@Component({
  selector: 'app-paids',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './paids.component.html',
  styleUrl: './paids.component.css',
})
export class PaidsComponent implements OnInit {
orderData: OrderData | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const encodedRef = params.get('external_reference');
      this.orderData = encodedRef ? decodeExternalReference(encodedRef) : null;

      if (!this.orderData) {
        console.warn('⚠️ external_reference inválido o malformado');
      } else {
        console.log('✅ Orden decodificada:', this.orderData);
      }
    });
  }
}
