import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const emailReducer = (emailState, action) => {
  if (action.type === "EMAIL_INPUT") {
    return {
      emailAddr: action.emailAddr,
      isValid: action.emailAddr.includes("@"),
    };
  }
  if (action.type === "EMAIL_BLUR") {
    return {
      emailAddr: emailState.emailAddr,
      isValid: emailState.emailAddr.includes("@"),
    };
  }
  return {
    emailAddr: "",
    isValid: false,
  };
};

const passwordReducer = (passwordState, action) => {
  if (action.type === "PASSWORD_INPUT") {
    return {
      password: action.password,
      isValid: action.password.trim().length > 6,
    };
  }
  if (action.type === "PASSWORD_BLUR") {
    return {
      password: passwordState.password,
      isValid: passwordState.password.trim().length > 6,
    };
  }
  return {
    password: "",
    isValid: false,
  };
};

const Login = (props) => {
  //const [enteredEmail, setEnteredEmail] = useState("");
  //const [emailIsValid, setEmailIsValid] = useState();
  //const [enteredPassword, setEnteredPassword] = useState("");
  //const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    emailAddr: "",
    isValid: undefined,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    password: "",
    isValid: undefined,
  });

  const { isValid: emailValidAlias } = emailState;
  const { isValid: passworValidAlias } = passwordState;

  useEffect(() => {
    const formValidater = setTimeout(() => {
      setFormIsValid(emailValidAlias && passworValidAlias);
    }, 200);
    return () => {
      clearTimeout(formValidater);
    };
  }, [emailValidAlias, passworValidAlias]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "EMAIL_INPUT", emailAddr: event.target.value });

    setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "PASSWORD_INPUT", password: event.target.value });
    setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "EMAIL_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "PASSWORD_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.emailAddr, passwordState.password);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.emailAddr}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.password}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
