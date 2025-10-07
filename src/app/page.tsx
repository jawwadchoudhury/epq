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
  const [videoSrc, setVideoSrc] = useState("a");
  const [status, setStatus] = useState("No status currently available");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e:any) => {
    const file = e.target.files?.[0]

    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setStatus(`Video loaded! ${url}`);
    }
  }

  const extractFrameData = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setStatus('Error: Video or canvas element not found.');
      return;
    }

     try {
      // Set the canvas dimensions to be the same as the video's
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Get the 2D drawing context of the canvas
      const context = canvas.getContext('2d');
      
      // Draw the current frame of the video onto the canvas
      // The parameters are: (image, dx, dy, dWidth, dHeight)
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Now, get the raw pixel data from the canvas
      // This returns an ImageData object with a `data` property (a Uint8ClampedArray)
      // The array is in the format [R1, G1, B1, A1, R2, G2, B2, A2, ...]
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
      
      setStatus(`Frame extracted! Image is ${imageData?.width}x${imageData?.height}. Check the console for pixel data.`);
      
      // For your project, this is where you would pass the `imageData` object
      // to your LSB encoding function from Step 4 of the roadmap.
      console.log('Extracted ImageData:', imageData);
      console.log('Pixel data array:', imageData?.data);

    } catch (error:any) {
      setStatus(`An error occurred: ${error.message}`);
      console.error("Failed to extract frame:", error);
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
