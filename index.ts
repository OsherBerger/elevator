class Floor {
  level: number;

  constructor(level: number) {
    this.level = level;
  }
}

class Elevator {
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
    this.updateElevatorPosition(); // Add this line to set the initial position

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
        this.playSound();
        this.updateElevatorPosition();
        setTimeout(() => { // Add a 2-second delay before checking the queue and moving again
          this.isMoving = false;
          if (this.queue.length > 0) {
            this.isWaiting = true;
            const nextFloor = this.queue.shift();
            if (nextFloor) {
              this.move(nextFloor);
            }
          }
        }, 2000);
      });
    } else {
      this.queue.push(floor);
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
    const audio = new Audio('ding.mp3');
    audio.play();
    console.log('Ding!');
  }

  updateElevatorPosition() {
    const translateY = `calc(${this.currentFloor.level} * -57px)`;
    this.elevatorElement.style.transform = `translateY(${translateY})`;
  }
}

class Building {
  numberOfFloors: number;
  floorButtonsContainer: HTMLElement;

  constructor(numberOfFloors: number, floorButtonsContainer: HTMLElement) {
    this.numberOfFloors = numberOfFloors;
    this.floorButtonsContainer = floorButtonsContainer;
  }

  createFloorButtons() {
    for (let i = this.numberOfFloors; i >= 0; i--) {
      const button = document.createElement('button');
      button.classList.add('floor', 'metal', 'linear');
      button.innerText = i.toString();
  
      button.addEventListener('click', function() {
        requestElevator(new Floor(i));
      }.bind(this));
  
      const div = document.createElement('div');
      div.classList.add('blackline');
  
      const floorDiv = document.createElement('div');
      floorDiv.classList.add('floor');
      floorDiv.appendChild(button);
  
      this.floorButtonsContainer.appendChild(div);
      this.floorButtonsContainer.appendChild(floorDiv);
    }
  }

}

class BuildingFactory {
  createBuilding(numberOfFloors: number, floorButtonsContainer: HTMLElement) {
    return new Building(numberOfFloors, floorButtonsContainer);
  }
}

const floorButtonsContainer = document.getElementById('floorButtonsContainer');
const buildingFactory = new BuildingFactory();

let elevator: Elevator | null = null;

function requestElevator(floor: Floor) {
  if (!elevator) {
    elevator = new Elevator(document.querySelector('.elevator img')!);
  }
  elevator.requestFloor(floor);
}


const numberOfFloors = 15;
const building = buildingFactory.createBuilding(numberOfFloors, floorButtonsContainer!);
building.createFloorButtons();

