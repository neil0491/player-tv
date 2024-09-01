import { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Player } from "./lib/player";

const ReactPlayer = () => {
  const video = useRef<HTMLDivElement>(null);
  const player = useRef<Player>();

  const [videoInfo, setVideoInfo] = useState({
    videos: [],
    audios: [],
    subtitles: [],
  });

  // "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  useEffect(() => {
    if (video.current && !player.current) {
      player.current = new Player(
        video.current,
        "https://mtoczko.github.io/hls-test-streams/test-group/playlist.m3u8",
        "HLS"
      );
      player.current.onOnce("videos", (data) => {
        setVideoInfo((prev) => ({ ...prev, videos: data }));
      });
      player.current.onOnce("audios", (data) => {
        setVideoInfo((prev) => ({ ...prev, audios: data }));
      });
      player.current.onOnce("subtitles", (data) => {
        setVideoInfo((prev) => ({ ...prev, subtitles: data }));
      });
      console.log(player.current);
    }
    return () => {
      player.current && player.current.destroy();
    };
  }, [video]);

  const playBtn = () => {
    player.current?.play();
  };
  const pauseBtn = () => {
    player.current?.pause();
  };
  const changeVideo = () => {
    player.current?.changeUrl(
      "http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8"
    );
  };
  const siking = (time: number) => {
    player.current?.seekTo(time);
  };

  return (
    <>
      <div ref={video}></div>
      <button onClick={playBtn}>Play</button>
      <button onClick={pauseBtn}>Pause</button>
      <button onClick={changeVideo}>changeVideo</button>
      <button onClick={() => siking(15)}>siking 15</button>
      <button onClick={() => console.log(player.current)}>Player</button>
      <div>
        {videoInfo.audios.map((el, index) => (
          <p
            onClick={() => {
              if (player.current?.player?.hls) {
                player.current?.changeAudioLevel(index);
              }
            }}
            key={index}
          >
            audios {index}
          </p>
        ))}
      </div>
      <div>
        {videoInfo.videos.map((el, index) => (
          <p
            onClick={() => {
              if (player.current?.player?.hls) {
                player.current?.changeVideoLevel(index);
              }
            }}
            key={index}
          >
            videos {index}
          </p>
        ))}
      </div>
      <div>
        {videoInfo.subtitles.map((el, index) => (
          <p
            onClick={() => {
              if (player.current?.player?.hls) {
                player.current?.changeSubtitleLevel(index);
              }
            }}
            key={index}
          >
            subtitles {index}
          </p>
        ))}
      </div>
    </>
  );
};

function App() {
  return (
    <div className="App">
      <ReactPlayer />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
