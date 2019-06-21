import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { SortableTable } from '../SortableTable';

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
  tableData,
  sortedItems: [{
      "id": 4,
      "email": "eve.holt@reqres.in",
      "first_name": "Eve",
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
  clearSearch: action('clearSearch'),
  searchSubmit: action('searchSubmit'),
  searchChange: action('searchChange'),
  updateEditingItems: action('updateEditingItems'),
  saveAllItems: action('saveAllItems'),
  toggleEditAll: action('toggleEditAll'),
  saveEditedItem: action('saveEditedItem'),
  searchTerms: {},
  isCheckable: false,
  primaryKey: 'id',
};

const isCheckable = {
  ...props,
  isCheckable: true,
}

const withSearch = {
  ...props,
  tableData: {
    thLabels: [{
      label: 'First Name',
      value: 'first_name',
      searchable: true,
    }, {
      label: 'Last Name',
      value: 'last_name',
      searchable: true,
    }, {
      label: 'Avatar',
      value: 'avatar',
      searchable: true,
    }],
  }
}

const checkedAndSearchable = {
  ...withSearch,
  isCheckable: true,
}

const withMultiActions = {
  ...isCheckable,
  selectedItems: [1, 2, 3, 4, 5, 6, 7, 8],
  multiActions: [{
    label: 'Action',
    action: action('Multi Action')
  }]
}

const isEditable = {
  ...props,
  tableData: {
    thLabels: [{
      label: 'First Name',
      value: 'first_name',
    }, {
      label: 'Last Name',
      value: 'last_name',
      editable: true,
    }, {
      label: 'Avatar',
      value: 'avatar',
    }],
  },
}

const editingItems = {
  ...isEditable,
  tableData: {
    thLabels: [{
      label: 'First Name',
      value: 'first_name',
    }, {
      label: 'Last Name',
      value: 'last_name',
      editable: true,
    }, {
      label: 'Avatar',
      value: 'avatar',
    }],
  },
  sortedItems: [{
      "id": 4,
      "email": "eve.holt@reqres.in",
      "first_name": "Eve",
      "last_name": "Holt",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg",
      isEditing: true,
    },
    {
      "id": 5,
      "email": "charles.morris@reqres.in",
      "first_name": "Charles",
      "last_name": "Morris",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg",
      isEditing: true,
    },
    {
      "id": 6,
      "email": "tracey.ramos@reqres.in",
      "first_name": "Tracey",
      "last_name": "Ramos",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg",
      isEditing: true,
    }
  ],
}

storiesOf('SortableTable', module)
  .add('without props', () => <SortableTable />)
  .add('with props', () => <SortableTable { ...props } />)
  .add('isCheckable', () => <SortableTable { ...isCheckable } />)
  .add('with search', () => <SortableTable { ...withSearch } />)
  .add('with search and checkable', () => <SortableTable { ...checkedAndSearchable } />)
  .add('with multi actions', () => <SortableTable { ...withMultiActions } />)
  .add('with row actions isEditable', () => <SortableTable { ...isEditable } />)
  .add('with row actions + isEditing', () => <SortableTable { ...editingItems } />)
  .add('with editAllState true', () => <SortableTable { ...editingItems } editAllState={true} />)
