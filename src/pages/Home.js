import React, { useState, useEffect } from "react";
import Nav from "../component/Nav";
import firebase from "../utils/firebase";
import moment from "moment";
import theme from "../utils/theme";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";
import Comment from "../modals/Comment";
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
  DialogActions,
  Badge
} from "@material-ui/core";
import MoreHoriIcon from "@material-ui/icons/MoreHoriz";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import ModeComment from "@material-ui/icons/ModeCommentOutlined";

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
  },
  comment: {
    height: 50,
    width: "100%",
    borderTop: "1px solid gray",
    padding: 5,
    display: "flex",
    alignItems: "center"
  },
  commentInput: {
    marginLeft: 5,
    width: "100%",
    height: "100%",
    outline: "none",
    border: "none"
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
    NumberOfFriends: 0

    //
  });
  const [statep, setStatep] = useState({
    firstname: "",
    lastname: "",
    postimage: "",
    nolikes: 0,
    dateposted: "",
    caption: "",
    profilepic: "",
    postuid: "f"
  });

  const [allpost, setAllPost] = useState([]);

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
        .onSnapshot((doc) => {
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
          } else {
            //
          }
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
  const isDelete = (i, postedby) => {
    if (state.useruid !== postedby) {
      console.log("this is not your post");
    } else {
      db.collection("allpost")
        .doc(allPostuid[i].toString())
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          handleClose();
        })
        .catch((error) => {
          console.log("Error removing document: ", error);
        });
    }
  };
  const AddComment = (i) => {
    db.collection("allpost")
      .doc(allPostuid[i].toString())
      .onSnapshot((doc) => {
        //success
        if (doc.exists) {
          let usersDoc = doc.data();
          setStatep({
            firstname: usersDoc.first_name,
            lastname: usersDoc.last_name,
            postimage: usersDoc.image_url,
            nolikes: usersDoc.like_by.length,
            dateposted: moment(
              usersDoc.posted_date.toDate().toString()
            ).calendar(),
            caption: usersDoc.caption,
            profilepic: usersDoc.profile_pic,
            postuid: allPostuid[i]
          });
        } else {
          //
        }
      });
    setOpenCreatePost(true);
  };
  return (
    <div>
      <Nav
        useruid={state.useruid}
        lastname={state.lastName}
        firstname={state.firstName}
        profilepic={state.profileURL}
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
                  avatar={<Avatar src={p.profile_pic} />}
                  action={
                    <PopupState variant="popper" popupId="demo-popup-popper">
                      {(popupState) => (
                        <div>
                          {state.useruid === p.posted_by ? (
                            <IconButton
                              aria-label="settings"
                              {...bindToggle(popupState)}
                            >
                              <MoreHoriIcon />
                            </IconButton>
                          ) : (
                            ""
                          )}

                          <Popper {...bindPopper(popupState)} transition>
                            {({ TransitionProps }) => (
                              <Fade {...TransitionProps} timeout={350}>
                                <Paper>
                                  <Card>
                                    <ButtonGroup orientation="vertical">
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
                                            onClick={() =>
                                              isDelete(index, p.posted_by)
                                            }
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
                  subheader={moment(
                    p.posted_date.toDate().toString()
                  ).calendar()}
                />

                <CardMedia className={classes.media} image={p.image_url} />
                <CardActions>
                  {p.isLiked ? (
                    <IconButton
                      edge="end"
                      onClick={() => handleUnFavorite(index)}
                    >
                      <FavoriteIcon style={{ color: "#d42020" }} />
                    </IconButton>
                  ) : (
                    <IconButton
                      edge="end"
                      onClick={() => handleMakeFavorite(index)}
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                  )}
                  <IconButton edge="end" onClick={() => AddComment(index)}>
                    <Badge color="secondary" badgeContent={p.comment_no}>
                      <ModeComment />
                    </Badge>
                  </IconButton>
                </CardActions>
                <CardContent>
                  <Typography variant="body2" color="textPrimary" component="p">
                    {p.like_by.length} likes{" "}
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
      <Comment
        useruid={state.useruid}
        open={openCreatePost}
        setOpen={setOpenCreatePost}
        lastname={statep.lastname}
        firstname={statep.firstname}
        postimage={statep.postimage}
        dateposted={statep.dateposted}
        caption={statep.caption}
        nolikes={statep.nolikes}
        profilepic={statep.profilepic}
        postuid={statep.postuid}
        UserFirstname={state.firstName}
        UserLastname={state.lastName}
        UserProfile={state.profileURL}
      />
    </div>
  );
}

export default Home;
