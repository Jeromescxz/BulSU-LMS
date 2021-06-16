import Nav from "../component/Nav";
import theme from "../utils/theme";
import logo from "../image/Myprofile.jpg";
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
  postList: {
    flexDirection: "row"
  },
  postlogo: {
    marginTop: theme.spacing(2)
  },
  paper: {
    maxWidth: 1000,
    margin: "auto",
    padding: theme.spacing(2)
  },
  textPostIcon: {
    textAlign: "center",
    marginBottom: theme.spacing(1)
  }
}));

function Home() {
  const classes = useStyles();
  const bp = useMediaQuery(theme.breakpoints.down("xs"));
  return (
    <div className={classes.root}>
      <Nav />
      <Card className={classes.card} elevation={0}>
        <Box className={classes.Profile}>
          <Avatar
            alt="Profile pic"
            src={logo}
            className={classes.profilePicture}
          />
          <Box className={classes.details}>
            <Typography variant="h4" className={classes.name}>
              <Box>Jerome Hipolito</Box>
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
                <Box fontWeight={600}>2</Box>
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
        <Grid container spacing={2}>
          <Grid item xs={1.5}>
            <Card className={classes.post}>
              <CardMedia className={classes.media} image={logo} />
            </Card>
          </Grid>
          <Grid item xs={1.5}>
            <Card className={classes.post}>
              <CardMedia className={classes.media} image={logo} />
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Home;
