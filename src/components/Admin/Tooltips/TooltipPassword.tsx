import * as React from 'react';
import {useAppSelector} from '../../../app/hooks';

function TooltipPassword() {
  const errorMessagePassword = useAppSelector(state => state.login.errorMessagePassword);

  return (
    <div>
      <p>
        {errorMessagePassword}
      </p>
    </div>
  )
}

export default TooltipPassword;
