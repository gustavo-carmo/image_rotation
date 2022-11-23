const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
const array_teste = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];

const convert_array_into_matrix = (array, width) => {
  const line_width = width * 4;
  const matrix_to_return = [];

  while(array.length > 0) {
    matrix_to_return.push(array.splice(0, line_width));
  }

  return matrix_to_return;
}

const rotate = (imageData) => {
  const imageSource = convert_array_into_matrix(imageData.data, imageData.width);
  const matrix_roteted = [];
  const base_rgba = 4;

  const columns_length = imageSource[0].length / base_rgba;
  
  for (let i = 0; i < columns_length; i++) {
    matrix_roteted.push([]);
  };

  for (let i = 0; i < imageSource.length; i++) {
    const row_length = imageSource[i].length;

    for (let j = 0; j < row_length; j += base_rgba) {
      const current_row = imageSource.length - 1 - i;
      const new_matrix_row_to_set_value = j / base_rgba;
      
      matrix_roteted[new_matrix_row_to_set_value].push(imageSource[current_row][j]);
      matrix_roteted[new_matrix_row_to_set_value].push(imageSource[current_row][j + 1]);
      matrix_roteted[new_matrix_row_to_set_value].push(imageSource[current_row][j + 2]);
      matrix_roteted[new_matrix_row_to_set_value].push(imageSource[current_row][j + 3]);
    }
  }
  
  const imageDataReturn = {};
  
  imageDataReturn.data = matrix_roteted.reduce((accumulator, currentValue) => {
    return accumulator.concat(currentValue);
  }, []);
  imageDataReturn.height = matrix_roteted.length;
  imageDataReturn.width = matrix_roteted[0]?.length / base_rgba;
  
  return imageDataReturn;
}

const imageData_copy = {
  data: array_teste,
  width: 3,
  height: 4
}

const imageData = {
  data: array,
  width: 3,
  height: 4
}

console.log("Matrix before rotation");
console.table(convert_array_into_matrix(imageData_copy.data, imageData_copy.width));

console.log("\n\nImageData after rotation");
console.log(rotate(imageData));
