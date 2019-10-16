import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  },
  progress: {
    margin: theme.spacing(2)
  },
  judgeVideo: {
    display: "none"
  }
}));

export default function JudgePage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          <div id="console">I am comming...</div>
        </Typography>
      </Paper>
      <div id="progress">
        <CircularProgress className={classes.progress} />
      </div>
      <div className={classes.judgeVideo} id="video">
        <video
          autoPlay
          playsInline
          muted
          id="webcam"
          width="100%"
          height="100%"
        ></video>
      </div>
    </div>
  );
}

window.onload = function() {
  const webcamElement = document.getElementById("webcam");
  let net;

  async function app() {
    console.log("Loading mobilenet..");

    // Load the model.
    net = await mobilenet.load();
    console.log("Successfully loaded model");

    await setupWebcam();
    hideProgress();
    showVideo();
    while (true) {
      const result = await net.classify(webcamElement);

      document.getElementById("console").innerText = `This is ${
        result[0].className.split(",")[0]
      }`;

      // Give some breathing room by waiting for the next animation frame to
      // fire.
      await tf.nextFrame();
    }
  }
  async function setupWebcam() {
    return new Promise((resolve, reject) => {
      const navigatorAny = navigator;
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia ||
        navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          { video: true },
          stream => {
            webcamElement.srcObject = stream;
            webcamElement.addEventListener(
              "loadeddata",
              () => resolve(),
              false
            );
          },
          error => reject()
        );
      } else {
        reject();
      }
    });
  }
  const hideProgress = () => {
    let progress = document.getElementById("progress");
    progress.style.display = "none";
    console.log("aaa");
  };
  const showVideo = () => {
    let video = document.getElementById("video");
    video.style.display = "block";
    console.log("aaa");
  };
  app();
};
