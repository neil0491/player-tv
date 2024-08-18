import { useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Player } from "./lib/player";

function App() {
  const video = useRef<HTMLDivElement>(null);
  const player = useRef<Player>();

  useEffect(() => {
    if (video.current) {
      player.current = new Player(
        video.current,
        "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
        "HLS"
      );
    }
    return () => {
      player.current?.destroy();
    };
  }, [video]);

  const playBtn = () => {
    player.current?.play();
  };
  const pauseBtn = () => {
    player.current?.pause();
  };

  return (
    <div className="App">
      <div ref={video}></div>
      <button onClick={playBtn}>Play</button>
      <button onClick={pauseBtn}>Pause</button>
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
