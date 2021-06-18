import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';

import AccessTimeIcon from '@material-ui/icons/AccessTime';

const useStyles = makeStyles({
  wrapper: {
    display: 'inline-flex',
    verticalAlign: 'middle'
  }
});

export default React.memo(
  function WhenIcon({
    created,
    updated,
    completed
  }: {
    created: Date;
    updated: Date | null;
    completed: Date | null;
  }) {
    const styles = useStyles();

    const title = useMemo(
      () =>
        [
          ['Created', created],
          ['Updated', updated],
          ['Completed', completed]
        ]
          .reduce(
            (lines, [title, date]) =>
              date === null ? lines : [...lines, `${title} ${date.toLocaleString()}`],
            []
          )
          .join('\n'),
      [created, updated, completed]
    );

    return (
      <span className={styles.wrapper} title={title}>
        <AccessTimeIcon />
      </span>
    );
  },
  (prev, curr) => prev.created === curr.created && prev.updated === curr.updated
);
