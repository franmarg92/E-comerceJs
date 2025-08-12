import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-paids',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './paids.component.html',
  styleUrl: './paids.component.css',
})
export class PaidsComponent implements OnInit {
  orderData: any = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const encodedRef = params['external_reference'];
      if (encodedRef) {
        try {
          this.orderData = JSON.parse(decodeURIComponent(encodedRef));
        } catch (err) {
          console.error('Error decoding external_reference', err);
        }
      }
    });
  }
}
