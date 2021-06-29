import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../utils/firebase";
import theme from "../utils/theme";
import {
  Card,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Typography,
  Button,
  Box,
  makeStyles,
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
    width: 400,
    padding: 20,
    borderRadius: 10,

    [theme.breakpoints.down("xs")]: {
      width: 200,
      background: "none"
    }
  },
  field: {
    margin: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      height: 30,
      width: 185,
      fontSize: 14,
      margin: theme.spacing(1)
    }
  },
  button: {
    marginTop: theme.spacing(2)
  },
  grid: {
    display: "flex",
    alignItems: "center"
  },
  name: {
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column"
    }
  },

  errors: {
    margin: theme.spacing(2),
    width: 320,
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
      width: 200
    }
  },
  welcome: {
    color: "white"
  }
}));
const db = firebase.firestore();

function Signup() {
  const classes = useStyles();
  const history = useHistory("");
  const fieldSize = useMediaQuery(theme.breakpoints.down("xs"));
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    LastName: "",
    FirstName: "",
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
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then((userCredential) => {
          const batch = db.batch();
          const currentuser = firebase.auth().currentUser;
          const registerRef = db.collection("users").doc(currentuser.uid);
          batch.set(registerRef, {
            email: payload.email,
            first_name: payload.FirstName,
            last_name: payload.LastName,
            profile_url: "",
            post_number: 0,
            friends_number: 0,
            created_at: new Date()
          });
          batch
            .commit()
            .then(() => {
              alert("You have sign up successfully");
            })
            .catch((error) => {
              //err
            });

          // Signed in

          // var user = userCredential.email;

          // ...
        })
        .catch((error) => {
          // var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          setPayload({
            ...payload,
            errors: errorMessage
          });
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
        <Typography variant="h4">Welcome</Typography>
        <form className={classes.form}>
          <Box className={classes.name}>
            <TextField
              className={classes.field}
              id="FirstName"
              onChange={handleChange("FirstName")}
              label="First name"
              variant="standard"
              size={fieldSize ? "small" : "medium"}
            />
            <TextField
              className={classes.field}
              id="LastName"
              onChange={handleChange("LastName")}
              label="Last name"
              variant="standard"
              size={fieldSize ? "small" : "medium"}
            />
          </Box>
          <TextField
            className={classes.field}
            id="Email"
            onChange={handleChange("email")}
            label="Email"
            variant="standard"
            size={fieldSize ? "small" : "medium"}
          />
          <FormControl
            className={classes.field}
            variant="standard"
            size={fieldSize ? "small" : "medium"}
          >
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
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
            size={fieldSize ? "small" : "medium"}
            className={classes.field}
            variant="standard"
          >
            <InputLabel htmlFor="standard-adornment-confirmPassword">
              Confirm password
            </InputLabel>
            <Input
              id="standard-adornment-confirmPassword"
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
            className={classes.button}
            variant="contained"
            color="primary"
          >
            REGISTER
          </Button>

          <Button
            onClick={() => history.push("/signin")}
            className={classes.button}
            variant="contained"
            color="default"
          >
            Have an account?
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Signup;
