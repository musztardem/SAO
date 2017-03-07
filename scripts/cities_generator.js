const COORD_DIVISOR = 50;

class CitiesGenerator {
  constructor(citiesCount, maxWidth, maxHeight) {
    this._citiesCount = citiesCount;
    this._maxWidth = maxWidth;
    this._maxHeight = maxHeight;
  }

  generate() {
    const cityIsUnique = (cities, x, y) => {
      return !cities.some(city => {
        return city.x == x && city.y == y;
      });
    }

    let cities = [];
    let xMax = this._maxWidth / COORD_DIVISOR;
    let yMax = this._maxHeight / COORD_DIVISOR;

    for (let i = 0; i < this._citiesCount; i++) {
      let xCoord, yCoord;
      while(true) {
        xCoord = Utils.getRandomNumber(0, xMax) * COORD_DIVISOR;
        yCoord = Utils.getRandomNumber(0, yMax) * COORD_DIVISOR;
        if (cityIsUnique(cities, xCoord, yCoord)) break;
      }

      cities.push({ x: xCoord, y: yCoord });
    }

    return cities;
  }
}
