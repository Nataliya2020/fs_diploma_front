import * as React from 'react';
import {PropsWithChildren} from 'react';
import headerCss from './Header.module.css'

export type Props = {
  children?: JSX.Element | JSX.Element[]
}

function Header({children}: PropsWithChildren<Props>) {
  return (
    <header className={headerCss.page_header}>
      <h1 className={headerCss.page_header__title}>Идём<span>в</span>кино</h1>
      {children}
    </header>
  )
}

export default Header;
