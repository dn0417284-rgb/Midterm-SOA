import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  constructor(private elRef: ElementRef) { }

  ngAfterViewInit() {
    const counters = this.elRef.nativeElement.querySelectorAll('.counter');
    
    counters.forEach((counter: HTMLElement) => {
      const targetStr = counter.getAttribute('data-target') || '0';
      const target = +targetStr;
      
      // Đặt giá trị bắt đầu luôn là 0 khi load trang
      let currentCount = 0;
      counter.innerText = '0+';

      const updateCount = () => {
        const increment = target / 20;
        
        if (currentCount < target) {
          currentCount = Math.ceil(currentCount + increment);
          if (currentCount > target) currentCount = target;
          
          counter.innerText = currentCount + '+';
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target + '+';
        }
      };

      // Đợi một nhịp nhỏ để DOM render ổn định rồi chạy hiệu ứng
      setTimeout(updateCount, 50);
    });
  }
}
