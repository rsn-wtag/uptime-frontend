import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWebsiteComponent } from './register-website.component';

describe('RegisterWebsiteComponent', () => {
  let component: RegisterWebsiteComponent;
  let fixture: ComponentFixture<RegisterWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterWebsiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
