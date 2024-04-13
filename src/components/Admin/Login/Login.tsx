import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import {useEffect, useRef} from 'react';
import {useAppSelector, useAppDispatch} from '../../../app/hooks';
import TooltipEmail from '../Tooltips/TooltipEmail';
import TooltipPassword from '../Tooltips/TooltipPassword';
import getToken from '../../../app/utils/getToken';
import {setUnauthorizedAuthTimeout} from '../../../store/slices/slicesAdmin/hallAllReducer';
import '../../../normolizeAdmin.css';
import loginCss from './Login.module.css';

import {
  setEmail,
  setPassword,
  setErrorMessageEmail,
  setErrorMessagePassword, fetchPostLoginData
} from '../../../store/slices/slicesAdmin/loginReducer';

function Login() {
  const dispatch = useAppDispatch();
  const adminEmail = useAppSelector(state => state.login.email);
  const adminPassword = useAppSelector(state => state.login.password);
  const errorMessageEmail = useAppSelector(state => state.login.errorMessageEmail);
  const errorMessagePassword = useAppSelector(state => state.login.errorMessagePassword);
  const Navigate = ReactRouterDOM.Navigate;
  const submitRef = useRef<HTMLInputElement>(null);
  const isLoading = useAppSelector(state => state.login.isLoading);

  useEffect(() => {
    document.body.classList.add(`${loginCss.bodyAd}`);
    dispatch(setUnauthorizedAuthTimeout(0));
    const handlerClick = (e: { target: any; }) => {
      if (submitRef.current) {
        if (!submitRef.current.contains(e.target)) {
          dispatch(setErrorMessageEmail({errorMessage: '', error: false}));
          dispatch(setErrorMessagePassword({errorMessage: '', error: false}));
        }
      }
    }
    document.addEventListener('mousedown', handlerClick);

    return () => document.removeEventListener('mousedown', handlerClick);
  }, [dispatch])

  const handlerClickEmail = () => {
    dispatch(setErrorMessageEmail({errorMessage: '', error: false}));
  }

  const handlerClickPassword = () => {
    dispatch(setErrorMessagePassword({errorMessage: '', error: false}));
  }
  const handlerEmail = (e: { target: { value: string; }; }) => {

    if (e.target.value) {
      dispatch(setErrorMessageEmail({errorMessage: '', error: false}));
    }
    dispatch(setEmail(e.target.value));
  }

  const handlerPassword = (e: { target: { value: string; }; }) => {
    if (e.target.value) {
      dispatch(setErrorMessagePassword({errorMessage: '', error: false}));
    }
    dispatch(setPassword(e.target.value));
  }

  const handlerBlurEmail = () => {
    dispatch(setErrorMessageEmail({errorMessage: '', error: false}));
  }
  const handlerBlurPassword = () => {
    dispatch(setErrorMessagePassword({errorMessage: '', error: false}));
  }
  const submitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!adminEmail) {
      dispatch(setErrorMessageEmail({errorMessage: 'Введите email', error: true}));
    } else {
      dispatch(setErrorMessageEmail({errorMessage: '', error: false}));
    }

    if (!adminPassword) {
      dispatch(setErrorMessagePassword({errorMessage: 'Введите пароль', error: true}));
    } else {
      dispatch(setErrorMessagePassword({errorMessage: '', error: false}));
    }

    if (adminEmail && adminEmail.indexOf('@') === -1) {
      dispatch(setErrorMessageEmail({errorMessage: 'Email должен содержать символ @', error: true}));
    } else if (!adminEmail && adminEmail.indexOf('@') === -1) {
      dispatch(setErrorMessageEmail({errorMessage: 'Введите email', error: true}));
    }

    if (adminEmail.length > 255) {
      dispatch(setErrorMessageEmail({errorMessage: 'Email не должен быть больше 255 символов', error: false}));
    }

    if (adminPassword.length < 8 && adminPassword.length > 0) {
      dispatch(setErrorMessagePassword({errorMessage: 'Пароль должен быть более 8 симовлов', error: false}));
    }

    if (adminEmail && adminEmail.length <= 255 && adminEmail.indexOf('@') !== -1 && adminPassword && adminPassword.length >= 8) {
      getToken().then(() => {
          dispatch(fetchPostLoginData(
              {
                email: adminEmail,
                password: adminPassword
              }
            )
          )
        }
      );
    }
  }

  if (localStorage.getItem('sanctumToken')) {
    return <Navigate to={`/homeAdmin`}/>;
  }

  if (isLoading) {
    return (
      <>
        <header className={loginCss.page__header}>
          <h1 className={loginCss.page_header__title}>Идём<span>в</span>кино</h1>
          <span className={loginCss.page_header__subtitle}>Администраторррская</span>
        </header>

        <div className={loginCss.load_text_wrapper}>
          <p>
            Информация загружается. Пожалуйста, подождите.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <header className={loginCss.page__header}>
        <h1 className={loginCss.page_header__title}>Идём<span>в</span>кино</h1>
        <span className={loginCss.page_header__subtitle}>Администраторррская</span>
      </header>

      <main>
        <section className={loginCss.login}>
          <header className={loginCss.login__header}>
            <h2 className={loginCss.login__title}>Авторизация</h2>
          </header>
          <div className={loginCss.login__wrapper}>
            <form
              className={loginCss.login__form}
              onSubmit={(e) => submitLogin(e)}
              noValidate>
              <label className={loginCss.login__label} htmlFor="mail">E-mail
                <input
                  className={loginCss.login__input}
                  type="mail"
                  placeholder="example@domain.xyz"
                  name="mail"
                  onChange={(e) => handlerEmail(e)}
                  onBlur={handlerBlurEmail}
                  onClick={() => handlerClickEmail()}
                  value={adminEmail}
                  required
                />
              </label>
              {errorMessageEmail && <TooltipEmail/>}

              <label className={loginCss.login__label} htmlFor="pwd">Пароль
                <input
                  className={loginCss.login__input} type="password" placeholder="" name="pwd"
                  onChange={(e) => handlerPassword(e)}
                  onBlur={handlerBlurPassword}
                  onClick={() => handlerClickPassword()}
                  value={adminPassword}
                  autoComplete={"on"}
                  required
                />
              </label>
              {errorMessagePassword && <TooltipPassword/>}
              <div className={loginCss.text_center}>
                <input value="Авторизоваться" type="submit" className={loginCss.login__button} ref={submitRef}/>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}

export default Login;
