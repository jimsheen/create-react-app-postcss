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
    // align: PropTypes.string,
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
    // this.setState({ isOpen: typeof bool === 'boolean' ? bool : !this.state.isOpen });
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

    console.log(disabled);

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
  //   const dropdownClass = this.state.isOpen ? 'dropdownBtn dropdownBtn--open' : 'dropdownBtn';
  //   const { roleName } = this.props;
  //   // const { align } = this.props;
  //   // const dropdownContentClass = align === 'left' ? 'dropdownBtn__content dropdownBtn__content--left' : 'dropdownBtn__content';
  //   const actionBtn = (action, roleName) => {
      // const button = <span 
      //   className='dropdownBtn__action' 
      //   onClick={() => this.actionClick(action.func)}
      //   key={action.label}>
      //     {action.label}
      // </span>
  //     if (typeof(action.roleRestricted) !== 'undefined') {
  //       if (action.roleRestricted.indexOf(roleName) !== -1) {
  //         return button;
  //       }
  //       return null;
  //     }
  //     return button;
  //   }
  //   return (
  //     <div className={dropdownClass}
  //         onClick={() => this.toggleDropdown()}>
  //         <div>
  //          <i className="icon-more-button"></i>
  //         </div>
  //       <div>
  //         {this.props.actions.map(action =>
  //           actionBtn(action, roleName)
  //         )}
  //       </div>
  //     </div>
  //   )
  // }
}

export default DropdownButton;

// /**
// * @param {object} state - parse state
// * @return {object} - map state to props
// */
// const mapStateToProps = state => {
//   return {
//     roleName: state.login.loggedUser.role_key.role_name,
//   }
// }

// export default connect(mapStateToProps)(DropdownButton);
