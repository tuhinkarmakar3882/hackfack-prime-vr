import {qs} from "./helper/common";
import {UIElements} from "./constants";
import {pauseVideo, playVideo} from "./helper/player-controls";
import {voiceSearch} from "./helper/voice-search";

console.log("I'm Connected")

document.addEventListener('DOMContentLoaded', function () {
  qs(UIElements.gazeControl.playBtn).addEventListener('click', playVideo);
  qs(UIElements.gazeControl.pauseBtn).addEventListener('click', pauseVideo);
  qs(UIElements.gazeControl.voiceSearch).addEventListener('click', voiceSearch);
});

