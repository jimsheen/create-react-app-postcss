// eslint-disable-next-line
import React, { Component } from 'react';


const withPagination = (WrappedComponent) => {
  return class extends Component {

    /**
     * @type {object}
     * @property {array} selectedItems - selected items in table
     * @property {boolean} selectAll - state of select all checkbox
     */
    state = {
      selectedItems: [],
      editedItems: [],
      selectAll: false,
      prevValue: '',
      pristine: true,
      editAllState: false,
      allKeys: [],
    }


    /**
     * Select all items in the whole table
     */
    selectAll = (e) => {
      const { items, primaryKey = 'id' } = this.props;
      console.log(items);
      const selectAll = !this.state.selectAll
      const selectedItems = selectAll === false ? [] : items.map(o => o[primaryKey])
      this.setState({ selectedItems, selectAll })
    }

    render() {
      console.log(this.props);
      console.log(this.state);
      const newProps = {
        ...this.props,
        ...this.state,
        selectAll: this.selectAll,
      }
      return (<WrappedComponent {...newProps} />);
    }

  }
}

// /**
//  * SortableTableContainer - contains default methods for selecting items in a table
//  *
//  */
// class SortableTableContainer extends Component {
//   /**
//    * constructor
//    */
//   constructor(props) {
//     super(props)
//     /**
//      * @type {object}
//      * @property {array} selectedItems - selected items in table
//      * @property {boolean} selectAll - state of select all checkbox
//      */
//     this.state = {
//       selectedItems: [],
//       editedItems: [],
//       selectAll: false,
//       prevValue: '',
//       pristine: true,
//       editAllState: false,
//       allKeys: [],
//     }
//   }

//   componentDidMount() {

//   }

//   /**
//    * handle updating selected items
//    * @param {object} event - click event
//    * @param {string} val - unique val of selected item
//    * @param {array} items - array of selected item keys
//    */
//   updateSelected = (event, val, items) => {
//     let { selectedItems, prevValue, selectAll } = this.state

//     const currentIndex = selectedItems.indexOf(val)
//     if (event.shiftKey) {
//       // get keys of currentItems
//       const currentItems = items.map(item => item.primary_key)
//       // get last item added to array
//       const prevIndex = currentItems.findIndex(x => x === prevValue)
//       // get position of selected val in items array
//       const currentIndex = currentItems.findIndex(x => x === val)

//       let rangeItems = []
//       if (prevIndex > currentIndex) {
//         rangeItems = currentItems.slice(currentIndex, prevIndex)
//       } else {
//         rangeItems = currentItems.slice(prevIndex, currentIndex + 1)
//       }

//       const addItems = rangeItems.filter(item => {
//         if (selectedItems.indexOf(item) === -1) {
//          return item
//         }
//         return null
//       })

//       const removeItems = rangeItems.filter((item, i) => {
//         if (i !== 0 && selectedItems.indexOf(item) !== -1) {
//          return item
//         }
//         return null
//       })

//       let newSelectedItems = selectedItems.filter(item => {
//         if (removeItems.indexOf(item) === -1) {
//           return item
//         }
//         return null
//       })

//       selectedItems = [...newSelectedItems, ...addItems]

//     } else {
//       if (currentIndex === -1) {
//         selectedItems.push(val)
//       } else {
//         selectedItems.splice(currentIndex, 1)
//       }
//     }

//     const newState = { selectedItems, prevValue: val, selectAll: selectedItems.length >= items.length ? true : selectAll }
//     this.setState(newState)

//     console.log(newState)

//     return newState
//     //
//   }


//    /**
//    * handle updating selected items
//    * @param {object} event - click event
//    * @param {string} val - unique val of selected item
//    */
//   updateEditingItems = (event, val) => {
//     let { editingItems=[] } = this.state

//     if (Array.isArray(val)) {
//       editingItems = val
//     }
//     else {
//       const currentIndex = editingItems.indexOf(val)
//       if (currentIndex === -1) {
//         editingItems.push(val)
//       } else {
//         editingItems.splice(currentIndex, 1)
//       }
//     }

//     this.setState({ editingItems })

//     console.log(editingItems)

//     return editingItems
//   }

//   toggleEditAll = (bool) => {
//     this.setState({ editAllState: typeof bool === 'boolean' ? bool : !this.state.editAllState })
//   }

//   /**
//   * Handle state update of item input in a row
//   * @param {object} event - on change event
//   * @param {object} item - current item to be updated
//   * @param {string} label - label of the column to be updated
//   */
//   updateEditedItems = (e, item, label) => {
//     const { value } = e.target
//     const { editedItems, editingItems } = this.state
//     const { items } = this.props
//     const newItem = item
//     newItem[label] = value
//     const newItems = editedItems.length === 0 ? [newItem] : items.reduce((newEditArr, editItem) => {
//         let newObj = editItem
//         if (editItem.primary_key === item.primary_key) {
//           newObj[label] = value
//         }
//         newEditArr.push(newObj)
//         return newEditArr
//       }, []).filter(editItem => editingItems.indexOf(editItem.primary_key) !== -1)
//     this.setState({
//       ...this.state,
//       editedItems: newItems
//     })
//   }

//   /**
//    * Handle removing selected items
//    * @param {SyntheticEvent} event
//    */
//   removeSelected(event) {
//     event.preventDefault()
//     const { projectKey } = this.props
//     this.setState({ 
//       selectedItems: [], 
//       selectAll: false, 
//       removeUsersModalOpen: false 
//     })
//     this.props.deleteItems(this.state.selectedItems, projectKey)

//   }

//   /**
//    * Toggle modal by modal name
//    * @param {string} modal - Modal name
//    */
//   toggleModal(modal) {
//     this.setState({
//       [modal]: !this.state[modal],
//       currentKeys: [],
//       projectKey: null
//     })
//   }

//   /**
//    * Select all items in the whole table
//   */
//   selectAll = (arr) => {
//     const items = typeof arr !== 'undefined' ? arr : this.props.items
//     const selectAll = !this.state.selectAll
//     const selectedItems = selectAll === false ? [] : items.map(o => o.primary_key)
//     this.setState({ selectedItems, selectAll })
//   }

//   selectAllPage = () => {
//     const { selectedItems } = this.state || []
//     const items = this.props.items.map(a => a.primary_key)
//     let newSelectedItems = []
//     items.forEach(a => {
//       const index = selectedItems.indexOf(a)
//       if (index === -1) {
//         newSelectedItems.push(a)
//       }
//     })
//     this.setState({ selectedItems: [...selectedItems, ...newSelectedItems] })
//   }

//   deselectAllPage = (items) => {
//     const { selectedItems } = this.state
//     let newSelectedItems = []
//     selectedItems.forEach(a => {
//       const index = items.indexOf(a)
//       if (index === -1) {
//         newSelectedItems.push(a)
//       }
//     })
//     this.setState({ selectedItems: newSelectedItems})
//   }

//   selectEverything = (items) => {
//     this.setState({ selectedItems: items })
//   }

//   deselectEverything = () => {
//     this.setState({ selectedItems: [] })
//   }

//   togglePristine = () => {
//     this.setState({ pristine: false })
//   }

//   render() {
//     return null
//   }
// }

export default withPagination
