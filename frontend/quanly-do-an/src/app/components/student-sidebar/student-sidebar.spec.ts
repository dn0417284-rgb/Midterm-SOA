import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSidebar } from './student-sidebar';

describe('StudentSidebar', () => {
  let component: StudentSidebar;
  let fixture: ComponentFixture<StudentSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
