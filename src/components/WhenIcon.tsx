import React from 'react';
import { makeStyles, Tooltip } from '@material-ui/core';

import AccessTimeIcon from '@material-ui/icons/AccessTime';

const useStyles = makeStyles({
  wrapper: {
    display: 'inline-flex',
    verticalAlign: 'middle'
  },
  tooltipText: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    gap: '0 0.5em'
  }
});

/** Icon with a {@link Tooltip} showcasing all dates of the Todo */
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

    return (
      <Tooltip
        className={styles.wrapper}
        arrow={true}
        title={
          <div className={styles.tooltipText}>
            {(
              [
                ['Created', created],
                ['Updated', updated],
                ['Completed', completed]
              ] as [string, Date][]
            )
              .filter(([, date]) => date)
              .map(([key, date], i) => (
                <React.Fragment key={i}>
                  <span>{key}</span>
                  <span>{date.toLocaleString()}</span>
                </React.Fragment>
              ))}
          </div>
        }
      >
        <AccessTimeIcon />
      </Tooltip>
    );
  },
  (prev, curr) => prev.created === curr.created && prev.updated === curr.updated
);
