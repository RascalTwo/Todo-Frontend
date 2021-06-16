import React from 'react';

import SyncIcon from '@material-ui/icons/Sync';
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled';
import SyncProblemIcon from '@material-ui/icons/SyncProblem';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  wrapper: {
    position: 'absolute',
    top: '1em',
    right: '1em'
  }
});

export default function SyncIndicator({
  code,
  serverOnline,
  realtime
}: {
  code: string;
  serverOnline: boolean;
  realtime: boolean;
}): JSX.Element {
  const styles = useStyles();
  if (!serverOnline)
    return (
      <span className={styles.wrapper} title="Server Offline">
        <SyncProblemIcon />
      </span>
    );
  if (!code)
    return (
      <span className={styles.wrapper} title="On Private List">
        <SyncDisabledIcon />
      </span>
    );
  if (!realtime)
    return (
      <span className={styles.wrapper} title="Synced">
        <SyncIcon />
      </span>
    );

  return (
    <span className={styles.wrapper} title="Realtime">
      <SyncAltIcon />
    </span>
  );
}
