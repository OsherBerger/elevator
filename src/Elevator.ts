/**
 * This script represents an elevator that can move between floors within a building.
 * It manages the elevator's movement, queue of floor requests, and updates its position visually.
 */

import { Floor } from "./Floor";

export class Elevator {
  currentFloor: Floor;
  isMoving: boolean;
  queue: Floor[];
  isWaiting: boolean;
  hasMoved:boolean;
  elevatorElement: HTMLElement;

  constructor(element: HTMLElement) {
    this.currentFloor = new Floor(0);
    this.isMoving = false;
    this.queue = [];
    this.isWaiting = false;
    this.hasMoved = false;
    this.elevatorElement = element;
    this.updateElevatorPosition(); 
  }

  move(floor: Floor) {
    if (!this.isMoving) {
      this.isMoving = true;
      // this.hasMoved = true;
      const currentY = parseInt(getComputedStyle(this.elevatorElement).getPropertyValue('transform').split(',')[5], 10);
      const targetY = -57 * floor.level;

      const distance = Math.abs(targetY - currentY);
      const animationDuration = distance * 5;

      const duration = Math.max(animationDuration, 0);

      this.animateElevator(currentY, targetY, duration, () => {
        this.currentFloor = floor;
        console.log(`Elevator arrived at floor ${this.currentFloor.level}`);
        this.updateElevatorPosition();
        this.dispatchArrivalEvent(); 
        this.playSound();
        setTimeout(() => { 
          this.isMoving = false;
          if (this.queue.length > 0) {
            const nextFloor = this.queue.shift();
            if (nextFloor) {
              this.move(nextFloor);
            }
          } else {
            this.isWaiting = false; 
          }
        }, 2000);
      });
    } else {
      this.queue.push(floor);
      this.isWaiting = true;
    }
  }

  animateElevator(start: number, end: number, duration: number, callback: () => void) {
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const newPosition = start + (end - start) * progress;

      this.elevatorElement.style.transform = `translateY(${newPosition}px)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        callback();
      }
    };

    requestAnimationFrame(animate);
  }

  requestFloor(floor: Floor) {
    if (!this.isWaiting) {
      this.move(floor);
    } else {
      this.queue.push(floor);
    }
  }

  playSound() {
    const audio = new Audio('../assets/ding.mp3'); //path is for the bundle.js which is in the dis folder
    audio.play();
    console.log('Ding!');
  }

  updateElevatorPosition() {
    const translateY = `calc(${this.currentFloor.level} * -57px)`;
    this.elevatorElement.style.transform = `translateY(${translateY})`;
  }

  private dispatchArrivalEvent() {
    const arrivalEvent = new CustomEvent('elevatorArrival', {
      detail: {
        floorLevel: this.currentFloor.level
      }
    });
    document.dispatchEvent(arrivalEvent);
  }
}
