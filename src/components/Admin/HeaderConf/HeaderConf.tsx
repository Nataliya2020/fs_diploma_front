import * as React from 'react';
import {PropsWithChildren} from 'react';
import accordeon from '../../../app/utils/accrdeon';

export type Props = {
  title: string,
  children?: JSX.Element | JSX.Element[]
}

function HeaderConf({title, children}: PropsWithChildren<Props>) {
  return (
    <>
      <header className="conf-step__header conf_step__header_opened" onClick={(e) => accordeon(e)}>
        <h2 className="conf-step__title">{title}</h2>
      </header>
      {children}
    </>
  )
}

export default HeaderConf;
