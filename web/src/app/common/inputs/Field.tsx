import styles from './Field.module.scss';
import { FieldHookConfig, useField } from 'formik';

interface FieldProps{
    label: string;
  }

const Field = ({ label, ...props }: FieldProps & FieldHookConfig<string>) => {
  const [field, meta] = useField(props);
  return (
      <div className={styles.field}>
        <label className={props.required ? styles.required : ''}>
          {label}
        </label>
          <input {...field} type={props.type} />
        {meta.touched && meta.error
          ? (
          <div className={styles.errorMessage}>{meta.error}</div>
            )
          : null}
      </div>
  );
};

export default Field;
