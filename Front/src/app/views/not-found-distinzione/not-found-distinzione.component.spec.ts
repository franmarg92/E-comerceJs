import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundDistinzioneComponent } from './not-found-distinzione.component';

describe('NotFoundDistinzioneComponent', () => {
  let component: NotFoundDistinzioneComponent;
  let fixture: ComponentFixture<NotFoundDistinzioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundDistinzioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundDistinzioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
