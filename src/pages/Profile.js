import React, { useState, useEffect } from "react";
import Nav from "../component/Nav";
import theme from "../utils/theme";
import logo from "../image/Myprofile.jpg";
import moment from "moment";
import firebase from "../utils/firebase";
import {
  makeStyles,
  useMediaQuery,
  Card,
  CardMedia,
  Avatar,
  Box,
  Typography,
  Divider,
  Paper,
  Grid
} from "@material-ui/core";
//icons
import ImageOutlined from "@material-ui/icons/ImageOutlined";
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    paddingTop: 70
  },
  profilePicture: {
    width: 150,
    height: 150
  },
  card: { padding: theme.spacing(2) },
  Profile: {
    display: "flex",
    flexDirection: "row",
    textAlign: "center"
  },
  name: { marginBottom: theme.spacing(2) },
  details: {
    marginLeft: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  fandp: {
    display: "flex",
    flexDirection: "row"
  },
  textPost: {
    marginLeft: 40,

    textAlign: "center"
  },
  textFriends: {
    textAlign: "center"
  },
  media: {
    height: 0,
    paddingTop: "100%" // 16:9
  },
  post: {
    height: 200,
    width: 200,
    [theme.breakpoints.down("xs")]: {
      height: 135,
      width: 135
    }
  },

  postlogo: {
    marginTop: theme.spacing(2)
  },
  paper: {
    maxWidth: 1000,
    margin: "auto",
    padding: theme.spacing(2),
    alignItems: "center"
  },
  textPostIcon: {
    textAlign: "center",
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      marginBottom: theme.spacing(1)
    }
  }
}));
const db = firebase.firestore();
function Profile() {
  const classes = useStyles();
  const bp = useMediaQuery(theme.breakpoints.down("xs"));
  const [state, setState] = useState({
    useruid: "",
    firstName: "",
    lastName: "",
    profileURL: "",
    imageURL: "",
    numberOfFriends: 0,
    numberOfPost: 0
  });
  const [post, setPost] = useState([]);
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
              numberOfFriends: usersDoc.friends_number,
              useruid: currentuser.uid,
              profileURL: usersDoc.profile_url,
              numberOfPost: usersDoc.post_number
            });
            fetchPosts(currentuser.uid);
          } else {
            //
          }
        });
    };
    const fetchPosts = (useruid) => {
      db.collection("users")
        .doc(useruid)
        .collection("post")
        .orderBy("posted_date", "desc")
        .onSnapshot((doc) => {
          let postlist = [];
          doc.forEach((p) => {
            postlist.push(p.data());
          });
          setPost(postlist);
        });
    };
    fetchData();
  }, []);
  return (
    <div className={classes.root}>
      <Nav useruid={state.useruid} />
      <Card className={classes.card} elevation={0}>
        <Box className={classes.Profile}>
          <Avatar
            alt="Profile pic"
            src={state.profileURL}
            className={classes.profilePicture}
          />
          <Box className={classes.details}>
            <Typography variant="h4" className={classes.name}>
              <Box>{state.firstName + " " + state.lastName}</Box>
            </Typography>
            <Box className={classes.fandp}>
              <Typography variant="body1" className={classes.textFriends}>
                <Box>Friends</Box>
                <Box fontWeight={600} className="numberOfFriends">
                  0
                </Box>
              </Typography>
              <Typography variant="body1" className={classes.textPost}>
                <Box>Post</Box>
                <Box fontWeight={600}>{state.numberOfPost}</Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
      <Divider />
      <Paper className={classes.paper} elevation={0}>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.textPostIcon}
        >
          <Box>
            <ImageOutlined />
            <Box>Post</Box>
          </Box>
        </Typography>
        <Grid container spacing={bp ? 2 : 4} justify="center">
          {post.map((p) => (
            <Grid item xs={1.5}>
              <Card className={classes.post}>
                <CardMedia className={classes.media} image={p.image_url} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
}

export default Profile;
