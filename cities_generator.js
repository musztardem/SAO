const COORD_DIVISOR = 50;

class CitiesGenerator {
  constructor(citiesCount, maxWidth, maxHeight) {
    this._citiesCount = citiesCount;
    this._maxWidth = maxWidth;
    this._maxHeight = maxHeight;
  }

  generate() {
    let cities = [];
    let xMax = this._maxWidth / COORD_DIVISOR;
    let yMax = this._maxHeight / COORD_DIVISOR;

    for (let i = 0; i < this._citiesCount; i++) {
      let xCoord = Utils.getRandomNumber(0, xMax) * COORD_DIVISOR;
      let yCoord = Utils.getRandomNumber(0, yMax) * COORD_DIVISOR;
      cities.push({ x: xCoord, y: yCoord });
    }

    return cities;
  }
}
