/** Floor.ts
 * Represents a floor in a building.
 * Each floor has a specific level number.
 */

export class Floor {
  level: number;

   /**
   * Constructs a Floor object with the specified level number.
   * @param level The level number of the floor.
   */
   constructor(level: number) {
    this.level = level;
  }
}
