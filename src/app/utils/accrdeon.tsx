import * as React from 'react';

export default function accordeon(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.classList.toggle('conf-step__header_closed');
  e.currentTarget.classList.toggle('conf-step__header_opened');
}
