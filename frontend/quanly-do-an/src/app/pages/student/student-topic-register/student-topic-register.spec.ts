import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTopicRegister } from './student-topic-register';

describe('StudentTopicRegister', () => {
  let component: StudentTopicRegister;
  let fixture: ComponentFixture<StudentTopicRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTopicRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentTopicRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
