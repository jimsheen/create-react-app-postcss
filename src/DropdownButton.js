import React, { Component } from 'react';
// import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from './Button';

/**
 * @class DropdownButton - Display list of projects in sortable table
 */
export class DropdownButton extends Component {

  /**
   * @type {object} propTypes
   * @property {array} actions - array of actions in dropdown
   */
  static propTypes = {
    actions: PropTypes.array.isRequired,
    buttonName: PropTypes.string,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    buttonName: 'Actions',
    roleName: '',
    disabled: false,
  }

  /**
   * constructor
   */
  constructor() {
    super();

    /**
     * @type {object}
     * @property {boolean} isOpen - is dropdown content open
     */
    this.state = {
      isOpen: false,
    }
  }

  /**
   * Toggle dropdown open/close state
   * @param {e} object - event object
   * @param {boolean} bool - true/false
   */
  toggleDropdown = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  }

  actionClick = (action) => {
    action(this.props.callbackProps);
    this.toggleDropdown(false);
  }

  /**
   * Render dropdown button
   * @return {ReactElement}
   */
  render() {

    const contentClass = 'rounded shadow-md absolute pin-t pin-l border bg-white min-w-full';
    const dropdownClass = this.state.isOpen ? contentClass : contentClass + ' hidden';

    const {
      buttonName,
      actions,
      disabled,
    } = this.props;

    return (
      <div className="relative inline-block">
        <Button onClick={this.toggleDropdown} disabled={disabled}>
          <span>{buttonName}</span>
        </Button>
          {actions.length > 0 &&
            <div className={dropdownClass}>
              <ul className="list-reset">
                {actions.map((action, index) => (
                  <li key={index}>
                    <span 
                      className='px-6 py-2 block text-black hover:bg-grey-light' 
                      onClick={() => this.actionClick(action.action)}
                      key={action.label}>
                        {action.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          }
      </div>
    )
  }
}

export default DropdownButton;
