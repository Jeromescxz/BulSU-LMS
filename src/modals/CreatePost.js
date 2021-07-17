import React, { useState } from "react";

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
import Image from "@material-ui/icons/PhotoCamera";

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
    borderRadius: 10,
    width: 400,
    [theme.breakpoints.down("xs")]: {
      width: 250
    }
  },
  caption: {
    width: 400,
    [theme.breakpoints.down("xs")]: {
      width: 200
    }
  },
  fileInput: {
    display: "none"
  },
  fileinput: {
    marginBottom: 10
  }
}));
const db = firebase.firestore();

export default function CreatePost({
  open,
  setOpen,
  useruid,
  firstname,
  lastname,
  profilepic
}) {
  const classes = useStyles();

  const [state, setState] = useState({
    caption: " "
  });
  const [imageURL, setImageURL] = useState("");

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    var storageRef = firebase.storage().ref();
    var fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setImageURL(await fileRef.getDownloadURL());
  };

  const handleClose = () => {
    setOpen(false);
  };

  const posted = (e) => {
    e.preventDefault();
    if (imageURL === "") {
      alert("add image");
    } else {
      const batch = db.batch();
      const allpostRef = db.collection("allpost").doc();
      batch.set(allpostRef, {
        first_name: firstname,
        last_name: lastname,
        caption: state.caption,
        image_url: imageURL,
        posted_date: new Date(),
        like_by: [],
        posted_by: useruid,
        profile_pic: profilepic,
        comment_no: 0
      });

      let postNumberRef = db.collection("users").doc(useruid);
      batch.update(postNumberRef, {
        post_number: firebase.firestore.FieldValue.increment(1)
      });

      batch
        .commit()
        .then(() => {
          setState({ caption: " " });
          setImageURL("");
          handleClose();
        })
        .catch((error) => {
          //err
        });
    }
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
            <Typography variant="h5">
              <Box>Create Post</Box>
            </Typography>

            <InputBase
              className={classes.caption}
              onChange={handleChange("caption")}
              placeholder="Write some thing here"
              rows={5}
              multiline
            />
            <Button
              component="label"
              variant="outlined"
              className={classes.fileinput}
            >
              <Image color="primary" />
              <input
                type="file"
                onChange={onFileChange}
                onClick={(event) => {
                  event.target.value = null;
                }}
                accept="image/*"
                required
              />
            </Button>

            <Button onClick={posted} color="primary" variant="contained">
              Post
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
