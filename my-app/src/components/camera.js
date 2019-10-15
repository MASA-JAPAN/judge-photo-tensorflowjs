import React from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

export default class CameraFunction extends React.Component {
  render() {
    return (
      <div>
        <div id="console"></div>
        <video
          autoPlay
          playsInline
          muted
          id="webcam"
          width="100%"
          height="100%"
        ></video>
      </div>
    );
  }
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
    while (true) {
      const result = await net.classify(webcamElement);

      document.getElementById("console").innerText = `
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;

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
  app();
};
