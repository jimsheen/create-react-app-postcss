/* eslint-disable */
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from '../Button';

const props = {
  value: 'Test',
  children: 'test',
  onClick: action('clicked')
}

const primary = {
  ...props,
  style: 'primary',
}

const secondary = {
  ...props,
  style: 'secondary',
}

const disabled = {
  ...props,
  disabled: true,
}

const large = {
  ...props,
  size: 'large',
}

const small = {
  ...props,
  size: 'small',
}


storiesOf('Button', module)
  .add('Primary', () => <Button { ...primary } />)
  .add('Secondary', () => <Button { ...secondary } />)
  .add('Disabled', () => <Button { ...disabled } />)
  .add('Large', () => <Button { ...large } />)
  .add('Small', () => <Button { ...small } />)
