import React, { Component } from 'react';
import PaginatedTable from './PaginatedTable';
import queryBuilder from './queryBuilder';
import noUndefinedObj from './noUndefinedObj';


// const sortByFunc = (arr, filterObj) => {
//   const {
//     sortBy,
//     sortOrder,
//     retrieveCount,
//     startIndex,
//   } = filterObj;

//   let sortArr = arr.sort((a, b) => (a[sortBy] > b[sortBy]) ? sortOrder ? -1 : 1 : ((b[sortBy] > a[sortBy]) ? sortOrder ? 1 : -1 : 0));
//   sortArr = sortArr.slice(startIndex, startIndex + retrieveCount);
//   console.log(sortArr);
//   return sortArr;
// }

// const items = Array(100).fill({
//   "id": 4,
//   "email": "eve.holt@reqres.in",
//   "first_name": "Eve",
//   "last_name": "Holt",
//   "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
// });

let items = [];

for (let i = 0; i < 10; i++) {
  items.push({
    "id": i,
    "email": "eve.holt@reqres.in",
    "first_name": `firstName ${i}`,
    "last_name": `lastName ${i + 1}`,
    "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
  })
}


// [{
//     "id": 4,
//     "email": "eve.holt@reqres.in",
//     "first_name": "Eve",
//     "last_name": "Holt",
//     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
//   },
//   {
//     "id": 5,
//     "email": "charles.morris@reqres.in",
//     "first_name": "Charles",
//     "last_name": "Morris",
//     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
//   },
//   {
//     "id": 6,
//     "email": "tracey.ramos@reqres.in",
//     "first_name": "Tracey",
//     "last_name": "Ramos",
//     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"
//   },
// ]


class Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterObj: {
        total: 100,
        retrieveCount: 10,
        startIndex: 0,
        currentPage: 1,
        totalPages: 20,
        sortBy: 'first_name',
        sortOrder: 'ASC',
      },
      items: items,
      sortItemsEvt: () => null,
    }


    this.tableData = {
      thLabels: [{
        label: 'First Name',
        value: 'first_name',
        searchable: true,
      }, {
        label: 'Last Name',
        value: 'last_name',
        searchable: true,
      }]
    }
  }

  updateItems = (filterObj) => {
    // console.log(filterObj);

    const {
      sortBy,
      sortOrder,
      queries,
      searchTerms,
    } = filterObj

    const pagObj = {
      ...noUndefinedObj(filterObj),
      ...queries
    }

    // console.log(pagObj);

    for (let key in searchTerms) {
      if (searchTerms[key] !== '') {
        pagObj[key] = encodeURIComponent(searchTerms[key])
      }
    }

    delete pagObj.searchTerms

    console.log(queryBuilder(pagObj));

    // this.setState(({ items }) => ({
    //   items: sortByFunc(items, filterObj),
    // }))

    this.setState({ filterObj })

    this.sortByFunc(filterObj);
  }


  sortByFunc = (filterObj) => {
    const {
      sortBy,
      sortOrder,
      retrieveCount,
      startIndex,
    } = filterObj;

    const { items } = this.state;

    // console.log(items);

    let sortArr = items.sort((a, b) => (a[sortBy] > b[sortBy]) ? sortOrder ? -1 : 1 : ((b[sortBy] > a[sortBy]) ? sortOrder ? 1 : -1 : 0));
    sortArr = sortArr.slice(startIndex, startIndex + retrieveCount);
    // console.log(sortArr);
    // console.log(items);

    this.setState({ sortedItems: sortArr });
  }

  componentDidMount() {
    this.sortByFunc(this.state.filterObj);
  }

  render() {

    const {
      items,
      filterObj,
      sortedItems = [],
    } = this.state;

    // const sortedItems = items;

    const sortableTableProps = {
      items,
      filterObj,
      updateItems: this.updateItems,
      tableData: this.tableData,
      isCheckable: true,
      primaryKey: 'id',
      multiActions: [{
      	label: 'Action',
      	action: (obj) => console.log(obj),
      }]
    }

    return (
      <div>
  			<PaginatedTable { ...sortableTableProps } />
  		</div>
    )
  }
}

export default Page;
