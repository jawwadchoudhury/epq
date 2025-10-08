This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Author's Note

This is my EPQ project, at the time of writing this it's very barebones but I'll get around to making it fully functional and all pretty.
Here's my plan:
- Set up simple web interface (my favourite framework is Next.JS, so I'll probably continue using it, it also allows free web hosting using Vercel), with an input for a video file, text to be encoded and a canvas for processing. (MediaRecorder API will be needed for the canvas)

- Load and deconstruct the video into a series of frames, and extract the pixel data of each frame.

- Convert the message into a binary stream, for extra security, I will probably encrypt this message into cypher text first, to make it slightly more imperceptible. Unicode will probably be used in order to represent these letters into binary, as it allows for any characters to be hidden, even foreign letters and emojis and symbols etc. Add a terminator to the end, this is for the decoding program to know whether a video is encoded with data or not, the easiest way to go around this is including some less commonly used sequence of Unicode characters. For example purposes: ӸӺڞ, these 3 random characters, to the program are encoded as U+04F8U+04FEU+069E, called a delimiter

- Implement LSB encoding. This involves iterating through each frame, and getting the LSB of a pixel value. Corresponding with the binary stream - if the binary stream has a 1, you flip the last bit. This will create a very minimal change to the colour of that pixel, imperceivable to the human eye.

- Create a processing loop. Once that frame has completed all the bits required, advance to the next frame, and redo the previous step.

- Construct these frames back together and save it to the websites memory, allow it to be a downloadable artefact, and the program is completed.

- For decoding - follow similar steps but the inverse of it. Read every LSB instead of writing, and construct a binary stream, this will leave you with cypher text. Decode the cypher text (using some sort of key, yet to be decided), and you have a string of text, which is what the end user put as their text. End program once delimiter is reached (defined earlier).     If no delimiter is found, then the video is probably not encoded.
