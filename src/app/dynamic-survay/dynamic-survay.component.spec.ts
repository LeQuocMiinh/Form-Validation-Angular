import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSurvayComponent } from './dynamic-survay.component';

describe('DynamicSurvayComponent', () => {
  let component: DynamicSurvayComponent;
  let fixture: ComponentFixture<DynamicSurvayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSurvayComponent]
    });
    fixture = TestBed.createComponent(DynamicSurvayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
