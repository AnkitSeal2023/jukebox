// const io = require('socket.io-client');
var socket = io();
console.log(" loaded script.js");
let rooms = [];
let search, mainid, q, roomValue, requestOptions, contentInfo, timeline, time, tag, vidID, timerInterval;
vidID="M7lc1UVf-VE";
var player;
let id = [];
let title = [];
function enterroom() {  //enter a particular room
  console.log("executed enterroom function");
  socket.emit("joinRoom", roomValue);
}

async function query() { // get the search query from the input field
  q = document.getElementById('search').value;
  await getVideos(q); // Wait for getVideos to complete
  processVideos();  // Process the videos after getVideos is completed
}
function changebutton() {
  setTimeout(() => {
    roomValue = document.getElementById('enterroom').value;
    const submitButton = document.getElementById("submit");
    console.log("executing changebutton function");
    console.log("rooms array in changebutton:", rooms);
    console.log("roomValue in changebutton:", roomValue);
    if (rooms.includes(roomValue)) {
      console.log("correct room");
      submitButton.onclick = enterroom;
      submitButton.innerHTML = "Enter Room";
    } else {
      document.getElementById('enterroom').placeholder = "wrong room id";
      submitButton.innerHTML = "wrong room id";
      submitButton.onclick = null;
    }
  }, 500);
}

async function getVideos(q) {
  requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  try {
    response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBhp8ZjlUH43kCd47j9osQj67IYAchSdsI&q=${q}&type=video&regionCode=IN&part=snippet`, requestOptions);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    search = await response.json();  // Store the entire search result
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

function processVideos() {  //filter the required data from the received json object for future use 
  const videos = search.items.map(item => ({
    videoId: item.id.videoId,
    title: item.snippet.title
  }));
  console.log(search);
  console.log(videos);
  for (let i = 0; i < videos.length; i++) {
    console.log(id[i] = videos[i].videoId);
    console.log(title[i] = videos[i].title);
  }
  const videoList = document.getElementById('videoList'); // Assuming you have a <ul> element with id 'videoList'

  videos.forEach((video, index) => {
    const btn = document.createElement('button');
    btn.textContent = video.title;
    btn.addEventListener('click', () => playVideo(video));

    const li = document.createElement('li');
    li.appendChild(btn);

    videoList.appendChild(li);

    id[index] = video.videoId;
    title[index] = video.title;
  });
}

function playVideo(vid) {  //executed when one of the button in the list of buttons is clicked
  socket.emit('videoPlay',vid); //tell other sockets about the new video object
  h1 = document.querySelector('h1');
  h1.textContent = vid.title;
  id2 = vid.videoId;
  getSeconds(id2); //get no of seconds for the new video
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api"; //load the youtubeiframe api
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  player.videoId=id2; //assign the clicked button's video id to player
  player.loadVideoById(id2); //load the video of the clicked buttons' video id
}

function playVideo2(vid) {  //executed when one of the button in the list of buttons is clicked
  // socket.emit('videoPlay',vid);  //tell other sockets about the new video object
  h1 = document.querySelector('h1');
  h1.textContent = vid.title;
  id2 = vid.videoId;
  getSeconds(id2); //get no of seconds for the new video
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api"; //load the youtubeiframe api
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  player.videoId=id2; //assign the clicked button's video id to player
  player.loadVideoById(id2); //load the video of the clicked buttons' video id
}

async function getSeconds(id2) { //2 functions to call getsec asynchronously with await attribute
  await getSec(id2);
}
async function getSec(id2) { //get the no. of seconds for new video
  mainid = id2;
  requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  try {
    response = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBhp8ZjlUH43kCd47j9osQj67IYAchSdsI&id=${mainid}&part=contentDetails`, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    else {
      contentInfo = await response.json();  // store the video details for that id
      seconds = iso8601DurationToSec(contentInfo.items[0].contentDetails.duration);
      timeline=document.getElementById("timeline");
      timeline.max = seconds;
    }
  }
  catch (error) {
    console.error('Fetch error:', error);
  }
}
function iso8601DurationToSec(duration) {
  // Regular expression to match ISO 8601 duration format
  const durationRegex = /^P(?:([0-9]*)Y)?(?:([0-9]*)M)?(?:([0-9]*)D)?(?:T(?:([0-9]*)H)?(?:([0-9]*)M)?(?:([0-9.]*)S)?)?$/;

  const matches = duration.match(durationRegex);

  if (!matches) {
    throw new Error('Invalid ISO 8601 duration format');
  }

  // Extract duration components from regex matches
  const years = matches[1] || 0;
  const months = matches[2] || 0;
  const days = matches[3] || 0;
  const hours = matches[4] || 0;
  const minutes = matches[5] || 0;
  const seconds = matches[6] || 0;

  // Calculate total duration in seconds
  const totalSeconds =
    parseFloat(years) * 31536000 +  // 1 year = 365 days
    parseFloat(months) * 2592000 +   // 1 month = 30 days
    parseFloat(days) * 86400 +
    parseFloat(hours) * 3600 +
    parseFloat(minutes) * 60 +
    parseFloat(seconds);

  return totalSeconds;
}

// Function to load the YouTube IFrame Player API
function loadYouTubePlayerAPI(id2) {
  console.log("youtubeplayerapi executing");
  onYouTubeIframeAPIReady(id2);
}

// Function to seek to a specific time in the video
function seekToTime(time) {
  console.log("seekToTime function called with seconds:", time);
  console.log(player);
  if (player && typeof player.seekTo === 'function') {
    player.seekTo(time, true); // Seek to the specified time in seconds
  } else {
    console.log("Player is not ready or seekTo method is not available");
  }
}

// Function called when the YouTube IFrame Player API is ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtubePlayer', {
    height: '500vh',
    width: '500vw',
    videoId: vidID,
    playerVars: {
      'playsinline': 1,
      'autoplay': 1,
      'controls': 1,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
// Function called when the YouTube Player is ready
function onPlayerReady(event) {
  timeline = document.getElementById("timeline").value;
}
function onPlayerStateChange(event) 
{
  if(YT.PlayerState.PLAYING==2)
  {
    console.log("timer cleared");
    clearInterval(timerInterval);
  }
  else if (YT.PlayerState.PLAYING)
  {
    console.log("Player is playing");
    trackProgress();  
  }
}
function trackProgress()
{
  timerInterval=setInterval(increaseTimeline(),1000);
}
function increaseTimeline()
{
  timeline.value=timeline.value + 1
  console.log("timeline.value=",timeline.value);
}

// Function to handle seek functionality
function changeProgress() {
  timeline = document.getElementById("timeline").value;
  console.log("timeline executed", timeline);
  if (!player) {
    // // Load the YouTube IFrame Player API and then seek to the specified time
    // loadYouTubePlayerAPI(()=> {
    // });
    console.log("player not initialised in changeprogress");
  } else {
    // If the player is already initialized, directly seek to the specified time
    seekToTime(timeline);
    socket.emit('seekTime',timeline);
  }
}

socket.on('getrooms', (room) => {
  rooms = room;
  console.log("rooms check event executed . rooms=", rooms); // This will be executed when the server emits the 'roomcheck' event
});
socket.on("videoLoaded",(vidObj)=>{
  console.log("event received by:", socket.id);
  playVideo2(vidObj);
});
socket.on("executeSubmitFunc",()=>submit());
socket.on('seek',(timeline)=>seekToTime(timeline));