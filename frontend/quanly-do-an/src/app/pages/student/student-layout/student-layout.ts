import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StudentSidebar } from '../../../components/student-sidebar/student-sidebar';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StudentSidebar],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css',
})
export class StudentLayout {

}
