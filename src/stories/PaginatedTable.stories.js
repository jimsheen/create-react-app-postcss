import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import PaginatedTable from '../PaginatedTable';

const tableData = {
  thLabels: [{
    label: 'First Name',
    value: 'first_name',
  }, {
    label: 'Last Name',
    value: 'last_name',
  }, {
    label: 'Avatar',
    value: 'avatar',
  }]
};

const props = {
  filterObj: {
    total: 0,
    retrieveCount: 10,
    startIndex: 0,
    currentPage: 1,
    totalPages: 10,
    sortBy: 'first_name',
    sortOrder: 'ASC',
  },
  primaryKey: 'id',
  tableData,
  items: [{
      "id": 4,
      "email": "eve.holt@reqres.in",
      "first_name": "Dave",
      "last_name": "Holt",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
    },
    {
      "id": 5,
      "email": "charles.morris@reqres.in",
      "first_name": "Charles",
      "last_name": "Morris",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
    },
    {
      "id": 6,
      "email": "tracey.ramos@reqres.in",
      "first_name": "Tracey",
      "last_name": "Ramos",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"
    }
  ],
  updateItems: action('updateItems'),
  searchTerms: {},
  isCheckable: false,
};

storiesOf('PaginatedTable', module)
  .add('with props', () => <PaginatedTable { ...props } />)
// .add('with props', () => <SortableTable { ...props } />)
// .add('isCheckable', () => <SortableTable { ...isCheckable } />)
// .add('with search', () => <SortableTable { ...withSearch } />)
// .add('with search and checkable', () => <SortableTable { ...checkedAndSearchable } />)
