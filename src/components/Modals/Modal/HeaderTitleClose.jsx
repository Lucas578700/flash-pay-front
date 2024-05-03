/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";

import { MuiDialogPaper, DialogCenter } from "./styles";


function CloseIconButton(propsButton) {
  return (
    <IconButton {...propsButton}>
      <CloseIcon />
    </IconButton>
  );
}

function FullScreenExitIconButton(propsButton) {
  return (
    <IconButton {...propsButton}>
      <FullscreenExitIcon />
    </IconButton>
  );
}

function FullScreenIconButton(propsButton) {
  return (
    <IconButton {...propsButton}>
      <FullscreenOutlinedIcon />
    </IconButton>
  );
}

function HeaderTitleClose({
  id,
  title,
  subTitle,
  titleClass,
  onClose,
  escape = true,
  fullScreenButton,
  fullScreen = false,
  onChangeFullScreen,
  draggable = true,
  headerStyle,
  color,
}) {
  const fullScreenIconButton = useMemo(() => {
    if (fullScreenButton) {
      let CustomButton = FullScreenIconButton;
      if (fullScreen) {
        CustomButton = FullScreenExitIconButton;
      }
      return (
        <CustomButton
          size="small"
          style={{ marginTop: 5, marginBottom: 5 }}
          marginHorizontal
          marginVertical
          onClick={onChangeFullScreen}
        />
      );
    }
    return null;
  }, [fullScreenButton, fullScreen, onChangeFullScreen]);

  return (
    <DialogCenter
      id={`header-${id}`}
      style={{
        cursor: draggable ? "move" : "inherit",
        display: "inline-flex",
        flex: "0 0 auto",
      }}
      className={[headerStyle].join(" ")}>
      <MuiDialogPaper
        style={{
          flex: "auto !important",
          paddingBottom: "10px",
          minWidth: "150px",
        }}
        color={color}
        className={[titleClass].join(" ")}>
        <Typography
          variant="h6"
          component="div"
          style={{ flexGrow: 1, padding: 12 }}
          color={color}>
          {title}
        </Typography>
        {subTitle && <Typography variant="body2">{subTitle}</Typography>}
      </MuiDialogPaper>
      <div
        style={{
          position: "absolute",
          width: "98%",
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 10,
        }}>
        {fullScreenIconButton}
        {escape && (
          <CloseIconButton
            size="small"
            style={{ margin: 5 }}
            marginHorizontal
            marginVertical
            onClick={(event) => onClose(event)}
          />
        )}
      </div>
    </DialogCenter>
  );
}

export default HeaderTitleClose;
