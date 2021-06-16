import React from 'react';

import SyncIcon from '@material-ui/icons/Sync';
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled';
import SyncProblemIcon from '@material-ui/icons/SyncProblem';
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
  serverOnline
}: {
  code: string;
  serverOnline: boolean;
}): JSX.Element {
  const styles = useStyles();
  return (
    <span
      className={styles.wrapper}
      title={!serverOnline ? 'Server Offline' : code ? 'Synced' : 'On Private List'}
    >
      {!serverOnline ? <SyncProblemIcon /> : code ? <SyncIcon /> : <SyncDisabledIcon />}
    </span>
  );
}
