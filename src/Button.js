import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  style: PropTypes.string,
  classes: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.array,
    PropTypes.number,
  ]),
  active: PropTypes.bool,
};

// styles - primary, secondary, normal, link
// size - normal, large, small
const Button = ({
  onClick,
  classes,
  type = 'button',
  style = 'primary',
  size = 'normal',
  disabled = false,
  active = false,
  display = 'block',
  value,
  children,
}) => {

  let classNames = display + ' rounded';

  switch (size) {
    case 'small':
      classNames += ' text-xs px-4 py-1';
      break;
    case 'normal':
      classNames += ' px-6 py-2';
      break;
    case 'large':
      classNames += ' px-8 py-3';
  }

  if (!disabled) {
    switch (style) {
      case 'primary':
        classNames += ' bg-red-primary hover:bg-red-hover text-white';
        break;
      case 'secondary':
        classNames += ' hover:bg-gray-100 border';
        break;
      case 'pagination':
        classNames += ' hover:text-white hover:bg-red-primary border-r border-grey-light px-3 py-2';
    }
  } else {
    classNames += ' bg-gray-200 border text-gray-400'
  }

  if (typeof classes !== 'undefined') classNames += ` ${classes}`;

  return (
    <button 
      type={type} 
      value={value}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
     >
      {children}
    </button>
  )
}

Button.propTypes = propTypes;

export default Button;
