import {UIElements} from "../constants";
import {qs} from "./common";

export const playVideo = () => {
  const videoElement: HTMLVideoElement = qs(UIElements.theatreScreen);
  videoElement.play();
};

export const pauseVideo = () => {
  const videoElement: HTMLVideoElement = qs(UIElements.theatreScreen);
  videoElement.pause();
};

