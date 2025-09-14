$(function () {
  const playerTrack = $("#player-track");
  const albumName = $("#album-name");
  const trackName = $("#track-name");
  const albumArt = $("#album-art");
  const sArea = $("#seek-bar-container");
  const seekBar = $("#seek-bar");
  const trackTime = $("#track-time");
  const seekTime = $("#seek-time");
  const sHover = $("#s-hover");
  const playPauseButton = $("#play-pause-button");
  const tProgress = $("#current-time");
  const tTime = $("#track-length");
  const playPreviousTrackButton = $("#play-previous");
  const playNextTrackButton = $("#play-next");

  const baseUrl = "https://raw.githubusercontent.com/psy5669/MusicPlayList/main/asset/calm/musics/";
  const tracks = [
    { singer: "Elijah woods", title: "Where we're going", file: "1. Elijah woods - Where we're going.mp3", art: "_1" },
    { singer: "Caleb Hearn", title: "Little Bit Better(ft. ROSIE)", file: "2. Caleb Hearn - Little Bit Better(ft. ROSIE).mp3", art: "_2" },
    { singer: "Anson Seabra", title: "Peter Pan Was Right", file: "3. Anson Seabra - Peter Pan Was Right.mp3", art: "_3" },
    { singer: "Caleb Hearn", title: "Where Do We Go from Here", file: "4. Caleb Hearn - Where Do We Go from Here.mp3", art: "_4" },
    { singer: "Rihianne(cover)", title: "somewhere only we know", file: "5. Rihianne(cover)-somewhere only we know.mp3", art: "_5" },
    { singer: "Moncrieff", title: "Broken", file: "6. Moncrieff - Broken.mp3", art: "_6" },
    { singer: "Yaeow", title: "not your fault", file: "7. Yaeow - not your fault.mp3", art: "_7" },
    { singer: "Jeremy Zucker", title: "always, i'll care", file: "8. Jeremy Zucker - always, i'll care.mp3", art: "_8" },
    { singer: "Ariana Grande", title: "pov", file: "9. Ariana Grande - pov.mp3", art: "_9" },
    { singer: "Fiji Blue", title: "Up Down", file: "10. Fiji Blue - Up Down.mp3", art: "_10" },
    { singer: "Anson Seabra", title: "Welcome to Wonderland", file: "11. Anson Seabra - Welcome to Wonderland.mp3", art: "_11" },
    { singer: "If Tomorrow It's All Over", title: "Chris James", file: "12. If Tomorrow It's All Over - Chris James.mp3", art: "_12" },
    { singer: "Lullaboy, Benjamin Kheng", title: "time with myself", file: "13. Lullaboy, Benjamin Kheng - time with myself.mp3", art: "_13" },
    { singer: "Yung kai", title: "do you think you could love me", file: "14. Yung kai - do you think you could love me.mp3", art: "_14" },
    { singer: "Elijah woods", title: "247, 365", file: "15. Elijah woods - 247, 365.mp3", art: "_15" },
    { singer: "Livingston", title: "Atlas..", file: "16. Livingston - Atlas.mp3", art: "_16" },
    { singer: "Jeremy Zucker", title: "natural disaster", file: "17. Jeremy Zucker - natural disaster.mp3", art: "_17" },
    { singer: "Henry Moodie", title: "pick up the phone", file: "18. Henry Moodie - pick up the phone.mp3", art: "_18" },
    { singer: "Lauv", title: "Changes", file: "19. Lauv - Changes.mp3", art: "_19" },
    { singer: "OneRepublic", title: "I Lived", file: "20. OneRepublic - I Lived.mp3", art: "_20" },
  ];

  // 파일 전체 경로 생성
  tracks.forEach((t) => (t.url = baseUrl + encodeURIComponent(t.file)));

  let i = playPauseButton.find("i"),
    seekT,
    seekLoc,
    seekBarPos,
    cM,
    ctMinutes,
    ctSeconds,
    curMinutes,
    curSeconds,
    durMinutes,
    durSeconds,
    playProgress,
    bTime,
    nTime = 0,
    buffInterval = null,
    tFlag = false,
    currIndex = -1;

  function playPause() {
    setTimeout(function () {
      if (audio.paused) {
        playerTrack.addClass("active");
        albumArt.addClass("active");
        checkBuffering();
        i.attr("class", "fas fa-pause");
        audio.play();
        $("#playlist li").eq(currIndex).addClass("active");
      } else {
        playerTrack.removeClass("active");
        albumArt.removeClass("active");
        clearInterval(buffInterval);
        albumArt.removeClass("buffering");
        i.attr("class", "fas fa-play");
        audio.pause();
      }
    }, 300);
  }

  function showHover(event) {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());

    sHover.width(seekT);

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 0 || ctSeconds < 0) return;
    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds)) seekTime.text("--:--");
    else seekTime.text(ctMinutes + ":" + ctSeconds);

    seekTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
  }

  function hideHover() {
    sHover.width(0);
    seekTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
  }

  function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }

  function updateCurrTime() {
    nTime = new Date().getTime();

    if (!tFlag) {
      tFlag = true;
      trackTime.addClass("active");
    }

    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = (audio.currentTime / audio.duration) * 100;

    if (curMinutes < 10) curMinutes = "0" + curMinutes;
    if (curSeconds < 10) curSeconds = "0" + curSeconds;

    if (durMinutes < 10) durMinutes = "0" + durMinutes;
    if (durSeconds < 10) durSeconds = "0" + durSeconds;

    if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.text("00:00");
    else tProgress.text(curMinutes + ":" + curSeconds);

    if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.text("00:00");
    else tTime.text(durMinutes + ":" + durSeconds);

    if (isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds)) trackTime.removeClass("active");
    else trackTime.addClass("active");

    seekBar.width(playProgress + "%");

    if (playProgress == 100) {
      i.attr("class", "fa fa-play");
      seekBar.width(0);
      tProgress.text("00:00");
      albumArt.removeClass("buffering").removeClass("active");
      clearInterval(buffInterval);
    }
  }

  function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(function () {
      if (nTime == 0 || bTime - nTime > 1000) albumArt.addClass("buffering");
      else albumArt.removeClass("buffering");

      bTime = new Date().getTime();
    }, 100);
  }

  function selectTrack(flag, index = null) {
    if (index !== null) {
      currIndex = index;
    } else {
      if (flag == 0 || flag == 1) ++currIndex;
      else --currIndex;
    }

    if (currIndex >= tracks.length) currIndex = 0;
    if (currIndex < 0) currIndex = tracks.length - 1;

    if (currIndex > -1 && currIndex < tracks.length) {
      const track = tracks[currIndex];

      if (flag == 0) i.attr("class", "fa fa-play");
      else {
        albumArt.removeClass("buffering");
        i.attr("class", "fa fa-pause");
      }

      seekBar.width(0);
      trackTime.removeClass("active");
      tProgress.text("00:00");
      tTime.text("00:00");

      audio.src = track.url;

      nTime = 0;
      bTime = new Date().getTime();

      if (flag != 0 || index !== null) {
        audio.play();
        playerTrack.addClass("active");
        albumArt.addClass("active");

        clearInterval(buffInterval);
        checkBuffering();
      }

      albumName.text(track.title);
      trackName.text(track.singer);
      albumArt.find("img.active").removeClass("active");
      $("#" + track.art).addClass("active");

      $("#playlist li").removeClass("active");
      $("#playlist li").eq(currIndex).addClass("active");
    }
  }

  function renderPlaylist() {
    const playlist = $("#playlist");
    playlist.empty();
    tracks.forEach((t, index) => {
      const li = $(`<li>${t.singer} - ${t.title}</li>`);
      li.on("click", function () {
        selectTrack(1, index);
        $("#playlist li").removeClass("active");
        $(this).addClass("active");
      });
      playlist.append(li);
    });
  }

  function initPlayer() {
    audio = new Audio();
    selectTrack(0);
    audio.loop = false;

    audio.addEventListener("ended", function () {
      selectTrack(1);
    });

    playPauseButton.on("click", playPause);
    sArea.mousemove(showHover);
    sArea.mouseout(hideHover);
    sArea.on("click", playFromClickedPos);
    $(audio).on("timeupdate", updateCurrTime);
    playPreviousTrackButton.on("click", function () {
      selectTrack(-1);
    });
    playNextTrackButton.on("click", function () {
      selectTrack(1);
    });

    renderPlaylist();
  }

  initPlayer();
});
