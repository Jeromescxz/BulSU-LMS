import Nav from "../component/Nav";
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
import logo from "../image/Myprofile.jpg";
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0
  },
  paper: {
    marginTop: 70,
    maxWidth: 1000,
    margin: "auto",
    padding: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      padding: 0
    }
  },
  post: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      height: "100%",
      margin: 0
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

function Home() {
  const classes = useStyles();
  const bp = useMediaQuery(theme.breakpoints.down("xs"));
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
            <Card className={classes.post}>
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe" className={classes.avatar}>
                    J
                  </Avatar>
                }
                title="Jerome Hipolito"
                subheader="June 15, 2021"
              />
              <CardMedia
                className={classes.media}
                image={logo}
                title="Paella dish"
              />
              <CardContent>
                <Typography gutterBottom variant="body1">
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
