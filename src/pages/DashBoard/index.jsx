/* eslint-disable react/self-closing-comp */
/* eslint-disable camelcase */
import { Grid } from "@mui/material";

import "./index.css";

function DashBoard() {
  return (
    <div>
      <div className="agendamento-sala-titulo-principal">
        <h1>Dash Board</h1>
      </div>
      <div className="div-agendamento-pai-das-caixinhas">
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"></Grid>
      </div>
    </div>
  );
}

export default DashBoard;
