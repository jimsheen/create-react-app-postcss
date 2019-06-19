import { isEmpty } from 'underscore';

const noUndefinedObj = (obj) => {
  return Object.keys(obj).reduce((out, key) => {
    if (typeof obj[key] !== 'undefined' || obj[key] !== null || isEmpty(obj[key])) {
      out = {
        ...out,
        [key]: obj[key],
      }
    } else {
    	return null
    }
    return out
  }, {})
}

export default noUndefinedObj