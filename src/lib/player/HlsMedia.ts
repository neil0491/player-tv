import Hls from "hls.js";
import { BasePlayer } from "./InterfacePlayer";

export const hslSource = "https://webos.tvcom.uz/thirdparty/hls.min.js";

// _isScriptLoaded(url: string): boolean {
//     const scripts = document.getElementsByTagName("script");
//     for (let i = 0; i < scripts.length; i++) {
//       if (scripts[i].src === url) {
//         return true;
//       }
//     }
//     return false;
//   }

//   _loadHlsScript(url: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       if (this._isScriptLoaded(url)) {
//         console.log(`${url} уже загружен`);
//         //@ts-ignore
//         resolve(window.Hls); // Скрипт уже загружен, сразу разрешаем промис
//         return;
//       }
//       const script = document.createElement("script");
//       script.src = url;
//       script.type = "text/javascript";
//       script.async = true;

//       script.onload = () => {
//         // Проверяем, что Hls был загружен и доступен в глобальном объекте
//         //@ts-ignore
//         if (typeof Hls !== "undefined") {
//           console.log("HLS.js успешно загружен");
//           //@ts-ignore
//           resolve();
//         } else {
//           reject(new Error("HLS.js не найден после загрузки скрипта"));
//         }
//       };

//       script.onerror = () => {
//         reject(new Error("Ошибка загрузки скрипта HLS.js"));
//       };
//       document.head.appendChild(script);
//     });
//   }

export class HlsMedia extends BasePlayer {
  video: HTMLVideoElement | null = null;
  hls: Hls | null = null;

  constructor(url: string) {
    super();
    this.video = document.createElement("video");
    this.video.width = 800;
    this.video.height = (800 * 9) / 16;
    this.video.controls = true;
    this.video.id = "player";

    if (Hls.isSupported()) {
      this.destroy();
      this.hls = new Hls();
      //@ts-ignore
      window.hls = this.hls;
      this.hls.loadSource(url);
      this.hls.attachMedia(this.video);
    }
  }

  get VideoElement() {
    return this.video;
  }

  play() {
    if (this.video) {
      this.video.play();
    }
  }
  pause() {
    if (this.video) {
      this.video.pause();
    }
  }

  togglePlay() {
    if (this.video?.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  destroy(): void {
    if (this.hls) {
      this.hls.stopLoad();
      this.hls.destroy();
      this.hls = null;
      //@ts-ignore
      window.hls = null;
    }
    //@ts-ignore
    if (window.hls) {
      //@ts-ignore
      window.hls.stopLoad();
      //@ts-ignore
      window.hls.destroy();
      //@ts-ignore
      window.hls = null;
    }
  }

  listeners(): void {}
  seekTo(): void {}
}
