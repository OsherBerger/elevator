/** Building.ts
 * Represents a building with floors and an elevator system.
 * Creates floor buttons, manages elevator requests, and updates floor buttons' timers.
 */

import { Elevator } from './Elevator';
import { ElevatorSystem } from './ElevatorSystem';
import { Floor } from './Floor';

export class Building {
  private elevatorSystem!: ElevatorSystem;


  /**
   * Constructs a Building object with the specified number of floors, container element, and number of elevators.
   * @param numberOfFloors The number of floors in the building.
   * @param container The container element where the building will be displayed.
   * @param numberOfElevators The number of elevators in the building.
   */
  constructor(private numberOfFloors: number, private container: HTMLElement, private numberOfElevators: number) {
    this.createFloorButtons();
    this.createElevatorSystem();
    this.setupElevatorArrivalListener();
  }

  /**
   * Creates floor buttons for each floor of the building.
   */
  private createFloorButtons() {
    const floorButtonsContainer = this.createFloorButtonsContainer();
    for (let i = 0; i <= this.numberOfFloors; i++) {
      const button = this.createFloorButton(i);
      button.addEventListener('click', () => {
        this.requestElevator(new Floor(i), button);
      });
      const div = this.createBlackLineDiv();
      const floorDiv = this.createFloorDiv(button);
      floorButtonsContainer.appendChild(floorDiv);
      floorButtonsContainer.appendChild(div);
    }
    const scrollContainer = this.createScrollContainer(floorButtonsContainer);
    this.container.appendChild(scrollContainer);
  }

  /**
   * Creates the container for floor buttons.
   * @returns The container element.
   */
  private createFloorButtonsContainer(): HTMLDivElement {
    const floorButtonsContainer = document.createElement('div');
    floorButtonsContainer.classList.add('floorButtonsContainer');
    return floorButtonsContainer;
  }

