import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import Fab from "@material-ui/core/Fab";
import StopIcon from "@material-ui/icons/Stop";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import firebase from "firebase";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  },
  progress: {
    margin: theme.spacing(2)
  },
  judgeVideo: {
    display: "none",
    padding: "10px"
  },
  fab1: {
    position: "absolute",
    color: "red",
    bottom: theme.spacing(2),
    right: "42vw",
    display: "none"
  },
  fab2: {
    position: "absolute",
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    display: "none"
  },
  fab3: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    display: "none"
  },
  canvas: {
    display: "none"
  }
}));

export default function JudgePage() {
  const classes = useStyles();

  useEffect(() => {
    document.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault();
      },
      { passive: false }
    );
    const webcamElement = document.getElementById("webcam");
    let net;

    async function app() {
      try {
        // Load the model.
        net = await mobilenet.load();
        await setupWebcam();
        hideProgress();
        showVideo();
        showStopButton();

        while (true) {
          const result = await net.classify(webcamElement);

          document.getElementById("console").innerText = `This is ${
            result[0].className.split(",")[0]
          }`;

          // Give some breathing room by waiting for the next animation frame to
          // fire.
          await tf.nextFrame();
        }
      } catch (e) {
        alert(e.message);
      }
    }
    async function setupWebcam() {
      return new Promise((resolve, reject) => {
        const medias = {
          audio: false,
          video: {
            facingMode: "environment"
          }
        };
        const promise = navigator.mediaDevices.getUserMedia(medias);
        promise.then(successCallback).catch(errorCallback);
        function successCallback(stream) {
          webcamElement.srcObject = stream;
          webcamElement.oncanplay = function() {
            resolve();
          };
        }
        function errorCallback(err) {
          alert(err);
        }
      });
    }
    const hideProgress = () => {
      let progress = document.getElementById("progress");
      progress.style.display = "none";
    };
    const showVideo = () => {
      let video = document.getElementById("video");
      video.style.display = "block";
    };
    const showStopButton = () => {
      let stopButton = document.getElementById("stopButton");
      stopButton.style.display = "inline-flex";
    };
    app();
  });

  const handleClickStop = () => {
    let video = document.getElementById("webcam");
    video.pause();

    let stopButton = document.getElementById("stopButton");
    stopButton.style.display = "none";

    let returnButton = document.getElementById("returnButton");
    returnButton.style.display = "inline-flex";

    let downloadButton = document.getElementById("downloadButton");
    downloadButton.style.display = "inline-flex";
  };

  const handleClickReturn = () => {
    let video = document.getElementById("webcam");
    video.play();

    let stopButton = document.getElementById("stopButton");
    stopButton.style.display = "inline-flex";

    let returnButton = document.getElementById("returnButton");
    returnButton.style.display = "none";

    let downloadButton = document.getElementById("downloadButton");
    downloadButton.style.display = "none";
  };

  const handleUpload = () => {
    var canvas = document.getElementById("canvas");
    var video = document.getElementById("webcam");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    var db = firebase.firestore();
    db.collection("images")
      .add({
        dataUrl: canvas.toDataURL("image/png"),
        createdDate: Date.now()
      })
      .then(function(docRef) {
        var storageRef = firebase.storage().ref();
        var mountainImagesRef = storageRef.child(
          "images/" + docRef.id + ".jpg"
        );
        mountainImagesRef
          .putString(canvas.toDataURL("image/png"), "data_url")
          .then(function(snapshot) {
            console.log("Uploaded a data_url string!");
          });
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  };

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
      <div>
        <Fab
          aria-label="Stop"
          className={classes.fab1}
          onClick={() => handleClickStop()}
          id="stopButton"
        >
          <StopIcon />
        </Fab>
        <Fab
          color="secondary"
          aria-label="KeyboardReturn"
          className={classes.fab2}
          onClick={() => handleClickReturn()}
          id="returnButton"
        >
          <KeyboardReturnIcon />
        </Fab>
        <Fab
          color="primary"
          aria-label="GetApp"
          className={classes.fab3}
          onClick={() => handleUpload()}
          id="downloadButton"
        >
          <CloudUploadIcon />
        </Fab>
        <canvas id="canvas" className={classes.canvas}></canvas>
      </div>
    </div>
  );
}
