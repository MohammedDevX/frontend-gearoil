import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartDropdown } from './cart-dropdown';

describe('CartDropdown', () => {
  let component: CartDropdown;
  let fixture: ComponentFixture<CartDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
