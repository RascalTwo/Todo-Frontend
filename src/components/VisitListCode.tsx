import React, { useState } from 'react';
import TextFieldIconForm from './TextFieldIconForm';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Edit, Cancel } from '@material-ui/icons';
import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    '& > *': {
      flex: '1'
    }
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '1em'
  },
  code: {
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    flex: '0'
  }
});

export default function VisitListCode({
  code,
  setCode
}: {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
  const styles = useStyles();
  const [editing, setEditing] = useState(false);

  return (
    <Paper className={styles.wrapper}>
      <Typography component="h1" className={styles.label}>
        List Code:
      </Typography>
      {editing ? (
        <TextFieldIconForm
          IconButtonProps={{ title: 'Visit List' }}
          defaultValue={code}
          onSubmission={code => {
            setCode(code);
            setEditing(false);
          }}
          autoFocus
        >
          <ExitToAppIcon />
        </TextFieldIconForm>
      ) : (
        <Typography className={styles.code}>{code}</Typography>
      )}
      <IconButton className={styles.button} onClick={() => setEditing(editing => !editing)}>
        {editing ? <Cancel /> : <Edit />}
      </IconButton>
    </Paper>
  );
}
