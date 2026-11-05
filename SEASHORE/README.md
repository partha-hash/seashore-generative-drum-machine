# SEASHORE — Generative Percussion

A browser-based generative drum machine made from the supplied shore-found percussion recordings. Built with React, Vite and the Web Audio API. Designed for static hosting on Vercel or GitHub Pages.

## Features
- 16-step editable sequencer
- Generative starting patterns for House, UK Garage, Jungle, Breakbeat, Downtempo and Experimental
- 16 playable voice pads using the supplied recordings
- Random pattern generation
- Sample auditioning
- Browser DSP chain: low-pass filter, waveshaper saturation, convolution-style algorithmic reverb send, tempo-independent delay send and master compression
- Uploadable looping sea ambience with a dedicated level slider
- Responsive interface using the supplied SEASHORE artwork

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Audio starts after pressing PLAY or auditioning a pad because browsers require a user gesture before audio playback.

## Build for Vercel

```bash
npm run build
```

Vercel settings:
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

You can import this project ZIP into a new GitHub repository, then import that repository into Vercel. No backend or API key is required.

## Sea ambience recording

The supplied `seashore sample pack.zip` contains 54 short one-shot WAV recordings, but no separate continuous sea/wave ambience recording was present. The app therefore includes a **LOAD SEA RECORDING** control. Upload a long WAV/MP3/AAC field recording of the sea in the browser; the ambience slider then controls its looped playback level. If you later add a licensed/owned recording at `public/audio/sea-ambience.wav`, it can be wired as a bundled default.

## Samples and artwork

- `public/samples/` — original one-shot samples from the supplied ZIP
- `public/images/seashore-cover.png` — generated SEASHORE artwork based on the supplied reference photograph

The source WAV files are retained as supplied; no destructive processing or conversion is applied.


## Built-in shoreline ambience

The project includes `public/audio/shoreline.wav`, the supplied 29.68-second stereo BBC Seaside recording (48 kHz, 16-bit PCM). It is loaded automatically when the audio engine starts and loops beneath the percussion. The **Ambience** slider controls its level independently. Use **Replace Sea Recording** to load a different local audio file for the current session.

## Deploy to Vercel

1. Push this project folder to a new GitHub repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Keep the framework preset as **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

No environment variables are required. The app is client-side and uses the browser Web Audio API. Audio begins after the first user interaction because browsers require a user gesture before starting audio.
