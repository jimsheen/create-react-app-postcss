import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Pagination from './Pagination';
import SortableTable from './SortableTable';
import withPagination from './withPagination';

const selectClass = 'block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline ml-2';


const propTypes = {
  filterObj: PropTypes.object.isRequired,
  selectedItems: PropTypes.array,
  updateItems: PropTypes.func,
  items: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
  tableData: PropTypes.shape({
    thLabels: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      searchable: PropTypes.boolean,
      editable: PropTypes.boolean,
      link: PropTypes.shape({
        root: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
      linkFunc: PropTypes.func,
    }))
  }).isRequired,
};


export class PaginatedTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerms: {},
      selectedItems: [],
      editingItems: [],
      editedItems: [],
      selectAllState: false,
      editAllState: false,
    }
  }

  static defaultProps = {
    pageSize: [10, 20, 50, 100],
    filterObj: {
      total: 0,
      retrieveCount: 10,
      startIndex: 0,
      currentPage: 1,
      totalPages: 0,
      sortBy: '',
      sortOrder: 'ASC',
      searchTerms: {},
    }
  }

  /**
   * Select all items in the whole table
   */
  selectAll = (e) => {
    const { items, primaryKey = 'id' } = this.props;
    this.setState(({ selectAllState }) => ({
      selectedItems: selectAllState ? [] : items.map(item => item[primaryKey]),
      selectAllState: !selectAllState,
    }))
  }

  /**
   * sortItemsEvt - clicking on table header to sort items event
   * @param {object} event - submit event
   */
  sortItemsEvt = (event) => {
    const { value } = event.target
    const newSortBy = value
    const { sortOrder } = this.props.filterObj
    let newOrder = 'ASC'
    if (sortOrder !== 'ASC' || sortOrder !== 'DESC') {
      newOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC'
    }

    const newFilter = {
      ...this.props.filterObj,
      sortOrder: newOrder,
      sortBy: newSortBy,
    }

    this.props.updateItems(newFilter)

    return newFilter
  }


  /**
   * searchChange - search input change update state
   * @param {object} event - event object
   * @param {string} key - search input name
   */
  searchChange = (event, key) => {
    const { value } = event.target
    // NOTE / TODO - snakeToCamel might be necessary
    // const newKey = snakeToCamel(key)
    const newKey = key
    const { searchTerms } = this.state
    let newTerms = {}
    if (searchTerms[newKey] !== 'undefined') {
      searchTerms[newKey] = value
    } else {
      newTerms[newKey] = value
    }
    const mergedTerms = { ...searchTerms, ...newTerms }
    this.setState({ searchTerms: mergedTerms })

    return mergedTerms;
  }

  /**
   * searchSubmit - handle search submission
   * @param {object} e - event object
   * @param {boolean} manualSubmit - trigger submission manually
   */
  searchSubmit = (e, manualSubmit) => {
    const eventKey = e ? e.key : null
    if (eventKey === 'Enter' || manualSubmit) {
      const { searchTerms } = this.state
      const { filterObj } = this.props
      filterObj.startIndex = 0
      filterObj.currentPage = 1
      const newObj = {
        ...filterObj,
        searchTerms: searchTerms,
      }
      this.props.updateItems(newObj)
      return newObj
    }
    return null;
  }


  /**
   * clearSearch - clear the input field
   * @param {string} item - name of the input field
   */
  clearSearch = (item) => {
    let { searchTerms } = this.state
    if (item.indexOf(searchTerms).length !== -1) {
      delete searchTerms[item];
    }
    const manualSearchSubmit = Object.keys(searchTerms).every(item => item)

    if (manualSearchSubmit) {
      this.searchSubmit(null, true)
    }
    this.setState({ searchTerms })
    return searchTerms
  }

  /**
   * updateRetrieveCount - update amount of items to show per page
   */
  updateRetrieveCount = (event) => {
    const { value } = event.target
    const {
      filterObj,
      filterObj: {
        currentPage,
        totalPages,
        total
      },
    } = this.props;

    const newFilter = {
      ...filterObj,
      retrieveCount: Number(value),
      totalPages: Math.ceil(total / Number(value)),
    }
    if (currentPage > totalPages) newFilter['currentPage'] = totalPages
    this.props.updateItems(newFilter)
    return newFilter
  }


  /**
   * renderOption
   * @return ReactMarkup
   */

  renderOption = (size = 1, initial = 1, index) => {
    if (size === initial) {
      return <option 
                key={index}
                defaultValue={initial} 
                value={initial}>{initial}
            </option>
    } else {
      return <option key={index} value={size}>{size}</option>
    }
  }


  /**
   * pageChange - action to hangle page change event
   * @param {object} event - submission event
   */
  pageChange = (e) => {
    const { value } = e.target;
    const { filterObj, updateItems } = this.props
    const { retrieveCount } = filterObj
    const startIndex = Number(value) === 1 ? 0 : (Number(value) - 1) * retrieveCount
    const newFilter = {
      ...filterObj,
      currentPage: Number(value),
      startIndex: startIndex,
    }
    updateItems(newFilter)
    return newFilter
  }


  sortItems = () => {
    const { primaryKey, items } = this.props;
    const { selectedItems, editingItems } = this.state;
    return items.map(item => {
      item.isChecked = selectedItems.indexOf(item[primaryKey]) !== -1
      item.isEditing = editingItems.indexOf(item[primaryKey]) !== -1
      return item
    })
  }


  updateSelected = (event, val, items) => {
    let { selectedItems, prevValue, selectAllState } = this.state

    const currentIndex = selectedItems.indexOf(val)
    if (event.shiftKey) {
      // get keys of currentItems
      const currentItems = items.map(item => item.primary_key)
      // get last item added to array
      const prevIndex = currentItems.findIndex(x => x === prevValue)
      // get position of selected val in items array
      const currentIndex = currentItems.findIndex(x => x === val)

      let rangeItems = []
      if (prevIndex > currentIndex) {
        rangeItems = currentItems.slice(currentIndex, prevIndex)
      } else {
        rangeItems = currentItems.slice(prevIndex, currentIndex + 1)
      }

      const addItems = rangeItems.filter(item => {
        if (selectedItems.indexOf(item) === -1) {
          return item
        }
        return null
      })

      const removeItems = rangeItems.filter((item, i) => {
        if (i !== 0 && selectedItems.indexOf(item) !== -1) {
          return item
        }
        return null
      })

      let newSelectedItems = selectedItems.filter(item => {
        if (removeItems.indexOf(item) === -1) {
          return item
        }
        return null
      })

      selectedItems = [...newSelectedItems, ...addItems]

    } else {
      if (currentIndex === -1) {
        selectedItems.push(val)
      } else {
        selectedItems.splice(currentIndex, 1)
      }
    }

    const newState = {
      selectedItems,
      prevValue: val,
      selectAllState: selectedItems.length >= items.length
    }
    this.setState(newState)

    return newState
  }

  /**
   * handle updating selected items
   * @param {object} event - click event
   * @param {string} val - unique val of selected item
   */
  updateEditingItems = (e) => {

    const { value } = e.target;
    const { editingItems } = this.state;

    let newItems = [...editingItems];

    if (Array.isArray(value)) {
      newItems = value
    } else {
      const currentIndex = editingItems.indexOf(Number(value))
      if (currentIndex === -1) {
        newItems.push(Number(value))
      } else {
        newItems.splice(currentIndex, 1)
      }
    }

    this.setState({ editingItems: newItems })

    return newItems
  }

  saveEditedItem = (e) => {
    const { value } = e.target;
    let { editingItems = [] } = this.state
    this.updateEditingItems({ target: { value: value } });
  }


  toggleEditAll = (bool) => {
    const {
      primaryKey,
      items,
    } = this.props;
    const editAllState = typeof bool === 'boolean' ? bool : !this.state.editAllState;
    this.setState({ editAllState });
    this.setState({
      editingItems: editAllState ? items.map(item => item[primaryKey]) : []
    })
  }

  saveAllItems = () => {

    const { editedItems } = this.state;

    this.setState(({ editAllState }) => ({
      editingItems: [],
      editAllState: false,
    }));

    // TODO - call props save function 
  }

  /**
   * Handle state update of item input in a row
   * @param {object} event - on change event
   * @param {object} item - current item to be updated
   * @param {string} label - label of the column to be updated
   */
  updateEditedItems = (e, item, label) => {
    const { value } = e.target
    const { editedItems, editingItems } = this.state
    const { items, primaryKey } = this.props
    const newItem = item
    newItem[label] = value
    const newItems = editedItems.length === 0 ? [newItem] : items.reduce((newEditArr, editItem) => {
      let newObj = editItem
      if (editItem[primaryKey] === item[primaryKey]) {
        newObj[label] = value
      }
      newEditArr.push(newObj)
      return newEditArr
    }, []).filter(editItem => editingItems.indexOf(editItem[primaryKey]) !== -1)
    this.setState({
      ...this.state,
      editedItems: newItems
    })
    return newItems;
  }

  render() {

    const {
      pageSize,
      filterObj,
      items = [],
      editingItems = [],
      tableData,
    } = this.props;

    const {
      selectedItems,
      selectAllState,
      editAllState,
    } = this.state;

    const tableProps = {
      ...this.props,
      selectedItems,
      selectAllState,
      editAllState,
      sortedItems: this.sortItems(),
      searchChange: this.searchChange,
      sortItemsEvt: this.sortItemsEvt,
      searchSubmit: this.searchSubmit,
      searchTerms: this.state.searchTerms,
      clearSearch: this.clearSearch,
      selectAll: this.selectAll,
      updateSelected: this.updateSelected,
      updateEditingItems: this.updateEditingItems,
      saveEditedItem: this.saveEditedItem,
      updateEditedItems: this.updateEditedItems,
      saveAllItems: this.saveAllItems,
      toggleEditAll: this.toggleEditAll,
    }

    return (
      <React.Fragment>
      	<SortableTable { ...tableProps } />
        <Pagination 
          filterObj={filterObj} 
          onClick={this.pageChange}
        />
        <div className="mb-4 text-center">
          <span>Page size</span>
          <div className="inline-block relative">
					  <select
					  	onChange={this.updateRetrieveCount} 
					  	value={filterObj.retrieveCount}
					  	className={selectClass}>
					     {pageSize.map((size, i) => this.renderOption(size, filterObj.retrieveCount, i))}
					  </select>
					  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
					    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
					  </div>
					</div>
        </div>
      </React.Fragment>
    )
  }
}

PaginatedTable.propTypes = propTypes;

export default PaginatedTable;
// export default withPagination(PaginatedTable);
