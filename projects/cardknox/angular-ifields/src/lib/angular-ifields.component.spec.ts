import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularIfieldsComponent } from './angular-ifields.component';

describe('AngularIfieldsComponent', () => {
  let component: AngularIfieldsComponent;
  let fixture: ComponentFixture<AngularIfieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularIfieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularIfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
