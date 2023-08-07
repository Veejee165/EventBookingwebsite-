import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() dataImage!: string;
  cardStyle: any = {};
  mouseX: number = 0;
  mouseY: number = 0;
  width: number = 0;
  height: number = 0;
  mouseLeaveDelay: any = null;

  constructor(private cardRef: ElementRef) { }

  handleMouseMove(event: MouseEvent) {
    const cardElem = this.cardRef.nativeElement.querySelector('.card-wrap');
    const cardRect = cardElem.getBoundingClientRect();
    const offsetX = event.clientX - cardRect.left;
    const offsetY = event.clientY - cardRect.top;
    const centerX = cardRect.width / 2;
    const centerY = cardRect.height / 2;

    // Calculate mouse position as a ratio (-1 to 1) relative to the center of the card
    this.mouseX = (offsetX - centerX) / centerX;
    this.mouseY = (offsetY - centerY) / centerY;
  }
  handleMouseEnter() {
    clearTimeout(this.mouseLeaveDelay);
  }

  handleMouseLeave() {
    this.mouseLeaveDelay = setTimeout(() => {
      this.mouseX = 0;
      this.mouseY = 0;
    }, 1000);
  }

  get cardBgTransform() {
    const tX = this.mouseX * -40;
    const tY = this.mouseY * -40;
    return `translateX(${tX}px) translateY(${tY}px)`;
  }
}
