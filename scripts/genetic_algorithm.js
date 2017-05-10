const POPULATION_SIZE = 20;
const CITIES_COUNT = 30

const RANDOMLY_CHOOSEN_CROSS_SLICE_INDEX = 1; // 1-true or 0-false
const CROSS_PROBABILITY_PERCENT = 20;
const MUTATION_PROBABILITY_PERMIL = 10

const ELITE_GENOMS_ONLY = 0 // Only top 50% of poulation will be selected to next population
const LEAVE_PERCENT_OF_TOP_GENOMS = 20 // Only LEAVE_PERCENT_OF_TOP_GENOMS percent of best genoms (top 50%) will be selected

const canvasWrapper = new CanvasWrapper();
const MAX_WIDTH = canvasWrapper.getWidth();
const MAX_HEIGHT = canvasWrapper.getHeight();

class GeneticAlgorithm {
  constructor() {
    this._population = [];
    this._gatheredData = [];
  }

  _generateInitialPopulation() {
    const citiesGenerator = new CitiesGenerator(CITIES_COUNT, MAX_WIDTH, MAX_HEIGHT);
    const initialCities = citiesGenerator.generate();
    // const initialCities = citiesGenerator.getTestCase('octagon'); // square, star, octagon

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
	  var topPopulation = [];
	  if (ELITE_GENOMS_ONLY > 0){
		  topPopulation = this._population.sort((a, b) => {
										  return a.fitness - b.fitness;
										}).slice(0, POPULATION_SIZE/2);
		  return topPopulation;
	  }
	  topPopulation = this._population.sort((a, b) => {
										  return a.fitness - b.fitness;
										}).slice(0, Math.floor(((POPULATION_SIZE/2)*LEAVE_PERCENT_OF_TOP_GENOMS)/100));
										
	  var selectedPopulation = this._population.concat(topPopulation);
	  return selectedPopulation.slice(0, POPULATION_SIZE/2);
  }

  _crossover(mother, father) {
	 if (Utils.getRandomNumber(0, 100) < CROSS_PROBABILITY) {
		let sliceIndex = mother.genome.length / 2;
		if (RANDOMLY_CHOOSEN_SLICE_INDEX > 0){
			Utils.getRandomNumber(0, mother.genome.length)
		}
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
	 
	 return [
		  {
			genome: mother,
			fitness: 0
		  },
		  {
			genome: father,
			fitness: 0
		  }
		];
  }

  _mutate(child) {
	  if (Utils.getRandomNumber(0, 1000) < MUTATION_PROBABILITY_PERMIL) {
		const maxIndex = child.genome.length - 1;
		const firstIndex = Utils.getRandomNumber(0, maxIndex);
		const secondIndex = Utils.getRandomNumber(0, maxIndex);

		Utils.swap(child.genome, firstIndex, secondIndex);
	  }
	  
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

  _gatherData(populationCounter) {
    let sum = 0;
    let max = this._population[0].fitness;
    let min = max;

    for (let ind of this._population) {
      sum += ind.fitness;
      if (ind.fitness > max) max = ind.fitness;
      if (ind.fitness < min) min = ind.fitness;
    }

    let avg = sum / this._population.length;

    this._gatheredData.push([
      populationCounter,
      max,
      avg,
      min
    ]);
  }

  start() {
    const painter = new Painter();
    this._generateInitialPopulation();

    let bestIndividualFitness = 100000;
    let populationCounter = 1;
    let s = setInterval(() => {
      this._population.forEach(individual => {
        individual = this._evaluate(individual);
      });

      this._gatherData(populationCounter++);
      let selectedIndividuals = this._select();

      if (this._population[0].fitness < bestIndividualFitness) {
        painter.paint(this._population[0].genome);
        bestIndividualFitness = this._population[0].fitness;
      }

      this._createNewGeneration(selectedIndividuals);
    }, 25)
  }

  getBestIndividual() {
    return this._population[0].genome;
  }

  getGatheredData() {
    return this._gatheredData;
  }
}
