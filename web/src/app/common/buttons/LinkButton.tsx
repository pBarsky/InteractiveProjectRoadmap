import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styles from './LinkButton.module.scss';

const LinkButton = (props: LinkProps) => {
  return <Link {...props} role='button' className={styles.linkButton} />;
};

export default LinkButton;
