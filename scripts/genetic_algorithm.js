const POPULATION_SIZE = 20;
const CITIES_COUNT = 100;

const MUTATION_RATIO = 20;
const CROSSOVER_RATIO = 50;
const ELITISM = true;
const ELITISM_RATIO = 20;

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
        // const initialCities = citiesGenerator.generate();
        const initialCities = citiesGenerator.getTestCase('bigOne'); // square, star, octagon

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
        for (let i = 0; i < genome.length; i++) {
            let currCityIndex = i;
            let nextCityIndex = (i + 1) % genome.length;

            let a = genome[currCityIndex].x - genome[nextCityIndex].x;
            let b = genome[currCityIndex].y - genome[nextCityIndex].y;
            distance += Math.sqrt(a * a + b * b);
        }
        individual.fitness = distance;

        return individual;
    }

    _select() {
        const sortedPopulation = this._population.sort((a, b) => {
            return a.fitness - b.fitness;
        });

        const newPopulationSize = Math.floor(POPULATION_SIZE * ELITISM_RATIO / 100);
        if (ELITISM) {
            const topPopulation = sortedPopulation.slice(0, newPopulationSize);
            const newPopulation = topPopulation.concat(this._population);
            return newPopulation.slice(0, POPULATION_SIZE);
        }

        return sortedPopulation;
    }

    _crossover(mother, father) {
        if (Utils.getRandomNumber(0, 100) > CROSSOVER_RATIO) {
            return [mother, father];
        }

        let motherSliceIndex = Utils.getRandomNumber(1, mother.genome.length);
        let fatherSliceIndex = Utils.getRandomNumber(1, father.genome.length);

        let motherHalf = mother.genome.slice(0, motherSliceIndex);
        let fatherHalf = father.genome.slice(0, fatherSliceIndex);

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

        return [{
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
        if (Utils.getRandomNumber(0, 100) > MUTATION_RATIO) return child;

        const maxIndex = child.genome.length - 1;
        const firstIndex = Utils.getRandomNumber(0, maxIndex);
        const secondIndex = Utils.getRandomNumber(0, maxIndex);

        Utils.swap(child.genome, firstIndex, secondIndex);

        return child;
    }

    _createNewGeneration(individuals) {
        const newGeneration = [];
        for (let i = 0; i < POPULATION_SIZE / 2; i++) {
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

    _performLocalOptimization(individual) {
        const distance = (a, b) => {
            let x = a.x - b.x;
            let y = b.y - b.y;

            return Math.sqrt(x * x + y * y);
        }

        const { genome } = individual;
        genome.forEach((el, index) => {
            if (index + 2 < genome.length) {
                let guyToMoveIndex;

                if (distance(el, genome[index + 2]) < distance(el, genome[index + 1])) {
                    guyToMoveIndex = index + 1;
                }

                if (guyToMoveIndex) {
                    let closestGuyIndex = 0;
                    genome.forEach((el2, index2) => {
                        if (index2 + 2 < genome.length && distance(genome[guyToMoveIndex], el2) > 0) {
                            if (distance(genome[guyToMoveIndex], genome[closestGuyIndex]) > distance(genome[guyToMoveIndex], genome[index2])) {
                                closestGuyIndex = index2;
                            }
                        }
                    });
                    let guyToMove = genome.splice(guyToMoveIndex, 1)[0];
                    genome.splice(closestGuyIndex + 1, 0, guyToMove);
                }
            }
        });
        return individual;
    }

    start() {
        const painter = new Painter();
        this._generateInitialPopulation();

        let bestIndividualFitness = Number.POSITIVE_INFINITY;
        let populationCounter = 1;
        let s = setInterval(() => {
            this._population.forEach(individual => {
                individual = this._performLocalOptimization(individual);
                individual = this._evaluate(individual);
            });

            this._gatherData(populationCounter++);
            let selectedIndividuals = this._select();

            if (this._population[0].fitness < bestIndividualFitness) {
                painter.paint(this._population[0].genome);
                bestIndividualFitness = this._population[0].fitness;
            }

            this._createNewGeneration(selectedIndividuals);
        }, 50)
    }

    getBestIndividual() {
        return this._population[0].genome;
    }

    getGatheredData() {
        return this._gatheredData;
    }
}