/** Elevator.ts
 * Represents an elevator that can move between floors within a building.
 * Manages the elevator's movement, queue of floor requests, and updates its position visually.
 */

import { Floor } from "./Floor";

export class Elevator {
  currentFloor: Floor;
  isMoving: boolean;
  queue: Floor[];
  isWaiting: boolean;
  elevatorElement: HTMLElement;

  /**
   * Constructs an Elevator object with the specified HTML element.
   * @param element The HTML element representing the elevator.
   */
  constructor(element: HTMLElement) {
    this.currentFloor = new Floor(0);
    this.isMoving = false;
    this.queue = [];
    this.isWaiting = false;
    this.elevatorElement = element;
    this.updateElevatorPosition(); 
  }

  /**
   * Initiates the movement of the elevator to the specified floor.
   * @param floor The target floor.
   */
  move(floor: Floor) {
    if (!this.isMoving) {
      this.isMoving = true;
      this.startElevatorMovement(floor);
    } else {
      this.queue.push(floor);
      this.isWaiting = true;
    }
  }

  /**
   * Starts the elevator's movement animation.
   * @param floor The target floor.
   */
  startElevatorMovement(floor: Floor) {
    const currentY = parseInt(getComputedStyle(this.elevatorElement).getPropertyValue('transform').split(',')[5], 10);
    const targetY = -110 * floor.level;
    const animationDuration = 0.5 * Math.abs(floor.level - this.currentFloor.level) * 1000; 
    this.animateElevator(currentY, targetY, animationDuration, () => {
      this.finishElevatorMovement(floor);
    });
  }

  /**
   * Finishes the elevator's movement after reaching the target floor.
   * @param floor The target floor.
   */
  finishElevatorMovement(floor: Floor) {
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
  }

  /**
   * Animates the elevator's movement between floors.
   * @param start The starting position.
   * @param end The ending position.
   * @param duration The duration of the animation.
   * @param callback A callback function to execute after the animation completes.
   */
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


  /**
   * Requests the elevator to stop at a specific floor.
   * @param floor The target floor.
   */
  requestFloor(floor: Floor) {
    if (!this.isWaiting) {
      this.move(floor);
    } else {
      this.queue.push(floor);
    }
  }

 /**
   * Plays a sound when the elevator arrives at a floor.
   */
  playSound() {
    const audio = new Audio('../assets/ding.mp3'); //path is for the bundle.js which is in the dis folder
    audio.play();
    console.log('Ding!');
  }

  /**
   * Updates the elevator's position visually.
   */
  updateElevatorPosition() {
    const translateY = `calc(${this.currentFloor.level} * -110px)`;
    this.elevatorElement.style.transform = `translateY(${translateY})`;
  }

  /**
   * Dispatches an event when the elevator arrives at a floor.
   */
  private dispatchArrivalEvent() {
    const arrivalEvent = new CustomEvent('elevatorArrival', {
      detail: {
        floorLevel: this.currentFloor.level
      }
    });
    document.dispatchEvent(arrivalEvent);
  }
}
