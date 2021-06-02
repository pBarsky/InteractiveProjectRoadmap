import { FieldHookConfig, useField } from 'formik';
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Input.module.scss';

const Input = ({ ...props }: FieldHookConfig<string>): JSX.Element => {
  const [field, meta] = useField(props);

  return (
    <div className={styles.input}>
      {props.type === 'textarea'
        ? (
        <TextareaAutosize
          className={props.className}
          disabled={props.disabled}
          {...field}
          id={props.id}
        />
          )
        : (
        <input
          className={props.className}
          disabled={props.disabled}
          {...field}
          type={props.type}
          id={props.id}
        />
          )}
      {meta.touched && meta.error && <div className={styles.errorMessage}>{meta.error}</div>}
    </div>
  );
};

export default Input;
