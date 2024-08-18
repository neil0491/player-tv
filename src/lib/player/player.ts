import { AVPlayer } from "./AVPlayer";
import { HlsMedia } from "./HlsMedia";

type TpyePlayer = "HLS" | "AVPlayer";

export class Player {
  player: HlsMedia | AVPlayer | undefined;
  type: TpyePlayer;

  container: HTMLDivElement;
  video: HTMLMediaElement | HTMLObjectElement | null = null;

  constructor(element: HTMLDivElement, url: string, type: TpyePlayer = "HLS") {
    this.container = element;
    this.type = type;
    this._init(url);
  }

  _appenndVideoElemnt() {
    if (this.player) {
      this.video = this.player.VideoElement;
      if (this.video && this.container) {
        while (this.container.firstChild) {
          this.container.removeChild(this.container.firstChild);
        }
        this.container.append(this.video);
      }
      this.play();
    }
  }

  _init(url: string) {
    switch (this.type) {
      case "HLS":
        this.player = new HlsMedia(url);
        this._appenndVideoElemnt();
        break;
      case "AVPlayer":
        this.player = new AVPlayer(url);
        this._appenndVideoElemnt();

        break;
      default:
        break;
    }
  }

  play() {
    if (this.player) {
      this.player.play();
    }
  }
  pause() {
    if (this.player) {
      this.player.pause();
    }
  }
  togglePlay() {
    if (this.player) {
      this.player.togglePlay();
    }
  }
  seekTo() {}
  listeners() {}
  destroy() {}
}

// ПРИМЕР СОЗДАНИЯ
// class VideoPlayer extends EventEmitter {
//     constructor(videoElement, sourceUrl, playerType) {
//         super();
//         this.videoElement = videoElement;
//         this.sourceUrl = sourceUrl;
//         this.player = null;

//         this.createPlayer();
//     }

//     createPlayer() {
//         if (this.isTizenPlatform()) {
//             // Инициализация AVPlayerTizen для платформы Tizen
//             this.player = new AVPlayerTizen(this.videoElement, this.sourceUrl);
//         } else if (Hls.isSupported()) {
//             // Инициализация HLSPlayer для браузеров, поддерживающих HLS.js
//             this.player = new HLSPlayer(this.videoElement, this.sourceUrl);
//         } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
//             // Если HLS нативно поддерживается в элементе video
//             this.videoElement.src = this.sourceUrl;
//             this.emit('ready');
//         } else {
//             // Если ни одна из технологий не поддерживается
//             this.emit('error', 'Нет поддержки HLS или AVPlayer на этом устройстве');
//         }

//         if (this.player) {
//             this.setupEventForwarding();
//         }
//     }

//     setupEventForwarding() {
//         // Перенаправляем события от плеера к наружному слушателю
//         this.player.on('ready', () => this.emit('ready'));
//         this.player.on('play', () => this.emit('play'));
//         this.player.on('pause', () => this.emit('pause'));
//         this.player.on('error', (error) => this.emit('error', error));
//         this.player.on('bufferingstart', () => this.emit('bufferingstart'));
//         this.player.on('bufferingcomplete', () => this.emit('bufferingcomplete'));
//         this.player.on('timeupdate', (time) => this.emit('timeupdate', time));
//         this.player.on('event', (eventType, eventData) => this.emit('event', eventType, eventData));
//         this.player.on('ended', () => this.emit('ended'));
//         this.player.on('destroy', () => this.emit('destroy'));
//     }

//     isTizenPlatform() {
//         // Проверка на то, что платформа — Tizen (например, Smart TV)
//         return typeof tizen !== 'undefined' && typeof tizen.systeminfo !== 'undefined';
//     }

//     play() {
//         if (this.player) {
//             this.player.play();
//         }
//     }

//     pause() {
//         if (this.player) {
//             this.player.pause();
//         }
//     }

//     destroy() {
//         if (this.player) {
//             this.player.destroy();
//             this.player = null;
//         }
//     }
// }
