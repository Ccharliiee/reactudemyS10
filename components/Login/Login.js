import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/authContext.js";
import Input from "../UI/Input/Input";

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

  const authCtx = useContext(AuthContext);

  const { isValid: emailValidAlias } = emailState;
  const { isValid: passwordValidAlias } = passwordState;

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(() => {
    const formValidater = setTimeout(() => {
      setFormIsValid(emailValidAlias && passwordValidAlias);
    }, 200);
    return () => {
      clearTimeout(formValidater);
    };
  }, [emailValidAlias, passwordValidAlias]);

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
    if (formIsValid) {
      authCtx.onLogin(emailState.emailAddr, passwordState.password);
    } else if (!emailValidAlias) {
      emailInputRef.current.inputFocus();
    } else {
      passwordInputRef.current.inputFocus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          isValid={emailValidAlias}
          ref={emailInputRef}
          type="email"
          id="email"
          label="Email"
          value={emailState.password}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          isValid={passwordValidAlias}
          ref={passwordInputRef}
          type="password"
          id="password"
          label="Password"
          value={passwordState.password}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
