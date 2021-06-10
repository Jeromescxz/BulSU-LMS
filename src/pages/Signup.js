import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import firebase from "../utils/firebase";
import theme from "../utils/theme";
import {
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

var useStyles = makeStyles((theme) => ({
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
    margin: theme.spacing(0.5),
    [theme.breakpoints.down("xs")]: {
      width: 185,
      fontSize: 14
    }
  },
  or: {
    width: "100%",
    textAlign: "center",
    fontSize: 20,
    [theme.breakpoints.down("xs")]: {
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

function Signup() {
  const classes = useStyles();
  const history = useHistory("");
  const fieldSize = useMediaQuery(theme.breakpoints.down("xs"));
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    errors: ""
  });

  const handleChange = (prop) => (event) => {
    setPayload({ ...payload, [prop]: event.target.value });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setPayload({ ...payload, showPassword: !payload.showPassword });
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowConfirmPassword = () => {
    setPayload({
      ...payload,
      showConfirmPassword: !payload.showConfirmPassword
    });
  };

  const register = (event) => {
    event.preventDefault();

    if (!payload.email || !payload.password || !payload.confirmPassword) {
      setPayload({ ...payload, errors: "Please complete all fields!" });
    } else if (payload.confirmPassword !== payload.password) {
      setPayload({ ...payload, errors: "Password do not match" });
    } else if (payload.password.length <= 5) {
      setPayload({
        ...payload,
        errors: "Password should be at least 6 characters"
      });
    } else {
      setPayload({ ...payload, errors: "" });
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then((userCredential) => {
          alert("You have sign up successfully");
          firebase
            .auth()
            .signOut()
            .then(() => {
              // Sign-out successful.
            })
            .catch((error) => {
              // An error happened.
            });
          // Signed in

          // var user = userCredential.email;

          // ...
        })
        .catch((error) => {
          // var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          setPayload({ ...payload, errors: errorMessage });
        });
    }
  };
  return (
    <div className={classes.root}>
      {payload.errors ? (
        <Alert severity="error" className={classes.errors}>
          {payload.errors}
        </Alert>
      ) : (
        ""
      )}
      <Card elevation={10} className={classes.card}>
        <form className={classes.form}>
          <Typography variant="h4" color="textPrimary">
            Signup
          </Typography>

          <TextField
            className={classes.field}
            id="Email"
            onChange={handleChange("email")}
            label="Email"
            variant="outlined"
            size={fieldSize ? "small" : "medium"}
          />
          <FormControl
            className={classes.field}
            size={fieldSize ? "small" : "medium"}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={payload.showPassword ? "text" : "password"}
              value={payload.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {payload.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
          <FormControl
            className={classes.field}
            size={fieldSize ? "small" : "medium"}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-confirmPassword">
              Confirm password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirmPassword"
              type={payload.showConfirmPassword ? "text" : "password"}
              value={payload.confirmPassword}
              onChange={handleChange("confirmPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirmPassword visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                    edge="end"
                  >
                    {payload.showConfirmPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={130}
            />
          </FormControl>
          <Button
            onClick={register}
            className={classes.field}
            variant="contained"
            color="primary"
            size={fieldSize ? "small" : "large"}
          >
            REGISTER
          </Button>
          <Typography className={classes.or}>OR</Typography>
          <Button
            onClick={() => history.push("/signin")}
            className={classes.field}
            variant="contained"
            color="default"
            size={fieldSize ? "small" : "large"}
          >
            Already have an account? LOGIN
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Signup;
