import React, { useState, useEffect } from "react";

import {
  makeStyles,
  Fade,
  Modal,
  Backdrop,
  Typography,
  Box,
  InputBase,
  Button
} from "@material-ui/core";
import firebase from "../utils/firebase";

//icons

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: "flex",
    flexDirection: "column",
    width: 500,
    [theme.breakpoints.down("xs")]: {
      width: 250
    }
  },
  caption: {
    width: 400,
    [theme.breakpoints.down("xs")]: {
      width: 200
    }
  }
}));
const db = firebase.firestore();

export default function EditPost({ open, setOpen, useruid, puid }) {
  const classes = useStyles();

  const [state, setState] = useState({
    caption: "",
    imageUrl: ""
  });

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const confirm = (e) => {
    e.preventDefault();
  };
  console.log(puid);

  useEffect(() => {
    const fetchData = () => {
      const currentuser = firebase.auth().currentUser;
      db.collection("users")
        .doc(currentuser.uid)
        .collection("post")
        .doc(puid.toString())
        .onSnapshot((doc) => {
          //success
          if (doc.exists) {
            let usersDoc = doc.data();
            setState({
              caption: usersDoc.caption,
              imageUrl: usersDoc.image_url
            });
          } else {
            //
          }
        });
    };
    fetchData();
  }, []);

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
            <Typography variant="h5">
              <Box>Create a post</Box>
            </Typography>

            <InputBase
              className={classes.caption}
              onChange={handleChange("caption")}
              placeholder="Write a post"
              rows={5}
              multiline
            />

            <Button onClick={confirm} color="primary" variant="contained">
              Post
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
