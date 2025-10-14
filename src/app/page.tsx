'use client';

import Image from "next/image";
import './home.css'
import {Hammersmith_One} from 'next/font/google'
import Link from "next/link";
import { useState, useRef } from "react";

const hammersmith_one = Hammersmith_One({
  weight: '400',
  subsets: ['latin']
})
 

export default function Home() {
  const defaultWatermark = "Watermarked by Steganography EPQ"
  const defaultFrameRate = 30;

  const [videoSrc, setVideoSrc] = useState<Blob | string | undefined>(undefined); // Can't be empty otherwise errors are thrown
  const [status, setStatus] = useState("No status currently available"); // Just a default status message

  var cypherText = "";
  var currentTime = 0;

  const videoRef = useRef<HTMLVideoElement>(null); // A pointer towards the video element
  const canvasRef = useRef<HTMLCanvasElement>(null); // A pointer towards the canvas element
  const textRef = useRef<HTMLInputElement | null>(null);
  const frameRateRef = useRef<HTMLInputElement | null>(null);

  function cipherText(text:any) {
    if (!text) text = defaultWatermark
    var cypherText = "";
    for (let i = 0; i < text.length; i++) {
      cypherText += 'U+' + text[i].charCodeAt(0).toString(16).toUpperCase().padStart(6, "0");
    }
    var startSymbol = "U+0003A8"; // Ψ
    var endSymbol = "U+0003C6"; // φ
    cypherText = startSymbol + cypherText + endSymbol

    var binary = ""
    for (let i = 0; i < cypherText.length; i++) {
      binary += cypherText[i].charCodeAt(0).toString(2).padStart(8, "0")
    }
    return binary;
  }

  function decipherBinary(binary:string) {
    var j = 0
    var pass = 0;
    var decipheredText = ""
    var unicode = ""
    for (let i = 0; i < binary.length; i = i + 8) {
      unicode += String.fromCharCode(parseInt((binary[i]+binary[i+1]+binary[i+2]+binary[i+3]+binary[i+4]+binary[i+5]+binary[i+6]+binary[i+7]), 2))
    }
    for (let i = 0; i < unicode.length; i = i + 8) {
      if (unicode[i]+unicode[i+1] == "U+") {
        decipheredText += String.fromCharCode(parseInt(unicode[i+2]+unicode[i+3]+unicode[i+4]+unicode[i+5]+unicode[i+6]+unicode[i+7], 16))
      }
    }
    return decipheredText;
  }

  const handleFileChange = (e:any) => {
    const file = e.target.files?.[0]; // Are there files uploaded? If so, fetch the first one (shouldn't really be an issue, assuming there is only one file uploaded at a time

    if (file) { // If that file exists
      const url = URL.createObjectURL(file); // Create a BLOB (Binary Large Object) with a url (will be used as video source) 
      setVideoSrc(url); // And set the videoSrc state as this BLOB
      setStatus(`Video loaded! ${url}`); // Change status to confirmation that the video has loaded
    }
  }

  // const extractFrameData = () => {
  //   var binary = cipherText(textRef.current?.value);
  //   console.log(binary)
  //   var frameRate = defaultFrameRate
  //   if (frameRateRef.current?.value) frameRate = parseInt(frameRateRef.current.value, 10)
    
  //   const video = videoRef.current; // Allow the video to be whatever the pointer is facing to now
  //   const canvas = canvasRef.current; // Allow the canvas to be whatever the pointer is facing to now
  //   if (!video || !canvas) { // If there is no video or canvas element
  //     setStatus('Video or canvas element not found...'); // Let the user know, and stop running the function any further
  //     return;
  //   }
  //   video.currentTime = 0;
  //    try {
  //     for (let j = 0; j < (video.duration / (1/frameRate)); j++) {
  //     //if (video.currentTime < video.duration) {
  //       currentTime += (1 / frameRate); // Iterate over the time required to reach the desired framerate
  //       video.currentTime = currentTime; // Shuffle that time along video playback
  //       // Set canvas dimensions equal to video dimensions
  //       canvas.width = video.videoWidth;
  //       canvas.height = video.videoHeight;
        
  //       var context = canvas.getContext('2d', { willReadFrequently: true }); // Retrieve the 2D context of this canvas
  //       if (!context) return setStatus("Canvas context couldn't be retrieved...");
        
  //       context.drawImage(video, 0, 0, canvas.width, canvas.height);
  //       var imageData = context.getImageData(0, 0, canvas.width, canvas.height); // Get the raw pixel data, returns a Uint8ClampedArray, in the format [R1, G1, B2, A1, R2, G2, B2, A2, etc.]
  //       if (binary.length > (imageData.width * imageData.height * 3)) return setStatus("Desired message is too long for the video resolution... Either increase the video resolution or make your watermark text shorter")
  //       var binaryIndex = 0; // For an offset
  //       for (let i = 0; i < binary.length; i++) {
  //         if (i % 4 == 3) continue;
  //         if (binary[binaryIndex] == "1") {
  //           imageData.data[i] = imageData.data[i] ^ 1; // XOR Operator
  //         }
  //         binaryIndex++;
  //       }
  //       context.putImageData(imageData, 0, 0)
  //        // Draw the current frame onto the canvas (image, dx, dy, dWidth, dHeight)
  //       setStatus(`Frame extracted! Image dimensions: ${imageData.width}x${imageData.height}`); // Let the user know the frames been extracted, and let them know the frame dimensions as well
  //       console.log(`Pixel data array at ${j/frameRate} seconds:`, imageData?.data); // Log just the pixel array into the console
  //       //console.log(j/frameRate)
  //     }
  //   } catch (error:any) { // If an error is caught (FIX THE TYPE! I was being lazy...)
  //     setStatus(`An error occurred: ${error.message}, let the site owner know (jawwadc@outlook.com`); // Set status as the error message
  //     console.error("Failed to extract frame:", error); // Throw a console error, with more details
  //   }
  // }

  const extractFrameData = () => {
    let binary = "";
    if (textRef.current?.value) {
      binary = cipherText(textRef.current.value);
    } else {
      binary = cipherText(defaultWatermark);
    }

    let frameRate = defaultFrameRate;
    if (frameRateRef.current?.value) {
      frameRate = parseInt(frameRateRef.current.value, 10);
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      return setStatus("Video/canvas element could not be found...");
    }

    const context = canvas.getContext('2d', { willReadFrequently: true }); // Retrieve context once, outsidde the loop for performance optimisation. (is that how you spell it?)
    if (!context) {
      return setStatus("Canvas context couldn't be retrieved...");
    }

    // And for the frame processing
    let frameIndex = 0;
    const totalFrames = Math.floor(video.duration * frameRate);

    const processFrame = () => {
      if (frameIndex >= totalFrames) {
        setStatus('All frames processed!');
        return console.log('Finished processing the frames');
      }

      const targetTime = frameIndex / frameRate;

      // Now the confusing bit, event listeners
      const onSeeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        if (binary.length > (imageData.width * imageData.height * 3)) {
          setStatus("Your watermarked message is too long for this video, consider making your message shorter, or increase the video resolution.");
          return video.removeEventListener('seeked', onSeeked);
        }

        let binaryIndex = 0;
        for (let i = 0; i < imageData.data.length && binaryIndex < binary.length; i++) {
          if (i % 4 === 3) continue; // Skip the alpha channel! It shouldn't be written to.
          if (binary[binaryIndex] === "1") {
            imageData.data[i] = imageData.data[i] ^ 1; // XOR Operator
          }
          binaryIndex++;
        }
        context.putImageData(imageData, 0, 0);

        setStatus(`Processing frame ${frameIndex + 1}/${totalFrames} at ${targetTime}s`);
        console.log(`Pixel data at ${targetTime}s: `, imageData?.data);

        frameIndex++;
        setTimeout(processFrame, 0) // Add these functions to a queue, give the browser a minute to breathe, stop memory overflows
      }

      video.addEventListener('seeked', onSeeked, { once: true });
      video.currentTime = targetTime;
    }

    video.currentTime = 0;
    processFrame();
  }

  return (
    <div className={hammersmith_one.className}>
      <Link href={'/'} className="logo-div">
        <Image
          className="logo-image"
          src="/logo.svg"
          alt="Logo"
          width={180}
          height={38}
          priority={true}
        />
        <h1 className="logo-text">EPQ</h1>
      </Link>
      <div className="main-page">
        <input type="file" accept="video/mp4,video/webm" onChange={handleFileChange}/>
        <input type="number" placeholder="30" ref={frameRateRef} className="border-[1px]"/>
        <input type="text" placeholder="Watermarked by Steganography EPQ" ref={textRef} className="border-[1px] w-[25%]"/>
        <p>{status}</p>
        <video
          ref={videoRef}
          src={videoSrc}
          className="video"
          onLoadedMetadata={() => {
            if(videoRef.current) videoRef.current.currentTime = 0;
          }}
        />
        <canvas
          ref={canvasRef}
          className="canvas"
        />
        <button onClick={extractFrameData} className="default-button">Extract</button>
      </div>
    </div>
  );
}
