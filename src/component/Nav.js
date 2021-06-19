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
  Toolbar,
  Grid
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import firebase from "../utils/firebase";
import CreatePost from "../modals/CreatePost";
// icons
import MenuIcon from "@material-ui/icons/Menu";
import AccountBox from "@material-ui/icons/AccountBox";
import HomeIcon from "@material-ui/icons/Home";
import ExitToApp from "@material-ui/icons/ExitToApp";
import KeyboardBackspace from "@material-ui/icons/KeyboardBackspace";
import Add from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    width: "100vw"
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
  },
  NavRightSide: {
    display: "flex",
    justifyContent: "flex-end"
  },
  grid: {}
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
  const [openCreatePost, setOpenCreatePost] = useState(false);
  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} position="fixed" elevation={0}>
        <Toolbar>
          <IconButton color="primary" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            alignContent="center"
            className={classes.grid}
          >
            <Grid item xs={8}></Grid>
            <Grid item xs={8}>
              <Typography color="primary" variant="h5">
                <Box fontWeight="fontWeightMedium" fontStyle="italic" m={1}>
                  Social Medyas
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box className={classes.NavRightSide}>
                <IconButton
                  className={classes.add}
                  color="primary"
                  onClick={() => setOpenCreatePost(true)}
                  size="small"
                >
                  <Add />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
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
                Social Medyas
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
                <ListItem
                  className={classes.listitem}
                  button
                  onClick={() => history.push("/profile")}
                >
                  <AccountBox color="action" />
                  <ListItemText
                    className={classes.navText}
                    primary={"Profile"}
                  />
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
        <Divider />
      </AppBar>
      <CreatePost open={openCreatePost} setOpen={setOpenCreatePost} />
    </div>
  );
}

export default Nav;
