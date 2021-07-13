import React, { useState, useEffect } from "react";
import Nav from "../component/Nav";
import firebase from "../utils/firebase";
import moment from "moment";
import theme from "../utils/theme";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";
import EditPost from "../modals/EditPost";
import {
  Grid,
  makeStyles,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  CardHeader,
  Avatar,
  useMediaQuery,
  Popper,
  Paper,
  Fade,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import MoreHoriIcon from "@material-ui/icons/MoreHoriz";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
var useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 100,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center"
  },
  container: {
    width: 1000
  },

  media: {
    height: 0,
    paddingTop: "100%" // 16:9
  },
  friendsList: {
    width: 300,
    position: "fixed",
    [theme.breakpoints.down("sm")]: {
      width: 200
    }
  },
  friends: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: theme.spacing(1)
  },
  card: {
    border: "0.5px solid gray",
    marginBottom: 20,
    width: "100%"
  },
  firstgrid: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  buttons: {
    textTransform: "none"
  }
}));

const db = firebase.firestore();
function Home() {
  const classes = useStyles();
  const bp = useMediaQuery(theme.breakpoints.down("xs"));
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [state, setState] = useState({
    useruid: "",
    firstName: "",
    lastName: "",
    profileURL: "",
    imageURL: "",
    NumberOfFriends: 0,
    puid: "none"
  });
  const [post, setPost] = useState([]);
  const [allpost, setAllPost] = useState([]);
  const [postuid, setPostuid] = useState([]);
  const [allPostuid, setAllPostuid] = useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  useEffect(() => {
    const fetchData = () => {
      const currentuser = firebase.auth().currentUser;
      db.collection("users")
        .doc(currentuser.uid)
        .get()
        .then((doc) => {
          //success
          if (doc.exists) {
            let usersDoc = doc.data();
            setState({
              firstName: usersDoc.first_name,
              lastName: usersDoc.last_name,
              NumberOfFriends: usersDoc.friends_number,
              useruid: currentuser.uid,
              profileURL: usersDoc.profile_url
            });
            fetchPosts(currentuser.uid);
          } else {
            //
          }
        })
        .catch((err) => {
          //error
        });
    };
    const fetchPosts = (useruid) => {
      db.collection("users")
        .doc(useruid)
        .collection("post")
        .orderBy("posted_date", "desc")
        .onSnapshot((doc) => {
          let postlist = [];
          let postuidlist = [];
          doc.forEach((p) => {
            postlist.push(p.data());
            postuidlist.push(p.id);
          });
          setPost(postlist);
          setPostuid(postuidlist);
        });
    };
    const fetchAllUsers = () => {
      db.collection("allpost")
        .orderBy("posted_date", "desc")
        .onSnapshot((doc) => {
          let allpostlist = [];
          let allpostuidlist = [];
          doc.forEach((p) => {
            allpostlist.push(p.data());
            allpostuidlist.push(p.id);
          });
          setAllPost(allpostlist);
          setAllPostuid(allpostuidlist);
        });
    };
    fetchAllUsers();
    fetchData();
  }, []);

  const handleUnFavorite = (i) => {
    console.log("unlike");
    const batch = db.batch();
    let editRef = db.collection("allpost").doc(allPostuid[i].toString());
    batch.update(editRef, {
      likes: firebase.firestore.FieldValue.increment(-1),
      isLiked: false,
      like_by: firebase.firestore.FieldValue.arrayRemove(state.useruid)
    });
    batch
      .commit()
      .then(() => {})
      .catch((error) => {
        //err
      });
  };

  const handleMakeFavorite = (i) => {
    console.log("like");
    const batch = db.batch();
    let editRef = db.collection("allpost").doc(allPostuid[i].toString());
    batch.update(editRef, {
      likes: firebase.firestore.FieldValue.increment(1),
      isLiked: true,
      like_by: firebase.firestore.FieldValue.arrayUnion(state.useruid)
    });
    batch
      .commit()
      .then(() => {})
      .catch((error) => {
        //err
      });
  };
  const isDelete = (i) => {
    db.collection("users")
      .doc(state.useruid)
      .collection("post")
      .doc(postuid[i].toString())
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        handleClose();
      })
      .catch((error) => {
        console.log("Error removing document: ", error);
      });
  };
  const isEdit = (i) => {
    setState({ ...state, puid: postuid[i] });
    setOpenCreatePost(true);
  };

  return (
    <div>
      <Nav
        useruid={state.useruid}
        lastname={state.lastName}
        firstname={state.firstName}
      />
      <div className={classes.root}>
        <Grid container spacing={2} className={classes.container}>
          <Grid item xs={4} className={classes.firstgrid}>
            <Card className={classes.friendsList} elevation={10}>
              <CardHeader
                avatar={<Avatar src={state.profileURL} />}
                title={state.firstName + " " + state.lastName}
                subheader={"Status: Active now"}
              />
            </Card>
          </Grid>
          <Grid item xs={bp ? 12 : 8}>
            {allpost.map((p, index) => (
              <Card className={classes.card}>
                <CardHeader
                  avatar={<Avatar src={p.profile_url} />}
                  action={
                    <PopupState variant="popper" popupId="demo-popup-popper">
                      {(popupState) => (
                        <div>
                          <IconButton
                            aria-label="settings"
                            {...bindToggle(popupState)}
                          >
                            <MoreHoriIcon />
                          </IconButton>

                          <Popper {...bindPopper(popupState)} transition>
                            {({ TransitionProps }) => (
                              <Fade {...TransitionProps} timeout={350}>
                                <Paper>
                                  <Card>
                                    <ButtonGroup orientation="vertical">
                                      <Button
                                        className={classes.buttons}
                                        onClick={() => isEdit(index)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        className={classes.buttons}
                                        onClick={handleClickOpenDialog}
                                      >
                                        Delete
                                      </Button>
                                      <Dialog
                                        open={openDialog}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                      >
                                        <DialogTitle id="alert-dialog-title">
                                          {
                                            "Are you sure you want to delete this item ?"
                                          }
                                        </DialogTitle>
                                        <DialogContent>
                                          <DialogContentText id="alert-dialog-description">
                                            This item will be deleted
                                            immediately. You can't undo this
                                            action
                                          </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                          <Button
                                            onClick={handleClose}
                                            color="primary"
                                          >
                                            Disagree
                                          </Button>
                                          <Button
                                            onClick={() => isDelete(index)}
                                            color="primary"
                                            autoFocus
                                          >
                                            Agree
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    </ButtonGroup>
                                  </Card>
                                </Paper>
                              </Fade>
                            )}
                          </Popper>
                        </div>
                      )}
                    </PopupState>
                  }
                  title={p.first_name + " " + p.last_name}
                  subheader={moment(p.posted_date.toDate().toString())
                    .startOf("hour")
                    .fromNow()}
                />

                <CardMedia
                  square
                  className={classes.media}
                  image={p.image_url}
                />
                <CardActions>
                  {p.isLiked ? (
                    <IconButton
                      key={index}
                      edge="end"
                      onClick={() => handleUnFavorite(index)}
                    >
                      <FavoriteIcon style={{ color: "#d42020" }} />
                    </IconButton>
                  ) : (
                    <IconButton
                      key={index}
                      edge="end"
                      onClick={() => handleMakeFavorite(index)}
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                  )}
                </CardActions>
                <CardContent>
                  <Typography variant="body2" color="textPrimary" component="p">
                    {p.likes} likes
                  </Typography>
                  <Typography variant="body2" color="textPrimary" component="p">
                    {p.caption}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </div>
      <EditPost
        useruid={state.useruid}
        open={openCreatePost}
        setOpen={setOpenCreatePost}
        puid={state.puid}
      />
    </div>
  );
}

export default Home;
