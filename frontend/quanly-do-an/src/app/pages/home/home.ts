
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  private timers: ReturnType<typeof setTimeout>[] = [];
  private destroyed = false;

  constructor(private readonly elRef: ElementRef) {}

  ngAfterViewInit(): void {
    const counters: NodeListOf<HTMLElement> =
      this.elRef.nativeElement.querySelectorAll('.counter');

    counters.forEach((counter) => {
      const target = Number(counter.getAttribute('data-target') || 0);
      let currentCount = 0;

      counter.innerText = '0+';

      const updateCount = (): void => {
        if (this.destroyed) return;

        const increment = Math.max(1, Math.ceil(target / 20));

        if (currentCount < target) {
          currentCount = Math.min(currentCount + increment, target);
          counter.innerText = currentCount + '+';

          const timer = setTimeout(updateCount, 30);
          this.timers.push(timer);
        } else {
          counter.innerText = target + '+';
        }
      };

      const timer = setTimeout(updateCount, 50);
      this.timers.push(timer);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;

    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers = [];
  }
}
