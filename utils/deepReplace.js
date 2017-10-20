function checkObject(obj) {
  return Object.prototype.hasOwnProperty.call(obj, 'value') && Object.prototype.hasOwnProperty.call(obj, 'label');
}

export default function deepReplace(obj) {
  let out;
  if (Array.isArray(obj)) {
    out = [];
  } else {
    out = {};
  }

  Object.keys(obj).forEach((key) => {
    let val;

    if (obj[key] !== null && typeof obj[key] === 'object' && !checkObject(obj[key])) {
      val = deepReplace(obj[key]);
    } else if (typeof obj[key] === 'object' && checkObject(obj[key])) {
      val = obj[key].value;
    } else {
      val = obj[key];
    }

    out[key] = val;
  });

  return out;
}

