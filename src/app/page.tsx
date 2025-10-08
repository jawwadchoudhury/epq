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
  const [videoSrc, setVideoSrc] = useState("a"); // Can't be empty otherwise errors are thrown
  const [status, setStatus] = useState("No status currently available"); // Just a default status message
  const videoRef = useRef<HTMLVideoElement>(null); // A pointer towards the video element
  const canvasRef = useRef<HTMLCanvasElement>(null); // A pointer towards the canvas element

  const handleFileChange = (e:any) => {
    const file = e.target.files?.[0]; // Are there files uploaded? If so, fetch the first one (shouldn't really be an issue, assuming there is only one file uploaded at a time

    if (file) { // If that file exists
      const url = URL.createObjectURL(file); // Create a BLOB (Binary Large Object) with a url (will be used as video source) 
      setVideoSrc(url); // And set the videoSrc state as this BLOB
      setStatus(`Video loaded! ${url}`); // Change status to confirmation that the video has loaded
    }
  }

  const extractFrameData = () => {
    const video = videoRef.current; // Allow the video to be whatever the pointer is facing to now
    const canvas = canvasRef.current; // Allow the canvas to be whatever the pointer is facing to now

    if (!video || !canvas) { // If there is no video or canvas element
      setStatus('Error: Video or canvas element not found.'); // Let the user know, and stop running the function any further
      return;
    }

     try {
      // Set canvas dimensions equal to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
       
      const context = canvas.getContext('2d'); // Retrieve the 2D context of this canvas
    
      context?.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw the current frame onto the canvas (image, dx, dy, dWidth, dHeight)

      // Now, get the raw pixel data from the canvas
      // This returns an ImageData object with a `data` property (a Uint8ClampedArray)
      // The array is in the format [R1, G1, B1, A1, R2, G2, B2, A2, ...]
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height); // Get the raw pixel data, returns a Uint8ClampedArray, in the format [R1, G1, B2, A1, R2, G2, B2, A2, etc.]
      
      setStatus(`Frame extracted! Image dimensions: ${imageData?.width}x${imageData?.height}`); // Let the user know the frames been extracted, and let them know the frame dimensions as well
      console.log('Extracted ImageData:', imageData); // Log the frame data into the console
      console.log('Pixel data array:', imageData?.data); // Log just the pixel array into the console

    } catch (error:any) { // If an error is caught (FIX THE TYPE! I was being lazy...)
      setStatus(`An error occurred: ${error.message}, let the site owner know (jawwadc@outlook.com`); // Set status as the error message
      console.error("Failed to extract frame:", error); // Throw a console error, with more detailss
    }
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
        />
        <h1 className="logo-text">EPQ</h1>
      </Link>
      <div className="main-page">
        <input type="file" accept="video/mp4,video/webm" onChange={handleFileChange}/>
        <p>{status}</p>
        <video
          ref={videoRef}
          src={videoSrc}
          controls
        />
        <canvas
          ref={canvasRef}
          className="canvas"
        />
        <button onClick={extractFrameData}>Extract</button>
      </div>
    </div>
  );
}
