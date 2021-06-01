import { FieldHookConfig } from 'formik';
import React from 'react';
import styles from './Field.module.scss';
import Input from './Input';

interface FieldProps {
  label: string;
}

const Field = ({ label, ...props }: FieldProps & FieldHookConfig<string>) => {
  return (
    <div className={`${styles.field} ${props.className}`}>
      <label htmlFor={props.id} className={props.required ? styles.required : ''}>
        {label}
      </label>
      <Input {...props} />
    </div>
  );
};

export default Field;
