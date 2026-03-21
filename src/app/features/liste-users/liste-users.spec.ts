import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeUsers } from './liste-users';

describe('ListeUsers', () => {
  let component: ListeUsers;
  let fixture: ComponentFixture<ListeUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
