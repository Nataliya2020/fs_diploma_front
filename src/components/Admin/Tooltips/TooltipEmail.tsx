import * as React from 'react';
import {useAppSelector} from '../../../app/hooks';

function TooltipEmail() {
  const errorMessageEmail = useAppSelector(state => state.login.errorMessageEmail);

  return (
    <div>
      <p>
        {errorMessageEmail}
      </p>
    </div>
  )
}

export default TooltipEmail;
