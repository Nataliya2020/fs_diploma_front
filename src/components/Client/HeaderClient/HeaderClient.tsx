import * as React from 'react';
import {PropsWithChildren} from 'react';
import headerClientCss from './HeaderClient.module.css'

export type Props = {
  children?: JSX.Element | JSX.Element[]
}

function HeaderClient({children}: PropsWithChildren<Props>) {
  return (
    <header className={headerClientCss.page_header}>
      <h1 className={headerClientCss.page_header__title}>Идём<span>в</span>кино</h1>
      {children}
    </header>
  )
}

export default HeaderClient;
