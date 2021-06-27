import React from 'react';
import TextFieldIconForm, { TextFieldIconFormProps } from './TextFieldIconForm';

import AddIcon from '@material-ui/icons/Add';

/** Customized {@link TextFieldIconFormProps} with {@link AddIcon} for creating new Todos */
export default function NewTodo(props: Omit<TextFieldIconFormProps, 'children'>) {
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
