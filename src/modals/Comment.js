import React, { useState, useEffect } from "react";
import moment from "moment";
import theme from "../utils/theme";
import {
  makeStyles,
  Fade,
  Modal,
  Backdrop,
  Button,
  Grid,
  CardMedia,
  CardHeader,
  Avatar,
  Divider,
  useMediaQuery
} from "@material-ui/core";
import firebase from "../utils/firebase";

//icons

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: 10,
    width: 800,

    [theme.breakpoints.down("xs")]: {
      width: 300
    }
  },
  media: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height: 0,
    paddingTop: "100%" // 16:9
  },
  comments: {
    height: 260,

    overflow: "auto"
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
  },
  picture: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  }
}));
const db = firebase.firestore();

export default function Comment({
  open,
  setOpen,
  useruid,
  firstname,
  lastname,
  postimage,
  dateposted,
  profilepic,
  caption,
  postuid,
  UserFirstname,
  UserLastname,
  UserProfile
}) {
  const classes = useStyles();
  const [allcomment, setComment] = useState([]);
  const [state, setState] = useState({
    comment: null
  });
  const bp = useMediaQuery(theme.breakpoints.down("xs"));
  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetchAllComment = () => {
      db.collection("allpost")
        .doc(postuid)
        .collection("comment")
        .orderBy("commented_date", "desc")
        .onSnapshot((doc) => {
          let commentlist = [];
          doc.forEach((p) => {
            commentlist.push(p.data());
          });
          setComment(commentlist);
        });
    };

    fetchAllComment();
  }, [postuid]);

  const AddComment = () => {
    const batch = db.batch();
    const commentRef = db
      .collection("allpost")
      .doc(postuid)
      .collection("comment")
      .doc();
    batch.set(commentRef, {
      first_name: UserFirstname,
      last_name: UserLastname,
      comment: state.comment,
      commented_date: new Date(),
      posted_by: useruid,
      profile_pic: UserProfile
    });

    const commentNo = db.collection("allpost").doc(postuid);
    batch.update(commentNo, {
      comment_no: firebase.firestore.FieldValue.increment(1)
    });

    batch
      .commit()
      .then(() => {
        setState({ comment: "" });
      })
      .catch((error) => {
        //err
      });
  };

  return (
    <div>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Grid container className={classes.grid}>
              <Grid item xs={6} className={classes.picture}>
                <CardMedia className={classes.media} image={postimage} />
              </Grid>
              <Grid item xs={bp ? 12 : 6}>
                <CardHeader
                  avatar={<Avatar src={profilepic} />}
                  title={firstname + " " + lastname + " - " + caption}
                  subheader={dateposted}
                />
                <Divider />

                <div className={classes.comments}>
                  {allcomment.map((p) => (
                    <CardHeader
                      avatar={<Avatar src={p.profile_pic} />}
                      title={
                        p.first_name + " " + p.last_name + " - " + p.comment
                      }
                      subheader={moment(
                        p.commented_date.toDate().toString()
                      ).calendar()}
                    />
                  ))}
                </div>

                <div className={classes.comment}>
                  <input
                    placeholder="Add a comment..."
                    className={classes.commentInput}
                    value={state.comment}
                    onChange={handleChange("comment")}
                  ></input>
                  <Button
                    className={classes.buttons}
                    onClick={() => AddComment()}
                    color="primary"
                  >
                    Post
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
