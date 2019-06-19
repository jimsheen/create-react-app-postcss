import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DropdownButton from '../DropdownButton';

const props = {
  actions: [{
    label: 'Action',
    action: action('action')
  }]
};

storiesOf('DropdownButton', module)
  .add('with props', () => <DropdownButton { ...props } />)
// .add('with props', () => <SortableTable { ...props } />)
// .add('isCheckable', () => <SortableTable { ...isCheckable } />)
// .add('with search', () => <SortableTable { ...withSearch } />)
// .add('with search and checkable', () => <SortableTable { ...checkedAndSearchable } />)
