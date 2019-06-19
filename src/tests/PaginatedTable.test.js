import React from 'react';
import { shallow } from 'enzyme';
import RenderHelper from './util/renderHelper';

import PaginatedTable from '../PaginatedTable';

const markup = (props) => {
  return shallow(
    <PaginatedTable { ...props } />
  )
}

let filterObj = {
  total: 0,
  retrieveCount: 10,
  startIndex: 0,
  currentPage: 1,
  totalPages: 0,
  sortBy: '',
  sortOrder: 'ASC',
  searchTerms: {},
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

const initialProps = {
  items,
  updateItems: jest.fn(() => null),
  primaryKey: 'id',
}

let wrapper, defaultRender, render;

beforeEach(() => {
  wrapper = new RenderHelper(initialProps, markup);
  defaultRender = wrapper.render();
})

it("Should render PaginatedTable component", () => {
  expect(defaultRender.length).toBe(1);
})


describe('Methods', () => {

  let instance;

  beforeEach(() => {
    instance = defaultRender.instance();
  })

  describe('selectAll', () => {
    it('should select all items in the whole visible table and set selectAllState to true', () => {
      instance.selectAll();
      expect(defaultRender.state('selectedItems').length).toBe(3);
      expect(defaultRender.state('selectAllState')).toBe(true);
    });

    it('should deselect items in state and set selectAll to false', () => {
      defaultRender.setState({ selectAllState: true })
      instance.selectAll();
      expect(defaultRender.state('selectedItems').length).toBe(0);
      expect(defaultRender.state('selectAllState')).toBe(false);
    })
  })


  describe('sortItemsEvt - sort items according to sort order and create new filterObj', () => {
    it('should create new filter with descending order', () => {
      const e = {
        target: {
          value: 'first_name'
        }
      }
      const expectedObj = {
        ...filterObj,
        sortBy: 'first_name',
        sortOrder: 'DESC'
      }
      expect(instance.sortItemsEvt(e)).toEqual(expectedObj);
      expect(wrapper.getProps().updateItems).toHaveBeenCalledWith(expectedObj)
    });

    it('should create new filter with ascending order', () => {
      const e = {
        target: {
          value: 'first_name'
        }
      }
      const expectedObj = {
        ...filterObj,
        sortBy: 'first_name',
        sortOrder: 'ASC'
      }
      const render = wrapper.render({
        filterObj: {
          ...filterObj,
          sortOrder: 'DESC',
        }
      })
      instance = render.instance();
      expect(instance.sortItemsEvt(e)).toEqual(expectedObj);
      expect(wrapper.getProps().updateItems).toHaveBeenCalledWith(expectedObj)
    })
  })

  describe('searchChange - search input change update state', () => {
    it('should update searchTerms with value', () => {
      const e = {
        target: {
          value: 'First Name',
        }
      }
      expect(instance.searchChange(e, 'first_name')).toEqual({
        first_name: 'First Name'
      })
    })

    it('should add to existing search terms', () => {
      const e = {
        target: {
          value: 'Last Name'
        }
      }

      defaultRender.setState({
        searchTerms: {
          first_name: 'First Name',
        }
      });

      expect(instance.searchChange(e, 'last_name')).toEqual({
        first_name: 'First Name',
        last_name: 'Last Name',
      })
    })

    it('should update existing search terms', () => {
      const e = {
        target: {
          value: 'First Name Change'
        }
      }

      defaultRender.setState({
        searchTerms: {
          first_name: 'First Name',
        }
      });

      expect(instance.searchChange(e, 'first_name')).toEqual({
        first_name: 'First Name Change',
      })
    })
  })

  describe('searchSubmit - handle search submission', () => {
    let e = {
      key: 'Enter'
    }

    const searchTerms = {
      first_name: 'First Name',
    };

    it('should submit new filterObj to updateItems', () => {

      defaultRender.setState({
        searchTerms,
      })

      expect(instance.searchSubmit(e).searchTerms).toEqual(searchTerms);
      expect(wrapper.getProps().updateItems).toHaveBeenCalledWith({
        ...filterObj,
        searchTerms,
      })
    })

    it('should submit new filterObj when manualSubmit = true', () => {
      defaultRender.setState({
        searchTerms,
      })

      expect(instance.searchSubmit({}, true).searchTerms).toEqual(searchTerms)

      expect(wrapper.getProps().updateItems).toHaveBeenCalledWith({
        ...filterObj,
        searchTerms,
      })
    })

    it('should return null when event is empty', () => {
      expect(instance.searchSubmit({})).toBe(null)
    })
  })


  describe('clearSearch - handle clearing of search terms', () => {

    const searchTerms = {
      first_name: 'First Name',
      second_name: 'Second Name',
    };

    it('should delete search terms', () => {
      jest.spyOn(instance, 'searchSubmit');
      defaultRender.setState({
        searchTerms
      })

      expect(instance.clearSearch('first_name')).toEqual({
        second_name: 'Second Name',
      })
      expect(instance.searchSubmit).toHaveBeenCalledWith(null, true)
      expect(defaultRender.state().searchTerms).toEqual({
        second_name: 'Second Name',
      })
    })
  })


  describe('updateRetrieveCount - update filterObj with new filterObj', () => {
    const e = {
      target: {
        value: 50,
      }
    }

    it('should return updated filterObj with new retrieveCount', () => {
      const expectedObj = {
        ...filterObj,
        retrieveCount: 50,
        currentPage: 0,
      }

      expect(instance.updateRetrieveCount(e)).toEqual(expectedObj)
      expect(wrapper.getProps().updateItems).toHaveBeenCalledWith(expectedObj)
    });

    it('should calculate new filterObj - retrieveCount & totalPages', () => {
      render = wrapper.render({
        ...initialProps,
        filterObj: {
          ...filterObj,
          total: 100,
          currentPage: 0,
          retrieveCount: 20,
        }
      })

      const expectedObj = {
        ...filterObj,
        total: 100,
        currentPage: 0,
        totalPages: 2,
        retrieveCount: 50,
      }

      instance = render.instance();
      expect(instance.updateRetrieveCount(e)).toEqual(expectedObj);

    })
  })

  describe('renderOption - renders options for page size', () => {

    it('should return option with default value', () => {
      const renderOption = shallow(defaultRender.instance().renderOption(1, 1, 1));
      expect(renderOption.find('option').props()).toEqual({
        children: 1,
        defaultValue: 1,
        value: 1,
      })
    })

    it('should return option with NO default value', () => {
      const renderOption = shallow(defaultRender.instance().renderOption(2, 1, 1));
      expect(renderOption.find('option').props()).toEqual({
        children: 2,
        value: 2,
      })
    })
  })

  describe('pageChange - handle page change event', () => {

    it('should return updated filterObj and call updateItems', () => {
    	let e = { target: { value: 2 } }
      const expectedObj = {
        ...filterObj,
        currentPage: 2,
        startIndex: 10,
      };
      expect(instance.pageChange(e)).toEqual(expectedObj)
      expect(wrapper.getProps().updateItems).toHaveBeenCalledWith(expectedObj)
    })
  })


  describe('sortItems - sort items in array and apply isChecked or isEditing if in state', () => {

  	it(`it should apply checked to item id ${items[0].id}`, () => {
  		defaultRender.setState({
  			selectedItems: [items[0].id],
  		})
  		instance = defaultRender.instance();
  		expect(instance.sortItems()[0].isChecked).toEqual(true)
  	})
  })
});
