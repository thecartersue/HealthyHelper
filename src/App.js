import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import {currentFruit} from "./Fruit";
//https://s3.console.aws.amazon.com/s3/object/healthyhelper?region=us-east-1&prefix=model.json

function App() {
  const videoFeed = useRef(null);
  const mainScreen = useRef(null);
  const sidebar = useRef(null);
  
  const retreiveNet = async () => {
    const net = await tf.loadGraphModel('https://s3.console.aws.amazon.com/s3/object/healthyhelper?region=us-east-1&prefix=model.json')
    setInterval(() => {
      detect(net);
    }, 5);
  };

  const detect = async (net) => {
    if (
      typeof videoFeed.current !== "undefined" &&
      videoFeed.current !== null &&
      videoFeed.current.video.readyState === 4
    ) {
      const video = videoFeed.current.video;
      const videoWidth = videoFeed.current.video.videoWidth;
      const videoHeight = videoFeed.current.video.videoHeight;
      videoFeed.current.video.width = videoWidth;
      videoFeed.current.video.height = videoHeight;
      mainScreen.current.width = videoWidth;
      mainScreen.current.height = videoHeight;
      sidebar.current.width = 416;
      sidebar.current.height = 768;


      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640,480])
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const obj = await net.executeAsync(expanded)
      console.log(obj)
      
      const boxes = await obj[1].array()
      const classes = await obj[2].array()
      const scores = await obj[4].array()
      const dtx = sidebar.current.getContext("2d");

      requestAnimationFrame(()=>{currentFruit(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, dtx)});
      
      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)

    }
  };

  useEffect(()=>{retreiveNet()},[]);

  return (
    <div className="App">
        <Webcam
          ref={videoFeed}
          muted={true} 
          style={{
            position: "absolute",
            textAlign: "center",
            right: 0,
            zindex: 9,
            width: 1024,
            height: 768,
          }}
        />

        <canvas
          ref={mainScreen}
          style={{
            position: "absolute",
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 1024,
            height: 768,
          }}
        />

        <canvas
        ref={sidebar}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#4e657c",
            left: 0,
            textAlign: "center",
            width: 416,
            height: 768,
          }}
        />
    </div>

  );
}

export default App;
