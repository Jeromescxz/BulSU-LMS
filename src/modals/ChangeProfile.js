import React, { useState, useEffect } from "react";

import {
  makeStyles,
  Fade,
  Modal,
  Backdrop,
  Typography,
  Box,
  Button,
  TextField
} from "@material-ui/core";
import firebase from "../utils/firebase";

//icons
import Image from "@material-ui/icons/Image";

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
    flexDirection: "column"
  },
  caption: {
    width: 500,
    [theme.breakpoints.down("xs")]: {
      width: 200
    }
  },
  fileInput: {
    display: "none"
  },
  label: {
    margin: theme.spacing(1)
  },
  uploadtext: {
    display: "flex"
  }
}));
const db = firebase.firestore();

export default function ChangeProfile({ open, setOpen, useruid }) {
  const classes = useStyles();
  const [state, setState] = useState({
    caption: ""
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

  useEffect(() => {
    const fetchData = () => {
      db.collection("users")
        .doc(useruid)
        .get()
        .then((doc) => {
          //success
          if (doc.exists) {
            let usersDoc = doc.data();
            setState({
              firstName: usersDoc.first_name,
              lastName: usersDoc.last_name
            });
          } else {
            //
          }
        })
        .catch((err) => {
          //error
        });
    };
    fetchData();
  }, []);

  const posted = (e) => {
    e.preventDefault();
    if (imageURL === "") {
      alert("add image");
    } else {
      const batch = db.batch();
      const postRef = db
        .collection("users")
        .doc(useruid)
        .collection("post")
        .doc();
      batch.set(postRef, {
        caption: state.caption,
        image_url: imageURL,
        posted_date: new Date()
      });

      let postNumberRef = db.collection("users").doc(useruid);
      batch.update(postNumberRef, {
        post_number: firebase.firestore.FieldValue.increment(1)
      });

      batch
        .commit()
        .then(() => {
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
              <Box>Edit Profile</Box>
            </Typography>
            <TextField
              className={classes.label}
              label="First name"
              variant="outlined"
              defaultValue={state.firstName}
            />
            <TextField
              className={classes.label}
              label="Last name"
              variant="outlined"
              defaultValue={state.lastName}
            />
            <Box>
              <Typography className={classes.uploadtext} variant="body1">
                <Box>Upload a photo</Box>
              </Typography>
              <Button component="label">
                <Image color="inherit" />
                <input
                  type="file"
                  onChange={onFileChange}
                  accept="image/*"
                  required
                />
              </Button>
            </Box>
            <Button onClick={posted} color="primary" variant="contained">
              Confirm
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
