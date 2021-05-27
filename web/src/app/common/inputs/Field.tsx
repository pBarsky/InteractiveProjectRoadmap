import { FieldHookConfig, useField } from 'formik';
import styles from './Field.module.scss';

interface FieldProps{
    label: string;
  }

const Field = ({ label, ...props }: FieldProps & FieldHookConfig<string>) => {
  const [field, meta] = useField(props);
  return (
      <div className={styles.field}>
        <label htmlFor={props.name} className={props.required ? styles.required : ''}>
          {label}
        </label>
          <input {...field} type={props.type} id={props.name} />
        {meta.touched && meta.error && <div className={styles.errorMessage}>{meta.error}</div>}
      </div>
  );
};

export default Field;
