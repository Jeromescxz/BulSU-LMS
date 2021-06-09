import Nav from "../component/Nav";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({ root: { margin: 0 } }));

function Home() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Nav />
      <div></div>
    </div>
  );
}

export default Home;
