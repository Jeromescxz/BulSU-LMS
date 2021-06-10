import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../utils/firebase";
import theme from "../utils/theme";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import {
  makeStyles,
  Card,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Typography,
  Button,
  useMediaQuery
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
//icons
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },

  form: {
    display: "flex",
    flexDirection: "column"
  },
  card: {
    width: "320px",
    padding: 20,
    borderRadius: 10,
    border: "2px solid black",
    [theme.breakpoints.down("xs")]: {
      width: 200,
      border: "none"
    }
  },

  field: {
    margin: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      height: 30,
      width: 185,
      fontSize: 14
    }
  },
  errors: {
    margin: theme.spacing(2),
    width: 320,
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
      width: 200
    }
  }
}));
function Signin() {
  const classes = useStyles();
  const history = useHistory("");
  const fieldSize = useMediaQuery(theme.breakpoints.down("xs"));
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
    errors: ""
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const login = (event) => {
    event.preventDefault();

    if (!values.email || !values.password) {
      setValues({ ...values, errors: "Please complete all fields!" });
    } else {
      setValues({ ...values, errors: "" });
      firebase
        .auth()
        .signInWithEmailAndPassword(values.email, values.password)
        .then((signedInUser) => {
          // Signed in

          alert("Welcome " + signedInUser.user.email);

          // ...
        })
        .catch((error) => {
          // var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          setValues({ ...values, errors: errorMessage });
        });
    }
  };
  return (
    <div className={classes.root}>
      {values.errors ? (
        <Alert severity="error" className={classes.errors}>
          {values.errors}
        </Alert>
      ) : (
        ""
      )}
      <Card elevation={10} className={classes.card}>
        <form className={classes.form}>
          <Typography variant="h4" color="textPrimary">
            Login
          </Typography>

          <TextField
            className={classes.field}
            value={values.email}
            onChange={handleChange("email")}
            label="Email@email.com"
            variant="outlined"
            size={fieldSize ? "small" : "medium"}
          />
          <FormControl
            className={classes.field}
            variant="outlined"
            size={fieldSize ? "small" : "medium"}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
          <Button
            onClick={login}
            className={classes.field}
            variant="contained"
            color="primary"
          >
            LOGIN
          </Button>

          <Button
            onClick={() => history.push("/Signup")}
            className={classes.field}
            variant="contained"
            color="default"
          >
            SIGNUP
          </Button>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </form>
      </Card>
    </div>
  );
}

export default Signin;