  /**
   * Creates a floor button.
   * @param floorNumber The number of the floor.
   * @returns The created button element.
   */
  private createFloorButton(floorNumber: number): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('floor', 'metal', 'linear');
    button.innerText = floorNumber.toString();
    const timer = document.createElement('div');
    timer.classList.add('timer');
    button.appendChild(timer);
    return button;
  }

  /**
   * Creates a black line div.
   * @returns The created div element.
   */
  private createBlackLineDiv(): HTMLDivElement {
    const div = document.createElement('div');
    div.classList.add('blackline');
    div.style.height = '7px';
    return div;
  }

  /**
   * Creates a floor div.
   * @param button The button associated with the floor.
   * @returns The created div element.
   */
  private createFloorDiv(button: HTMLButtonElement): HTMLDivElement {
    const floorDiv = document.createElement('div');
    floorDiv.classList.add('floor');
    floorDiv.style.height = '103px';
    floorDiv.appendChild(button);
    return floorDiv;
  }

  /**
   * Creates the scroll container for floor buttons.
   * @param floorButtonsContainer The container for floor buttons.
   * @returns The created scroll container element.
   */
  private createScrollContainer(floorButtonsContainer: HTMLDivElement): HTMLDivElement {
    const scrollContainer = document.createElement('div');
    scrollContainer.classList.add('scrollContainer');
    scrollContainer.appendChild(floorButtonsContainer);
    return scrollContainer;
  }

  /**
   * Initializes the elevator system for the building.
   */
  private createElevatorSystem() {
    const elevatorsContainer = document.createElement('div');
    elevatorsContainer.classList.add('elevatorsContainer', 'elevator');
    elevatorsContainer.style.width = `${this.numberOfElevators * 50}px`; 
    this.container.appendChild(elevatorsContainer);
    this.elevatorSystem = new ElevatorSystem(elevatorsContainer, this.numberOfElevators);
  }

  /**
   * Requests an elevator for the specified floor.
   * @param floor The floor from which the elevator is requested.
   * @param button The button associated with the floor.
   */
  private requestElevator(floor: Floor, button: HTMLButtonElement) {
    this.elevatorSystem.requestElevator(floor);
    button.style.color = 'green';
    this.updateTimer(floor, button);
  }

  /**
   * Sets up a listener for elevator arrival events.
   */
  private setupElevatorArrivalListener() {
    document.addEventListener('elevatorArrival', (event) => {
      const floorLevel = (event as CustomEvent).detail.floorLevel;
      this.handleElevatorArrival(floorLevel);
    });
  }

  /**
   * Handles the arrival of an elevator at a floor.
   * @param floorLevel The level of the floor where the elevator arrived.
   */
  private handleElevatorArrival(floorLevel: number) {
    const buttons = document.querySelectorAll('.floorButtonsContainer .floor button');
    buttons.forEach((button) => {
      if ((button as HTMLButtonElement).innerText === floorLevel.toString()) {
        const timer = button.querySelector('.timer');
        if (timer) {
          timer.remove();
        }
      }
    });
  }

    /**
   * Updates the timer for floor buttons indicating elevator arrival.
   * @param targetFloor The floor for which the timer is updated.
   * @param button The button associated with the floor.
   */
  private updateTimer(targetFloor: Floor, button: HTMLButtonElement) {
    let timer = this.getTimerElement(button);
    if (!timer) {
      timer = this.createTimerElement(button);
    }
    this.updateTimerDisplay(timer, targetFloor, button);
  }

  /**
   * Retrieves the timer element associated with a floor button.
   * @param button The button associated with the floor.
   * @returns The timer element, if found, or null otherwise.
   */
  private getTimerElement(button: HTMLButtonElement): HTMLDivElement | null {
    return button.querySelector('.timer') as HTMLDivElement | null;
  }

  /**
   * Creates a timer element for a floor button.
   * @param button The button associated with the floor.
   * @returns The created timer element.
   */
  private createTimerElement(button: HTMLButtonElement): HTMLDivElement {
    const timer = document.createElement('div');
    timer.classList.add('timer');
    button.appendChild(timer);
    return timer;
  }

  /**
   * Updates the timer display for a floor button indicating elevator arrival.
   * @param timer The timer element.
   * @param targetFloor The floor for which the timer is updated.
   */
  private updateTimerDisplay(timer: HTMLDivElement, targetFloor: Floor, button: HTMLButtonElement) {
    const closestElevator = this.findClosestElevator(targetFloor);
    if (closestElevator) {
      const seconds = this.calculateETA(targetFloor, closestElevator);
      if (seconds <= 0) {
        this.startRedCountdown(timer, button);
      } else {
        this.updateTimerTextAndStyle(timer, seconds);
        this.updateTimerInterval(timer, seconds, button);
      }
    }
  }

  /**
   * Starts the red countdown timer after the elevator arrives at the floor.
   * @param timer The timer element.
   */
  private startRedCountdown(timer: HTMLDivElement, button: HTMLButtonElement) {
    let seconds = 2;
    timer.style.color = 'red';
    timer.innerText = `${seconds}`;
    const interval = setInterval(() => {
      seconds -= 0.5;
      if (seconds >= 0.5) {
        timer.innerText = `${seconds}`;
      } else {
        clearInterval(interval);
        timer.remove();
        button.style.color = '';
      }
    }, 500);
  }

  /**
   * Finds the closest elevator to the target floor.
   * @param targetFloor The target floor.
   * @returns The closest elevator, if found, or null.
   */
  private findClosestElevator(targetFloor: Floor): Elevator | null {
    let closestElevator: Elevator | null = null;
    let minDistance = Infinity;
    this.elevatorSystem.elevators.forEach((elevator: Elevator) => {
      const distance = Math.abs(targetFloor.level - elevator.currentFloor.level);
      if (distance < minDistance) {
        minDistance = distance;
        closestElevator = elevator;
      }
    });
    return closestElevator;
  }

  /**
   * Calculates the estimated time of arrival (ETA) for the closest elevator to the target floor.
   * @param targetFloor The target floor.
   * @param closestElevator The closest elevator.
   * @returns The estimated time of arrival in seconds.
   */
  private calculateETA(targetFloor: Floor, closestElevator: Elevator): number {
    const currentFloor = closestElevator.currentFloor;
    const distance = Math.abs(targetFloor.level - currentFloor.level);
    const queueLength = closestElevator.queue ? closestElevator.queue.length : 0;
    return distance * 0.5 + queueLength;
  }

  /**
   * Updates the timer text and style.
   * @param timer The timer element.
   * @param seconds The remaining time in seconds.
   */
  private updateTimerTextAndStyle(timer: HTMLDivElement, seconds: number) {
    timer.innerText = `${seconds}`;
    timer.style.color = 'green';
  }

  /**
   * Updates the timer every 0.5 seconds until reaching 0.
   * @param timer The timer element.
   * @param seconds The remaining time in seconds.
   */
  private updateTimerInterval(timer: HTMLDivElement, seconds: number, button: HTMLButtonElement) {
    const interval = setInterval(() => {
      seconds -= 0.5;
      if (seconds > 0) {
        timer.innerText = `${seconds}`;
      } else {
        button.style.color = ''
        this.startRedCountdown(timer, button); 
        clearInterval(interval); 
      }
    }, 500);
  }

}
