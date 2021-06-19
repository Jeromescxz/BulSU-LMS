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
  }
}));

export default function CreatePost({ open, setOpen }) {
  const classes = useStyles();
  const [post, setPost] = useState({
    caption: "",
    image: ""
  });
  const handleChange = (prop) => (event) => {
    setPost({ ...post, [prop]: event.target.value });
    console.log(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
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
              <Box>Create a post</Box>
            </Typography>
            <InputBase
              className={classes.caption}
              onChange={handleChange("caption")}
              id="filled-textarea"
              placeholder="Write a post"
              rows={5}
              multiline
            />
            <Button component="label">
              <Image color="inherit" />
              <input
                type="file"
                onChange={handleChange("image")}
                accept="image/*"
                hidden
              />
            </Button>
            <Button color="primary" variant="contained">
              Post
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
