// @flow

import React from 'react';
import Form, { Field } from 'react-formal';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

import './styles.scss';

Form.addInputTypes(require('react-formal-inputs'));
momentLocalizer(moment);

type Props = {
  className: string,
  name: string,
  id: string,
  format: string,
}

const DateInput = ({ className, name, id, format }: Props) => (
  <Field
    className={className}
    name={name}
    id={id}
    format={format}
  />
);

export default DateInput;
