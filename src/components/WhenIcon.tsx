import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import { AccessTime } from '@material-ui/icons';

const useStyles = makeStyles({
  wrapper: {
    display: 'inline-flex',
    verticalAlign: 'middle'
  }
});

export default React.memo(
  function WhenIcon({ created, updated }: { created: Date; updated: Date }): JSX.Element {
    const styles = useStyles();

    const title = useMemo(
      () =>
        created.getTime() !== updated.getTime()
          ? `Created  ${created.toLocaleString()}\nUpdated ${updated.toLocaleString()}`
          : created.toLocaleString(),
      [created, updated]
    );

    return (
      <span className={styles.wrapper} title={title}>
        <AccessTime />
      </span>
    );
  },
  (prev, curr) => prev.created === curr.created && prev.updated === curr.updated
);
