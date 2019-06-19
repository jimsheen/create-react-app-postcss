import React from 'react';
import { shallow } from 'enzyme';
import RenderHelper from './util/renderHelper';

import { SortableTable } from '../SortableTable';

const markup = (props) => {
  return shallow(
    <SortableTable { ...props } />
  )
}

let filterObj = {
  currentPage: 1,
  totalPages: 1,
}

const items = [{
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
];

const tableData = {
  thLabels: [{
    label: 'First Name',
    value: 'first_name'
  }, {
    label: 'Last Name',
    value: 'last_name'
  }, {
    label: 'Avatar',
    value: 'avatar',
  }]
};

const initialProps = {
  tableData,
  sortedItems: items,
  searchTerms: {},
  isCheckable: false,
}

const selectAllBtn = '[data-test="select-all-btn"]';
const selectRowBtn = '[data-test="select-row-btn"]';
const searchField = '[data-test="search-field"]';
const multiActions = '[data-test="multi-actions"]';
const selectedItemsLength = '[data-test="selected-items-length"]';

let wrapper, defaultRender, render;

beforeEach(() => {
  wrapper = new RenderHelper(initialProps, markup);
  defaultRender = wrapper.render();
})

it("Should render sortable table", () => {
  expect(defaultRender.length).toBe(1);
})

it("Should not render anything when tableData is not defined", () => {
  render = wrapper.render({ ...initialProps, tableData: 'undefined' });
  expect(render).toEqual({});
});


describe('Sortable Table Rendering', () => {

  describe('Table rendering', () => {
    it('should render rows = items.length + 1 (including headers)', () => {
      expect(defaultRender.find('tr').length).toBe(items.length + 1)
    })

    it('should render cols = thLabels.length', () => {
      expect(defaultRender.find('tr').first().find('td').length).toBe(tableData.thLabels.length);
    })
  });


  describe('Search rendering', () => {
    it('should NOT display search fields by default', () => {
      expect(defaultRender.find(searchField).length).toBe(0)
    });

    it('should display search fields', () => {
      const props = {
        ...initialProps,
        tableData: {
          thLabels: tableData.thLabels.map(label => {
            label.searchable = true;
            return label;
          })
        }
      }
      render = wrapper.render(props);
      expect(render.find(searchField).length).toBe(items.length);
    })
  })


  describe('isCheckable', () => {
    it('should NOT render checkboxes OR # selected', () => {
      expect(defaultRender.find(selectAllBtn).length).toBe(0);
      expect(defaultRender.find(selectRowBtn).length).toBe(0);
      expect(render.find(selectedItemsLength).length).toBe(0);
    });

    it('should render checkboxes and # selected', () => {
      render = wrapper.render({ ...initialProps, isCheckable: true });
      expect(render.find(selectAllBtn).length).toBe(1);
      expect(render.find(selectRowBtn).length).toBe(items.length);
      expect(render.find(selectedItemsLength).length).toBe(1);
    })
  })

  describe('multiActions', () => {
  	it('should NOT render DropdownButton', () => {
  		expect(defaultRender.find(multiActions).length).toBe(0);
  	})

  	it('should render DropdownButton when multiActions are defined & isCheckable is true', () => {
  		render = wrapper.render({
  			...initialProps,
  			isCheckable: true,
  			multiActions: [{
  				label: 'Test',
  				action: () => null,
  			}]
  		})
  		expect(render.find(multiActions).length).toBe(1);
  	})
  })
})
