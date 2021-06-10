import { useState } from "react";
import React from "react";
import {
  SwipeableDrawer,
  Box,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  IconButton,
  Divider,
  Typography,
  AppBar,
  Toolbar
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import firebase from "../utils/firebase";
// icons
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import ExitToApp from "@material-ui/icons/ExitToApp";
import KeyboardBackspace from "@material-ui/icons/KeyboardBackspace";
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0
  },
  drawer: {
    color: "white"
  },
  appbar: {
    backgroundColor: "white"
  },
  signout: {
    marginTop: 30
  },
  listitem: {
    marginTop: 8
  },
  navText: {
    color: theme.palette.primary.main
  },
  boxNavi: {
    height: "100vh",
    width: "220px",
    [theme.breakpoints.down("xs")]: {
      width: "100vw",
      display: "flex",
      justifyContent: "center"
    }
  },
  titleNav: {
    alignContent: "flex-start"
  },
  back: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  }
}));

const signout = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
};
function Nav() {
  const [open, setOpen] = useState(false);
  const history = useHistory("");
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="sticky" className={classes.appbar} elevation={0}>
        <Toolbar>
          <IconButton color="primary" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography color="primary" variant="h5">
            <Box fontWeight="fontWeightMedium" fontStyle="italic" m={1}>
              BulSU FLEX
            </Box>
          </Typography>

          <SwipeableDrawer
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => {
              setOpen(true);
            }}
          >
            <Typography color="primary" variant="h5">
              <Box
                className={classes.titleNav}
                fontWeight="fontWeightMedium"
                fontStyle="italic"
                m={1}
              >
                <IconButton
                  className={classes.back}
                  color="primary"
                  onClick={() => setOpen(false)}
                >
                  <KeyboardBackspace />
                </IconButton>
                BulSU FLEX
              </Box>
            </Typography>
            <Divider />
            <Box className={classes.boxNavi}>
              <List className={classes.drawer}>
                <ListItem
                  className={classes.listitem}
                  button
                  onClick={() => history.push("/home")}
                >
                  <HomeIcon color="action" />
                  <ListItemText className={classes.navText} primary={"Home"} />
                </ListItem>

                <div className={classes.signout}>
                  <ListItem button onClick={signout}>
                    <ExitToApp color="action" />
                    <ListItemText
                      className={classes.navText}
                      primary={"Signout"}
                    />
                  </ListItem>
                </div>
              </List>
            </Box>
          </SwipeableDrawer>
        </Toolbar>
      </AppBar>
      <Divider />
    </div>
  );
}

export default Nav;
