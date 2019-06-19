import React from 'react';
import { range, isEmpty } from 'underscore';
import PropTypes from 'prop-types';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  filterObj: PropTypes.object.isRequired,
}

const paginationClass = 'flex justify-center align-center list-reset border border-grey-light rounded w-auto';
const numberClass = 'block hover:text-white hover:bg-red-primary border-r border-grey-light px-3 py-2';
const numberClassActive = numberClass + ' bg-red-primary text-white hover:bg-red-hover';
const btnClass = 'block hover:text-white hover:bg-red-primary px-3 py-2';

const Pagination = props => {

  /**
   * render
   * @return {ReactElement} markup
   */

  const { onClick, filterObj } = props;

  if (isEmpty(filterObj)) return null;

  let { currentPage, totalPages } = filterObj;
  const last = totalPages;

  let startPage, endPage;

  if (currentPage > totalPages) currentPage = totalPages;

  if (totalPages <= 10) {
    // less than 10 total pages so show all
    startPage = 1;
    endPage = totalPages;
  } else {
    // more than 10 total pages so calculate start and end pages
    if (currentPage <= 6) {
      startPage = 1;
      endPage = 10;
    } else if (currentPage + 4 >= totalPages) {
      startPage = totalPages - 9;
      endPage = totalPages;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }
  }

  let pages = range(startPage, endPage + 1);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center align-center mb-4">
      <div className={paginationClass} data-test="pagination">
        {currentPage !== 1 &&
          <React.Fragment>
            <button onClick={onClick} data-test="first-btn" className={btnClass + ' border-l'} value={1}>First</button>
            <button onClick={onClick} data-test="prev-btn" className={btnClass} value={currentPage - 1}>Prev</button>
          </React.Fragment>
        }
        {pages.map(page => (
            <button 
              onClick={onClick}
              value={page}
              key={page}
              className={page === currentPage ? numberClassActive : numberClass}
              data-test={`pagination-number-${page}`}
            >
                {page}
              </button>
          ))}
        {currentPage !== last ? (
          <React.Fragment>
            <button onClick={onClick} data-test="next-btn" className={btnClass + ' border-r'} value={currentPage + 1}>Next</button>
            <button onClick={onClick} data-test="last-btn" className={btnClass} value={last}>Last</button>
          </React.Fragment>
        ) : null}
      </div>
    </div>
  )
}

Pagination.propTypes = propTypes;

export default Pagination;
