import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from '../../core/side-bar/side-bar.component';


@Component({
  selector: 'app-dashboard',
 standalone:true,
  imports: [RouterModule,CommonModule,SideBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
