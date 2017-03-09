const POPULATION_SIZE = 20;
const CITIES_COUNT = 15;

const canvasWrapper = new CanvasWrapper();
const MAX_WIDTH = canvasWrapper.getWidth();
const MAX_HEIGHT = canvasWrapper.getHeight();

class GeneticAlgorithm {
  constructor() {
    this._population = [];
  }

  _generateInitialPopulation() {
    const citiesGenerator = new CitiesGenerator(CITIES_COUNT, MAX_WIDTH, MAX_HEIGHT);
    for (let i = 0; i < POPULATION_SIZE; i++) {
      let individual = {
        genome: [],
        fitness: 0
      };
      individual.genome = citiesGenerator.generate();
      this._population.push(individual);
    }
  }

  _evaluate() {
    /*
      Count total distance for each individual in population
    */
  }

  _selection() {
    /*
      Select part of population based on selection strategy (?).
    */
  }

  _crossover() {
    /*
     Apply crossover strategy based on crossover strategy (?)
    */
  }

  _mutation() {
    /*
      Mutate newborn child based on mutation strategy (?)
    */
  }

  start() {
    this._generateInitialPopulation();
  }

  getBestIndividualCities() {
    return this._population[0].genome;
  }
}
