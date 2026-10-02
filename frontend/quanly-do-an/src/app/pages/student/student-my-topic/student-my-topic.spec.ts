import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMyTopic } from './student-my-topic';

describe('StudentMyTopic', () => {
  let component: StudentMyTopic;
  let fixture: ComponentFixture<StudentMyTopic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentMyTopic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentMyTopic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
