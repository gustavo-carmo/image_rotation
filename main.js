const image_validation = (image_data) => { 
  if (!image_data) {
    throw new Error("The value image_data is required for this function, and it wasn't provided");
    return;
  }

  if (
    typeof image_data !== 'object' && (
      image_data.data === undefined || 
      image_data.height === undefined || 
      image_data.width === undefined
    )) {
    throw new Error("image is invalid");
    return;
  }
}
const number_validation = ({ 
  number_value, 
  message_number_undefined = 'value not provided', 
  message_number_is_not_a_number = 'value is not a number' 
}) => {
  if (!number_value) {
    throw new Error(message_number_undefined);
    return;
  }

  if (typeof number_value !== 'number') {
    throw new Error(message_number_is_not_a_number);
    return;
  }
}

const resize_image = (image_data, cosine, sine) => {
  image_validation(image_data);
  number_validation({
    number_value: cosine,
    message_number_is_not_a_number: 'Cosine value is not a number',
    message_number_undefined: 'Cosine is a required value'
  });
  number_validation({
    number_value: sine,
    message_number_is_not_a_number: 'Sine value is not a number',
    message_number_undefined: 'Sine is a required value'
  });

  let width = (Math.ceil(
    Math.abs(cosine * image_data.width) + 
    Math.abs(sine * image_data.height)
  )) + 1;

  let height = (Math.ceil(
    Math.abs(sine * image_data.width) + 
    Math.abs(cosine * image_data.height)
  )) + 1;

  if (width % 2 !== 0) {
    width++;
  }

  if (height % 2 !== 0) {
    height++;
  }

  return {
    height,
    width
  }
}

const create_translation_function = (deltaX, deltaY) => {
  return function(x, y) {
    return {
      x: x + deltaX,
      y: y + deltaY
    };
  };
}

const rotate = (image_data, angle_in_radian) => {
  image_validation(image_data);
  number_validation({ 
    number_value: angle_in_radian, 
    message_number_is_not_a_number: 'The value angle_in_radian must be a number',
    message_number_undefined: "The value angle_in_radian is required for this function, and it wasn't provided"
  });

  if (angle_in_radian < 0) {
    throw new Error('This function only rotate the image in clockwise direction');
    return;
  }

  const radian = angle_in_radian % (2 * Math.PI);
  const cosine = Math.cos(radian);
  const sine = Math.sin(radian);
  const base_index_rgba = 4;

  const { width: new_image_width, height: new_image_height } = resize_image(image_data, cosine, sine);
  
  const new_image_data_as_array = new Array(new_image_width * new_image_height * base_index_rgba).fill(0);
  const old_image_data_as_array = Array.prototype.slice.call(image_data.data);

  const translate_to_cartesian = create_translation_function(-(new_image_width / 2), -(new_image_height / 2));
  const translate_to_screen = create_translation_function(
    new_image_width / 2 + 0.5,
    new_image_height / 2 + 0.5
  );

  for (let y = 1; y <= new_image_height; y++) {
    for (let x = 1; x <= new_image_width; x++) {
      const cartesian = translate_to_cartesian(x, y);
      const source = translate_to_screen(
        cosine * cartesian.x + sine * cartesian.y,
        cosine * cartesian.y - sine * cartesian.x
      );

      if (source.x >= 0 && source.x < new_image_width && source.y >= 0 && source.y < new_image_height) {
        const current_index = (new_image_width * (y - 1) + x - 1) << 2;
        const source_index = ((new_image_width * (source.y | 0) + source.x) | 0) << 2;

        let pixel_rgba = old_image_data_as_array.splice(source_index, base_index_rgba);

        if (pixel_rgba.length === 0) {
          pixel_rgba = [0, 0, 0, 0]
        }

        old_image_data_as_array.splice(source_index, 0,...pixel_rgba);
        new_image_data_as_array.splice(current_index, base_index_rgba,...pixel_rgba);
      }
    }
  }

  return {
    height: new_image_height,
    width: new_image_width,
    data: new Uint8ClampedArray(new_image_data_as_array)
  }
}