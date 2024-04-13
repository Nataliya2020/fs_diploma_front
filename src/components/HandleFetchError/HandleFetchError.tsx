import * as React from 'react';
import errorFetchCss from "./HandleFetchError.module.css";

function HandleFetchError() {

  return (
    <div className={errorFetchCss.container}>
      <div className={errorFetchCss.main}>
        <h2> Что-то пошло не так</h2>
      </div>
    </div>
  )
}

export default HandleFetchError;
