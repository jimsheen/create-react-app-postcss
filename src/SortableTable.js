import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'underscore';

// import PaginatedTable from './PaginatedTable';
import CrossIcon from './cross';
import DropdownButton from './DropdownButton';
import Button from './Button';


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
  editAllState: PropTypes.bool,
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
  isEditable: PropTypes.bool,
  saveAllItems: PropTypes.func,
}

const tdBaseClass = 'border-b border-grey-light';
const tdPadding = 'py-4 px-6';
const tdClass = `${tdBaseClass} ${tdPadding}`
const tdClassEditing = tdBaseClass;
const editInputClass = `${tdPadding} w-full`;
const trClass = 'hover:bg-gray-200';
const sortBtnClass = 'py-4 px-6 w-full h-full block text-left';

const searchClass = 'w-full py-2 focus:outline-none focus:shadow-outline px-6';

export class SortableTable extends Component {

  // constructor(props) {
  //   super(props);
  // }

  static defaultProps = {
    isCheckable: false,
    isEditable: false,
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
      editAllState,
      selectEverything,
      updateSelected,
      isCheckable,
      multiActions,
      primaryKey,
      selectedItems,
      updateEditingItems,
      updateEditedItems,
      saveAllItems,
      saveEditedItem,
      toggleEditAll,
    } = this.props;

    if (typeof tableData === 'undefined' && typeof sortedItems === 'undefined') {
    	console.error('tableData & sortedItems are undefined')
    	return null;
    }

	  const isEditable = typeof tableData.thLabels !== 'undefined' ? tableData.thLabels.some(item => item.editable) : false;
  	if (typeof tableData.thLabels !== 'undefined') {
	    tableData.thLabels = tableData.thLabels.map(item => {
	    	item.editable = typeof item.editable === 'boolean' ? item.editable : false;
	    	return item;
	    });
  	}


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
			  		{(isCheckable || isEditable) &&
            <div className="flex pb-3 justify-end">
		  				{isCheckable &&
		  				<React.Fragment>
	            	<div className="flex flex-wrap w-1/2 items-center">
	              	<span data-test="selected-items-length">{selectedItemsLength} selected</span>
	              </div>
              </React.Fragment>
          		}
          		<div className="w-1/2 text-right flex justify-end">
	              {typeof multiActions !== 'undefined' && multiActions.length > 0 &&
		              <span className="mr-2">
		                <DropdownButton 
		                  actions={multiActions}
		                  callbackProps={{ ...this.props, ...this.state }}
		                  disabled={selectedItemsLength === 0}
		                  data-test="multi-actions"
		                />
				          </span>
	              }
	              {isEditable &&
	              	<React.Fragment>
			              {!editAllState ? (
			              	<Button 
			                  style="primary"
			                  onClick={toggleEditAll}
			                  data-test="edit-all-btn">Edit All</Button>
			              ) : (
			              	<React.Fragment>
					              <Button
					              	classes="mr-2"
							            style="primary"
							            onClick={saveAllItems}
							            data-test="save-all-btn"
							           >
							            Save All
							          </Button>
							          <Button 
				                  style="primary"
				                  onClick={toggleEditAll}
							            data-test="cancel-all-btn"
				                >
				                	Cancel
				                </Button>
			                </React.Fragment>
			              )}
		              </React.Fragment>
	              }
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
						    {isEditable &&
					    		<td>&nbsp;</td>
					    	}
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
		              	<React.Fragment key={i}>
		              		{/*'' + col.editable*/}
			                {(!item.isEditing || !col.editable) && 
				                <td className={tdClass} >
		                			{item[col.value]}
			                	</td>
			                }
			                {(item.isEditing && col.editable) &&
			                	<td key={i} className={tdClassEditing}>
				                	<input 
			                      type="text"
			                      className={editInputClass}
			                      placeholder={item[col.value]}
			                      onChange={(e) => updateEditedItems(e, item, col.value)}
			                      data-test="edit-col-input"
			                     />
			                  </td>
			                }
		                </React.Fragment>       
		              ))}
		              {isEditable &&
                    <td className="text-center" width="150">
                      {item.isEditing ? (
                        <div>
                          <Button 
                            size="small"
                            display="inline-block"
                            onClick={saveEditedItem}
                            value={item[primaryKey]}
                          	data-test="save-edit-row-btn"
                           >
                              Save
                          </Button>
                           &nbsp;
                          <Button 
                            size="small" 
                            display="inline-block"
                            onClick={updateEditingItems}
                          	value={item[primaryKey]}
                          	data-test="cancel-edit-row-btn"
                           >
                              Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="small" 
                          display="inline-block"
                          onClick={updateEditingItems}
                          value={item[primaryKey]}
                          data-test="edit-row-btn"
                         >
                            Edit
                        </Button>
                      )}
                    </td>
                  }
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
