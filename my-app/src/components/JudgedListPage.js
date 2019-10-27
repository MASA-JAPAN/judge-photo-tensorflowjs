import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import firebase from "firebase";

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
};

export default function JudgedList(props) {
  // Create a reference with an initial file path and name
  var storage = firebase.storage();
  var pathReference = storage.ref();
  pathReference
    .child("images/test.jpg")
    .getDownloadURL()
    .then(function(url) {
      console.log(url);

      // Or inserted into an <img> element:
      var img = document.getElementById("myimg");
      img.src = url;
    })
    .catch(function(error) {
      // Handle any errors
      console.log("a");
    });
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6">Object Judged List</Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <img id="myimg"></img>
    </React.Fragment>
  );
}
