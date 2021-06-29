import React, { useState, useEffect } from "react";
import Nav from "../component/Nav";
import firebase from "../utils/firebase";
import moment from "moment";
import theme from "../utils/theme";
import {
  Grid,
  makeStyles,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
  CardHeader,
  Avatar,
  useMediaQuery
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FavoriteIcon from "@material-ui/icons/Favorite";
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
  }
}));

const db = firebase.firestore();
function Home() {
  const classes = useStyles();
  const bp = useMediaQuery(theme.breakpoints.down("xs"));
  const [state, setState] = useState({
    useruid: "",
    firstName: "",
    lastName: "",
    profileURL: "",
    imageURL: "",
    NumberOfFriends: 0
  });
  const [post, setPost] = useState([]);
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
          doc.forEach((p) => {
            postlist.push(p.data());
          });
          setPost(postlist);
        });
    };
    fetchData();
  }, []);
  return (
    <div>
      <Nav useruid={state.useruid} />
      <div className={classes.root}>
        <Grid container spacing={2} className={classes.container}>
          <Grid item xs={4} className={classes.firstgrid}>
            <Card className={classes.friendsList} elevation={10}>
              <CardHeader
                avatar={<Avatar src={state.profileURL} />}
                title={state.firstName + " " + state.lastName}
                subheader={"friends: " + state.NumberOfFriends}
              />
            </Card>
          </Grid>
          <Grid item xs={bp ? 12 : 8}>
            {post.map((p) => (
              <Card className={classes.card}>
                <CardHeader
                  avatar={<Avatar src={state.profileURL} />}
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={state.firstName + " " + state.lastName}
                  subheader={moment(
                    p.posted_date.toDate().toString()
                  ).calendar()}
                />
                <CardMedia
                  square
                  className={classes.media}
                  image={p.image_url}
                />
                <CardActions>
                  <IconButton>
                    <FavoriteIcon />
                  </IconButton>
                </CardActions>
                <CardContent>
                  <Typography variant="body2" color="textPrimary" component="p">
                    0 likes
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
    </div>
  );
}

export default Home;
