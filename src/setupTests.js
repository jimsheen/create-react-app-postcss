import React from 'react';
import { shallow, configure } from 'enzyme';
const EnzymeAdapter = require('enzyme-adapter-react-16');
configure({ adapter: new EnzymeAdapter() });