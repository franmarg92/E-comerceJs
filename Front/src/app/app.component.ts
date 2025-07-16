import { Component } from '@angular/core';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { ContentComponent } from './content/content.component';
import { WhatsappIconComponent } from './shared/whatsapp-icon/whatsapp-icon.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, ContentComponent, WhatsappIconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
}
