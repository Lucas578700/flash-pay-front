const setNestedValue = (object, path, value) => {
  const keys = path.split(".");
  let currentObject = object;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!currentObject[key]) {
      currentObject[key] = {};
    }
    currentObject = currentObject[key];
  }

  const lastKey = keys[keys.length - 1];
  currentObject[lastKey] = value;

  return object;
};

export default setNestedValue;
