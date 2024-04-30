import { Floor } from "../Floor/Floor";

// Elevator class
export class Elevator {
  currentFloor: Floor;
  isMoving: boolean;
  queue: Floor[];
  isWaiting: boolean;
  elevatorElement: HTMLElement;

  constructor(element: HTMLElement) {
    this.currentFloor = new Floor(0);
    this.isMoving = false;
    this.queue = [];
    this.isWaiting = false;
    this.elevatorElement = element;
    this.updateElevatorPosition(); 
  }

  move(floor: Floor) {
    if (!this.isMoving) {
      this.isMoving = true;
      const currentY = parseInt(getComputedStyle(this.elevatorElement).getPropertyValue('transform').split(',')[5], 10);
      const targetY = -57 * floor.level;

      // Calculate the distance and duration of the animation
      const distance = Math.abs(targetY - currentY);
      const animationDuration = distance * 5;

      // Ensure animationDuration is non-negative
      const duration = Math.max(animationDuration, 0);

      // Animate the elevator's movement
      this.animateElevator(currentY, targetY, duration, () => {
        this.currentFloor = floor;
        console.log(`Elevator arrived at floor ${this.currentFloor.level}`);
        this.updateElevatorPosition();
        this.dispatchArrivalEvent(); // Dispatch the arrival event
        this.playSound(); // Play the sound immediately after updating position
        setTimeout(() => { // Add a 2-second delay before checking the queue and moving again
          this.isMoving = false;
          if (this.queue.length > 0) {
            const nextFloor = this.queue.shift();
            if (nextFloor) {
              this.move(nextFloor);
            }
          } else {
            this.isWaiting = false; // Reset isWaiting flag
          }
        }, 2000);
      });
    } else {
      // If the elevator is already moving, add the floor to the queue
      this.queue.push(floor);
      // Update the flag to indicate that the elevator is waiting for its current movement to finish
      this.isWaiting = true;
    }
  }

  // Function to animate the elevator's movement
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
    const audio = new Audio('../assets/ding.mp3');
    audio.play();
    console.log('Ding!');
  }

  updateElevatorPosition() {
    const translateY = `calc(${this.currentFloor.level} * -57px)`;
    this.elevatorElement.style.transform = `translateY(${translateY})`;
  }

  // Method to dispatch the elevator arrival event
  private dispatchArrivalEvent() {
    const arrivalEvent = new CustomEvent('elevatorArrival', {
      detail: {
        floorLevel: this.currentFloor.level
      }
    });
    document.dispatchEvent(arrivalEvent);
  }

}

