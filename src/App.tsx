import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Player } from "./lib/player";
import { EVENTS } from "./lib/player/constants";
//@ts-ignore
import SpatialNavigation, {
  Focusable,
  //@ts-ignore
} from "react-js-spatial-navigation";

const ReactPlayer = () => {
  const video = useRef<HTMLDivElement>(null);
  const player = useRef<Player>();
  const btn = useRef<HTMLElement>();

  const [videoInfo, setVideoInfo] = useState({
    levels: [],
    audios: [],
    subtitles: [],
  });

  const [currentLevel, setCurrentLevel] = useState(-1);
  const [currentAudio, setCurrentAudio] = useState(-1);
  const [currentSubtitle, setCurrentSubtitle] = useState(-1);

  useEffect(() => {
    //@ts-ignore
    btn.current && btn.current?.el?.focus();
  }, [btn]);

  // "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  // "https://mtoczko.github.io/hls-test-streams/test-group/playlist.m3u8",
  useEffect(() => {
    if (video.current && !player.current) {
      player.current = new Player(
        video.current,
        "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "AVPlayer"
      );
      const p = player.current;

      // p.on(EVENTS.LOADED, () => {})
      p.on(EVENTS.INFO, (data) => {
        setVideoInfo(data);
      });
      p.on(EVENTS.LOADING, (data: boolean) => {
        // console.log("PROGRESS_TIME", data);
      });
      p.on(EVENTS.PROGRESS_TIME, (data: number) => {
        // console.log(p.duration);

        // console.log("PROGRESS_TIME", data);
      });
      p.on(EVENTS.STATUS_PLAYER, (data: boolean) => {
        console.log(data);
      });
      p.on(EVENTS.ERROR, (data) => {
        console.log(data);
      });
      p.on(EVENTS.CURRENT_LEVEL, (data) => {
        setCurrentLevel(data);
      });
      p.on(EVENTS.CURRENT_AUDIO, (data) => {
        setCurrentAudio(data);
      });
      p.on(EVENTS.CURRENT_SUBTITLE, (data) => {
        setCurrentSubtitle(data);
      });
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
      // "http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8"
      "https://mtoczko.github.io/hls-test-streams/test-group/playlist.m3u8"
    );
  };
  const siking = (time: number) => {
    player.current?.seekTo(time);
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255, 0.5)",
      }}
    >
      <div ref={video}></div>
      <div style={{ height: 100 }}>
        {/* {JSON.stringify(window?.webapis)} */}
      </div>

      <Focusable ref={btn} onClickEnter={playBtn}>
        Play
      </Focusable>
      <Focusable onClickEnter={pauseBtn}>Pause</Focusable>
      <Focusable onClickEnter={changeVideo}>changeVideo</Focusable>
      <Focusable onClickEnter={() => siking(15)}>siking 15</Focusable>
      <Focusable onClickEnter={() => console.log(player.current)}>
        Player
      </Focusable>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div>
          <p>{currentLevel}</p>
          <p>{currentAudio}</p>
          <p>{currentSubtitle}</p>
        </div>
        <div>
          <div>
            {videoInfo.audios.map((el, index) => (
              <p
                onClick={() => {
                  if (player.current?.player) {
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
            {videoInfo.levels.map((el, index) => (
              <p
                onClick={() => {
                  if (player.current?.player) {
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
                  if (player.current?.player) {
                    player.current?.changeSubtitleLevel(index);
                  }
                }}
                key={index}
              >
                subtitles {index}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [state, setState] = useState(false);

  return (
    <SpatialNavigation>
      <div className="App">
        <Focusable onClickEnter={() => setState(true)}>Player</Focusable>
        <Focusable onClickEnter={() => setState(false)}>Other</Focusable>
        {state ? <ReactPlayer /> : <div>{JSON.stringify(window?.webapis)}</div>}
      </div>
    </SpatialNavigation>
  );
}

export default App;
