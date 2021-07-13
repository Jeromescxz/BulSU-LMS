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

export default function ChangeProfile({ useruid, open, setOpen }) {
  const classes = useStyles();
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    useruid: "",
    changeFirstName: "",
    changeLastName: "",
    changeBio: ""
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
    const currentuser = firebase.auth().currentUser;
    const fetchData = () => {
      db.collection("users")
        .doc(currentuser.uid)
        .onSnapshot((doc) => {
          //success
          if (doc.exists) {
            let usersDoc = doc.data();
            setState({
              firstName: usersDoc.first_name,
              lastName: usersDoc.last_name,
              useruid: currentuser.uid,
              bio: usersDoc.bio,
              changeFirstName: usersDoc.first_name,
              changeLastName: usersDoc.last_name,
              changeBio: usersDoc.bio
            });
            setImageURL(usersDoc.profile_url);
          } else {
            //
          }
        });
    };
    fetchData();
  }, []);

  const edited = (e) => {
    e.preventDefault();
    const batch = db.batch();

    let EditRef = db.collection("users").doc(state.useruid);
    batch.update(EditRef, {
      profile_url: imageURL,
      first_name: state.changeFirstName,
      last_name: state.changeLastName,
      bio: state.changeBio
    });

    let EditAllUserRef = db.collection("allpost").doc();
    batch.update(EditAllUserRef, {
      profile_url: imageURL
    });

    batch
      .commit()
      .then(() => {
        handleClose();
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
            <Typography variant="h5">
              <Box>Edit Profile</Box>
            </Typography>
            <TextField
              className={classes.label}
              label="First name"
              variant="outlined"
              defaultValue={state.firstName}
              onChange={handleChange("changeFirstName")}
            />
            <TextField
              className={classes.label}
              label="Last name"
              variant="outlined"
              defaultValue={state.lastName}
              onChange={handleChange("changeLastName")}
            />
            <TextField
              label="Bio"
              multiline
              rows={4}
              defaultValue={state.bio}
              onChange={handleChange("changeBio")}
              variant="outlined"
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
            <Button onClick={edited} color="primary" variant="contained">
              Confirm
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
