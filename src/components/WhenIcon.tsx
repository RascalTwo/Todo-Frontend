import React from 'react';
import { makeStyles } from '@material-ui/core';
import { AccessTime } from '@material-ui/icons';

const useStyles = makeStyles({
  wrapper: {
    display: 'inline-flex',
    verticalAlign: 'middle'
  }
});

export default function WhenIcon({
  created,
  updated
}: {
  created: Date;
  updated: Date;
}): JSX.Element {
  const styles = useStyles();

  const isUpdated = created.getTime() !== updated.getTime();

  const title = isUpdated
    ? `Created  ${created.toLocaleString()}\nUpdated ${updated.toLocaleString()}`
    : created.toLocaleString();

  return (
    <span className={styles.wrapper} title={title}>
      <AccessTime />
    </span>
  );
}
