import Nav from "../component/Nav";
import React, { useEffect } from "react";
import theme from "../utils/theme";
import {
  makeStyles,
  Paper,
  Grid,
  Card,
  CardHeader,
  Avatar,
  CardMedia,
  CardContent,
  Typography,
  Box,
  useMediaQuery
} from "@material-ui/core";
import firebase from "../utils/firebase";
import logo from "../image/Myprofile.jpg";
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    paddingTop: 55
  },
  paper: {
    maxWidth: 1000,
    margin: "auto",
    padding: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      padding: 0
    }
  },
  post: {
    [theme.breakpoints.down("xs")]: {
      margin: 0,
      borderBottom: "1px solid grey"
    }
  },
  friends: {
    height: 550,
    width: 300,
    position: "fixed",
    [theme.breakpoints.down("sm")]: {
      height: 400,
      width: 200
    },
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  media: {
    height: 0,
    paddingTop: "100%" // 16:9
  },
  caption: {
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column"
    }
  }
}));
const db = firebase.firestore();
function Home() {
  const classes = useStyles();
  const bp = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    const fetchData = () => {
      const currentUser = firebase.auth().currentUser;
    };
  }, []);

  return (
    <div className={classes.root}>
      <Nav />
      <Paper className={classes.paper} elevation={0}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card className={classes.friends}>
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe" className={classes.avatar}>
                    J
                  </Avatar>
                }
                title="Jerome Hipolito"
              />
            </Card>
          </Grid>
          <Grid item xs={bp ? 12 : 8}>
            <Card className={classes.post} elevation={bp ? 0 : 2}>
              <CardHeader
                avatar={<Avatar className={classes.avatar}>J</Avatar>}
                title="Jerome Hipolito"
                subheader="June 15, 2021"
              />
              <CardMedia
                className={classes.media}
                image={logo}
                title="Paella dish"
              />
              <CardContent>
                <Typography gutterBottom variant="body2">
                  <Box fontWeight={600}>999999 likes</Box>
                </Typography>
                <Typography
                  variant="body2"
                  color="textPrimary"
                  component="p"
                  className={classes.caption}
                >
                  <Box fontWeight={600} m={0.3}>
                    Jerome Hipolito
                  </Box>
                  <Box m={0.3}>Napaka gwapo ko naman</Box>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Home;
