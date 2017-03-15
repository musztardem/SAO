class Utils {
  static getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  static swap(array, firstIndex, secondIndex) {
    const tmp = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = tmp;
  }

  static findObjectInArray(arr, obj) {
    return arr.find(el => {
      return el.x === obj.x && el.y === obj.y;
    }) || -1;
  }
}
