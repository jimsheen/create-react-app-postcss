import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'underscore';

// import PaginatedTable from './PaginatedTable';
import CrossIcon from './cross';
import DropdownButton from './DropdownButton';


/**
 * @type {Object} propTypes - prop type check
 * @param {array} actions - Single action per row button display
 * @param {array} multiActions - Actions to apply to multiple selected rows
 * @param {function} selectAll - parent selectRowAction to select all rows
 * @param {boolean} selectAllState - The state of the selectAllCheckbox
 * @param {number} selectedItemsLength - length of selected items
 * @param {object} tableData - Data to populate table
 * @param {function} updateSelected - Function to update selected row checkbox on click
 * @param {boolean} fullTable - Table fills screen if true (used with LayoutNoScroll component)
 * @todo display number of selected items if multiselect true AND/OR is checkable
 * @todo click and drag multiple select boxes
 */
const propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    func: PropTypes.func.isRequired,
  }).isRequired),
  multiActions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    func: PropTypes.func.isRequired,
  }).isRequired),
  selectAll: PropTypes.func,
  selectAllState: PropTypes.bool,
  selectedItemsLength: PropTypes.number,
  tableData: PropTypes.shape({
    thLabels: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      searchable: PropTypes.boolean,
      link: PropTypes.shape({
        root: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
      linkFunc: PropTypes.func,
    }))
  }).isRequired,
  sortedItems: PropTypes.array, // from parent component
  searchTerms: PropTypes.object, // from parent component state
  updateSelected: PropTypes.func,
  clearSearch: PropTypes.func,
  fullTable: PropTypes.bool,
  noItemsError: PropTypes.string,
  initialMessage: PropTypes.string,
}

const tdClass = 'py-4 px-6 border-b border-grey-light';
const trClass = 'hover:bg-gray-200';
const sortBtnClass = 'py-4 px-6 w-full h-full block text-left';

const searchClass = 'w-full py-2 focus:outline-none focus:shadow-outline px-6';

export class SortableTable extends Component {

  // constructor(props) {
  //   super(props);
  // }

  static defaultProps = {
    isCheckable: false,
    tableData: {
      thLabels: []
    },
    selectedItemsLength: 0,
  }

  colFilter = (value) => {
    // typeof item[col.value] === 'boolean' ? item[col.value].toString() : item[col.value]
    if (typeof value === 'boolean') {
      return value.toString()
    }
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    return value
  }


  render() {

    const {
      sortItemsEvt,
      sortedItems = [],
      tableData,
      searchChange,
      searchSubmit,
      searchTerms,
      clearSearch,
      selectAll,
      selectAllState,
      selectEverything,
      updateSelected,
      isCheckable,
      multiActions,
      primaryKey,
      selectedItems
    } = this.props;

    // console.log(this.props);

    if (typeof tableData === 'undefined' && typeof sortedItems === 'undefined') return null;

    const rowStripe = index => {
      return index % 2 === 0 ? ' bg-gray-100' : '';
    }

    const selectedItemsLength = typeof selectedItems !== 'undefined' ? selectedItems.length : 0;
    

    // if some of the thLabels are searchable return true (used for selectAllCol)
    const hasSearch = typeof tableData.thLabels !== 'undefined' ? tableData.thLabels.some(item => item.searchable) : false;
    
    const selectAllCol = (
      <td width="50">
				<div className="text-center">
          <input
            type="checkbox"
            onChange={selectAll}
            checked={sortedItems.length === selectedItemsLength ? true : selectAllState}
            data-test="select-all-btn"
           />
        </div>
      </td>
    );

    return (
      <div className="mx-auto">
		  	<div className="bg-white shadow-md rounded my-6">
			  	<div>
			  	{isCheckable &&
	            <div className="flex pb-3 justify-end">
	              {typeof multiActions !== 'undefined' && multiActions.length > 0 &&
	              	<div className="w-1/2 text-left" data-test="multi-actions">
		                <DropdownButton 
		                  actions={multiActions}
		                  callbackProps={{ ...this.props, ...this.state }}
		                  disabled={selectedItemsLength === 0}
		                />
	              	</div>
	              }
	              <div className="flex flex-wrap w-1/2 justify-end items-center">
	              	<span data-test="selected-items-length">{selectedItemsLength} selected</span>
	              </div>
	            </div>
	          }
			  	</div>
		      <table className="text-left w-full border-collapse table-auto">
						<thead>
							<tr>
								{/* selectAllCol rendering */}
				    		{isCheckable && !hasSearch && selectAllCol}
								{isCheckable && hasSearch && <td width="50">&nbsp;</td>}
								
								{!isEmpty(tableData.thLabels) && tableData.thLabels.map((label, i) => (
						        <td key={i}>
						          <button 
						            type="button" 
						            value={label.value}
						            className={sortBtnClass}
						            onClick={sortItemsEvt}>
						            {label.label}
						          </button>
						        </td>
						    ))}
				    	</tr>
				    	{hasSearch &&
					    	<tr>
						    	{/* Select all items */}
						    	{isCheckable && selectAllCol}
				          {!isEmpty(tableData.thLabels) && tableData.thLabels.map((label) => (
				            <td key={label.value} >
			          		{label.searchable &&
			                  <div className="relative">
				                  <input 
				                    type="text" 
				                    className="input"
				                    onChange={(e) => searchChange(e, label.value)}
				                    onKeyPress={(e) => { searchSubmit(e) }}
				                    className={searchClass}
				                    placeholder="Search..."
				                    value={typeof searchTerms[label.value] !== 'undefined' ? searchTerms[label.value] : ''}
				                    data-test="search-field"
				                  />
				                  <button
				                  		className="inline-block absolute top-0 right-0 py-3 px-4"
				                      onClick={() => clearSearch(label.value)}
				                    >
				                    <span className="h-4 w-4 inline-block flex">
				                   		<CrossIcon />
				                   	</span>
			                    </button>
			                  </div>
			              	}
			              </td>
			          ))}
			          </tr>
				    	}
				    </thead>
				    <tbody>
		          {sortedItems.map((item, index) => (
		            <tr 
		              key={index}
		              className={trClass + rowStripe(index)}
		             >
					    		{isCheckable &&
			             <td 
	                    className="text-center"
	                    width="50">
	                    <div className="custom-checkbox">
	                      <input
	                        type="checkbox"
	                        readOnly
	                        id={item[primaryKey]}
	                        checked={item.isChecked}
	                        data-test="select-row-btn"
	                        onChange={(e) => updateSelected(e, item[primaryKey], sortedItems)}
	                      />
	                      <label htmlFor={item[primaryKey]}  onClick={(e) => updateSelected(e, item[primaryKey], sortedItems)}>&nbsp;</label>
	                    </div>
	                  </td>
	                }
		              {!isEmpty(tableData.thLabels) && tableData.thLabels.map((col, i) => (
		                <td 
		                	key={i}
		                	className={tdClass}
		                >
		                		{item[col.value]}
		                </td>
		              ))}
		            </tr>
		          ))
		        }
		        </tbody>
			    </table>
			  </div>
			</div>
    )
  }
}


export default SortableTable;
