import { ThemeProvider, makeStyles, Typography } from "@material-ui/core";
import theme from "./utils/theme";
import firebase from "./utils/firebase";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import PrivateRoute from "./router/privateRoute";
import PublicRoute from "./router/publicRoute";
//pages
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

var useStyles = makeStyles(() => ({
  loading: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));
function App() {
  const classes = useStyles();
  const [state, setstate] = useState({
    isAuth: false,
    isLoading: true
  });
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setstate({ isAuth: true, isLoading: false });
      } else {
        setstate({ isAuth: false, isLoading: false });
      }
    });
  }, []);

  if (state.isLoading) {
    return (
      <div className={classes.loading}>
        <Typography variant="h4">Loading...</Typography>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/home" exact />
          </Route>
          <PrivateRoute component={Home} isAuth={state.isAuth} path="/home" />
          <PublicRoute
            component={Signin}
            isAuth={state.isAuth}
            restricted={true}
            path="/signin"
          />
          <PublicRoute
            component={Signup}
            isAuth={state.isAuth}
            restricted={true}
            path="/signup"
            exact
          />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
