import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidsComponent } from './paids.component';

describe('PaidsComponent', () => {
  let component: PaidsComponent;
  let fixture: ComponentFixture<PaidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaidsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
