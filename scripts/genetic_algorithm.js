const POPULATION_SIZE = 20;
const CITIES_COUNT = 16;

const canvasWrapper = new CanvasWrapper();
const MAX_WIDTH = canvasWrapper.getWidth();
const MAX_HEIGHT = canvasWrapper.getHeight();

class GeneticAlgorithm {
  constructor() {
    this._population = [];
  }

  _generateInitialPopulation() {
    const citiesGenerator = new CitiesGenerator(CITIES_COUNT, MAX_WIDTH, MAX_HEIGHT);
    const initialCities = citiesGenerator.generate();

    for (let i = 0; i < POPULATION_SIZE; i++) {
      let individual = {
        genome: [],
        fitness: 0
      };
      individual.genome = Utils.shuffle(initialCities);
      individual = this._evaluate(individual); // ?
      this._population.push(individual);
    }
  }

  _evaluate(individual) {
    const { genome } = individual;
    let distance = 0;
    for(let i = 0; i < genome.length; i++) {
      let currCityIndex = i;
      let nextCityIndex = (i+1) % genome.length;

      let a = genome[currCityIndex].x - genome[nextCityIndex].x;
      let b = genome[currCityIndex].y - genome[nextCityIndex].y;
      distance += Math.sqrt( a*a + b*b );
    }
    individual.fitness = distance;

    return individual;
  }

  _select() {
    return this._population.sort((a, b) => {
      return a.fitness - b.fitness;
    }).slice(0, POPULATION_SIZE/2);
  }

  _crossover(mother, father) {
    let sliceIndex = mother.genome.length / 2;
    let motherHalf = mother.genome.slice(0, sliceIndex);
    let fatherHalf = father.genome.slice(0, sliceIndex);

    let son = motherHalf.slice();
    let daughter = fatherHalf.slice();

    for (let city of father.genome) {
      if (Utils.findObjectInArray(son, city) === -1) {
        son.push(city);
      }
    }

    for (let city of mother.genome) {
      if (Utils.findObjectInArray(daughter, city) === -1) {
        daughter.push(city);
      }
    }

    return [
      {
        genome: son,
        fitness: 0
      },
      {
        genome: daughter,
        fitness: 0
      }
    ];
  }

  _mutate(child) {
    const maxIndex = child.genome.length - 1;
    const firstIndex = Utils.getRandomNumber(0, maxIndex);
    const secondIndex = Utils.getRandomNumber(0, maxIndex);

    Utils.swap(child.genome, firstIndex, secondIndex);

    return child;
  }

  _createNewGeneration(individuals) {
    const newGeneration = [];
    for (let i = 0; i < POPULATION_SIZE/2; i++) {
      let motherIndex = Utils.getRandomNumber(0, individuals.length - 1);
      let fatherIndex = Utils.getRandomNumber(0, individuals.length - 1);

      let mother = individuals[motherIndex];
      let father = individuals[fatherIndex];

      let children = this._crossover(mother, father);

      newGeneration.push(this._mutate(children[0]));
      newGeneration.push(this._mutate(children[1]));
    }

    this._population = newGeneration;
  }

  start() {
    const painter = new Painter();
    this._generateInitialPopulation();

    for (let i = 0; i < 1000; i++) {
      this._population.forEach(individual => {
        individual = this._evaluate(individual);
      });
      let selectedIndividuals = this._select();

      console.log('FITNESS -> ' + this._population[0].fitness);

      this._createNewGeneration(selectedIndividuals);

      painter.paint(this._population[0].genome);
    }
  }

  getBestIndividual() {
    return this._population[0].genome;
  }
}
