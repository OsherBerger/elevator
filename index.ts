// Floor class
class Floor {
  level: number;

  constructor(level: number) {
    this.level = level;
  }
}

// Elevator class
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
    const audio = new Audio('ding.mp3');
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

// ElevatorSystem class
class ElevatorSystem {
  elevators: Elevator[] = [];

  constructor(private container: HTMLElement, private numberOfElevators: number) {
    this.createElevators();
  }

  private createElevators() {
    for (let i = 0; i < this.numberOfElevators; i++) {
      const elevator = new Elevator(document.createElement('div')); // Create a new Elevator instance
      // Set the initial position of the elevator to the bottom floor
      elevator.currentFloor = new Floor(0);
      // Append the elevator container to the elevatorsContainer
      this.container.appendChild(elevator.elevatorElement);
      // Append an image element to the elevator container for styling
      const elevatorImage = document.createElement('img');
      elevatorImage.src = 'elv.png'; // Set the source of the elevator image
      elevatorImage.alt = 'elevator';
      elevator.elevatorElement.appendChild(elevatorImage); // Append the image to the elevator container
      this.elevators.push(elevator);
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

// Building class
class Building {

  private elevatorSystem!: ElevatorSystem;


  constructor(private numberOfFloors: number, private container: HTMLElement, private numberOfElevators: number) {
    this.createFloorButtons();
    this.createElevatorSystem();
    this.setupElevatorArrivalListener();
  }

  private createFloorButtons() {
    const floorButtonsContainer = document.createElement('div');
    floorButtonsContainer.classList.add('floorButtonsContainer');

    // Loop from the ground floor (level 0) to the top floor
    for (let i = 0; i <= this.numberOfFloors; i++) {
      const button = document.createElement('button');
      button.classList.add('floor', 'metal', 'linear');
      button.innerText = i.toString();

      const timer = document.createElement('div');
      timer.classList.add('timer');
      button.appendChild(timer); // Append the timer element to the button

      button.addEventListener('click', () => {
        this.requestElevator(new Floor(i), button);
      });

      const div = document.createElement('div');
      div.classList.add('blackline');

      const floorDiv = document.createElement('div');
      floorDiv.classList.add('floor');
      floorDiv.appendChild(button);

      floorButtonsContainer.appendChild(floorDiv);
      floorButtonsContainer.appendChild(div);
    }

    this.container.appendChild(floorButtonsContainer);
}


  private createElevatorSystem() {
    const elevatorsContainer = document.createElement('div');
    elevatorsContainer.classList.add('elevatorsContainer', 'elevator');
    elevatorsContainer.style.width = `${this.numberOfElevators * 50}px`; // Adjust elevator container width

    this.container.appendChild(elevatorsContainer);

    this.elevatorSystem = new ElevatorSystem(elevatorsContainer, this.numberOfElevators);
  }

  private requestElevator(floor: Floor, button: HTMLButtonElement) {
    this.elevatorSystem.requestElevator(floor);

    // Change the color of the button text to green
    button.style.color = 'green';

      // Start the timer for this floor button
  this.updateTimer(floor, button);
  }
  // Method to setup the elevator arrival listener
  private setupElevatorArrivalListener() {
    document.addEventListener('elevatorArrival', (event) => {
      const floorLevel = (event as CustomEvent).detail.floorLevel;
      this.handleElevatorArrival(floorLevel);
    });
  }

// Method to handle the elevator arrival and reset button color
private handleElevatorArrival(floorLevel: number) {
  // Get all buttons within the floorButtonsContainer
  const buttons = document.querySelectorAll('.floorButtonsContainer .floor button');

  // Iterate over each button and find the one with the matching text content
  buttons.forEach((button) => {
    if ((button as HTMLButtonElement).innerText === floorLevel.toString()) {
      // Remove the timer element
      const timer = button.querySelector('.timer');
      if (timer) {
        timer.remove();
      }
    }
  });
}


  private updateTimer(targetFloor: Floor, button: HTMLButtonElement) {
    const timer = button.querySelector('.timer') as HTMLDivElement;
    if (timer) {
      let closestElevator: Elevator | null = null;
      let minDistance = Infinity;

      // Ensure elevatorSystem.elevators only contains Elevator instances
      const elevators: Elevator[] = this.elevatorSystem.elevators.filter(elevator => elevator instanceof Elevator);

      // Find the closest elevator to the target floor
      elevators.forEach((elevator: Elevator) => {
        const distance = Math.abs(targetFloor.level - elevator.currentFloor.level);
        if (distance < minDistance) {
          minDistance = distance;
          closestElevator = elevator;
        }
      });

      if (closestElevator) {
        // Use type assertion to ensure TypeScript recognizes closestElevator as an Elevator instance
        const currentFloor = (closestElevator as Elevator).currentFloor;
        const distance = Math.abs(targetFloor.level - currentFloor.level);
        const etaSeconds = distance * 0.5; // Assuming 0.5 seconds per floor

        let seconds = etaSeconds;
        timer.innerText = `${seconds}`;

        const interval = setInterval(() => {
          seconds--;
          if (seconds >= 0) {
            timer.innerText = `${seconds}`;
          } else {
            clearInterval(interval);
            timer.remove();
            button.style.color = '';
          }
        }, 500);
      }
    }
  }
}

// BuildingFactory class
class BuildingFactory {
  createBuilding(numberOfFloors: number, numberOfElevators: number, marginLeft: number) {
    const container = document.createElement('div');
    container.classList.add('building');
    container.style.width = `${numberOfElevators * 50}px`; // Adjust building width
    container.style.marginLeft = `${marginLeft}px`; // Add margin to the building
    document.getElementById('buildingsContainer')?.appendChild(container);

    const buildingsContainer = document.getElementById('buildingsContainer');
    if (buildingsContainer) {
      buildingsContainer.style.display = 'flex';
    }

    return new Building(numberOfFloors, container, numberOfElevators);
  }
}

// Create buildings
const buildingFactory = new BuildingFactory();
const numberOfFloors = 5;
const numberOfElevators = 3;
const numberOfBuildings = 2;
const buildingMargin = 80 + (numberOfElevators * 50); 


let marginLeft = 0;
for (let i = 0; i < numberOfBuildings; i++) {
  buildingFactory.createBuilding(numberOfFloors, numberOfElevators, marginLeft);
  marginLeft = buildingMargin ; // Adjust the width of the buildings plus margin
}

//ToDo: Improve the Elevator algorithm and update the timer accordingly
//Todo: Improve way to build floors so no problem would appear at any number of floors
