import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function SimpleBackdrop({ open }) {
  return (
    <div>
      <Backdrop
        sx={{
          color: theme => theme.palette.primary.main,
          zIndex: theme => theme.zIndex.drawer + 10,
        }}
        open={open}>
        <CircularProgress color="inherit" size="10rem" />
      </Backdrop>
    </div>
  );
}

export default SimpleBackdrop;
