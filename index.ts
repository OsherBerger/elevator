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
    this.updateElevatorPosition(); // Set the initial position
  }

  move(floor: Floor) {
    if (!this.isMoving) {
      // If the elevator is not moving, start moving to the requested floor
      this.isMoving = true;
      const currentY = parseInt(getComputedStyle(this.elevatorElement).getPropertyValue('transform').split(',')[5], 10);
      const targetY = -57 * floor.level;

      // Calculate the distance and duration of the animation
      const distance = Math.abs(targetY - currentY);
      const animationDuration = distance * 8;

      // Ensure animationDuration is non-negative
      const duration = Math.max(animationDuration, 0);

      // Animate the elevator's movement
      this.animateElevator(currentY, targetY, duration, () => {
        this.currentFloor = floor;
        console.log(`Elevator arrived at floor ${this.currentFloor.level}`);
        this.updateElevatorPosition();
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
    const audio = new Audio('ding.mp3');
    audio.play();
    console.log('Ding!');
  }

  updateElevatorPosition() {
    const translateY = `calc(${this.currentFloor.level} * -57px)`;
    this.elevatorElement.style.transform = `translateY(${translateY})`;
  }
}

class ElevatorSystem {
  elevators: Elevator[] = [];

  constructor(private containerId: string, private numberOfElevators: number) {
    this.createElevators();
  }

  private createElevators() {
    const elevatorsContainer = document.getElementById(this.containerId);
    if (elevatorsContainer) {
      for (let i = 0; i < this.numberOfElevators; i++) {
        const elevator = new Elevator(document.createElement('div')); // Create a new Elevator instance
        // Set the initial position of the elevator to the bottom floor
        elevator.currentFloor = new Floor(0);
        // Append the elevator container to the elevatorsContainer
        elevatorsContainer.appendChild(elevator.elevatorElement); 
        // Append an image element to the elevator container for styling
        const elevatorImage = document.createElement('img');
        elevatorImage.src = 'elv.png'; // Set the source of the elevator image
        elevatorImage.alt = 'elevator';
        elevator.elevatorElement.appendChild(elevatorImage); // Append the image to the elevator container
        this.elevators.push(elevator);
      }
    } else {
      console.error(`Element with id ${this.containerId} not found.`);
    }
  }

  requestElevator(floor: Floor) {
    // Find all available elevators
    const availableElevators = this.elevators.filter(elevator => !elevator.isMoving);

    if (availableElevators.length > 0) {
      // Calculate the distance of each available elevator to the requested floor
      const distances = availableElevators.map(elevator => Math.abs(elevator.currentFloor.level - floor.level));

      // Find the index of the nearest available elevator
      const closestElevatorIndex = distances.indexOf(Math.min(...distances));

      // Request the floor for the nearest available elevator
      availableElevators[closestElevatorIndex].requestFloor(floor);
    } else {
      // If all elevators are busy, queue the request until an elevator becomes available
      const distances = this.elevators.map(elevator => Math.abs(elevator.currentFloor.level - floor.level));
      const closestElevatorIndex = distances.indexOf(Math.min(...distances));
      this.elevators[closestElevatorIndex].queue.push(floor);
    }
  }
}


function requestElevator(floor: Floor) {
  elevatorSystem.requestElevator(floor);
}

class Building {
  numberOfFloors: number;
  floorButtonsContainer: HTMLElement;

  constructor(numberOfFloors: number, floorButtonsContainer: HTMLElement) {
    this.numberOfFloors = numberOfFloors;
    this.floorButtonsContainer = floorButtonsContainer;
    this.createFloorButtons();
  }

  createFloorButtons() {
    for (let i = this.numberOfFloors; i >= 0; i--) {
      const button = document.createElement('button');
      button.classList.add('floor', 'metal', 'linear');
      button.innerText = i.toString();

      button.addEventListener('click', function() {
        requestElevator(new Floor(i));
      });

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



const elevatorElements = Array.prototype.slice.call(document.querySelectorAll('.elevator img')) as HTMLElement[];
const floorButtonsContainer = document.getElementById('floorButtonsContainer')!;
const buildingFactory = new BuildingFactory();

const numberOfFloors = 15;
const numberOfElevators = 6;

const elevatorSystem = new ElevatorSystem('elevatorsContainer', numberOfElevators); 
const building = buildingFactory.createBuilding(numberOfFloors, floorButtonsContainer);
