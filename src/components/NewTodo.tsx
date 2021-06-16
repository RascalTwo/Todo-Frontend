import React from 'react';
import TextFieldIconForm, { TextFieldIconFormProps } from './TextFieldIconForm';

import AddIcon from '@material-ui/icons/Add';

export default function NewTodo(props: Omit<TextFieldIconFormProps, 'children'>): JSX.Element {
  return (
    <TextFieldIconForm
      placeholder="New Todo"
      required
      IconButtonProps={{ title: 'Add Item' }}
      {...props}
    >
      <AddIcon />
    </TextFieldIconForm>
  );
}
