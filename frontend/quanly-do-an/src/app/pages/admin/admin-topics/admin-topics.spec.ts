import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTopics } from './admin-topics';

describe('AdminTopics', () => {
  let component: AdminTopics;
  let fixture: ComponentFixture<AdminTopics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTopics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTopics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
