let rooms = [];
console.log("script.js loaded");
let search;
let id = [];
let id2;
let title = [];
let mainid;
let q;
let roomValue;
let requestOptions;
let contentInfo;
let seconds;
socket.on('getrooms', (room) => {
  rooms = room;
  console.log("rooms check event executed . rooms=", rooms); // This will be executed when the server emits the 'roomcheck' event
});

function enterroom() {  //enter a particular room
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

function processVideos() {
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

function playVideo(vid) {
  const video = document.querySelector('iframe');
  h1 = document.querySelector('h1');
  h1.textContent = vid.title;
  id2 = vid.videoId;
  getSeconds(id2);
  video.src = `https://www.youtube.com/embed/${id2}?si=JkMawwWwe-8avw1C&autoplay=1`;
}

async function onload() {
  console.log("onload function executed");
  socket.emit('submit', prompt("Enter your name"));
  socket.on('videoLoaded', (videoId) => {
    const video = document.querySelector('iframe');
    video.src = `https://www.youtube.com/embed/${videoId}?si=JkMawwWwe-8avw1C&autoplay=1`;
  });
}

async function getSeconds(id2) {
  await getSec(id2);
}
async function getSec(id2) {
  mainid = id2;
  requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  try{
    response = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBhp8ZjlUH43kCd47j9osQj67IYAchSdsI&id=${mainid}&part=contentDetails`, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    else 
    {
      contentInfo = await response.json();  // store the video details for that id
      seconds= iso8601DurationToSec(contentInfo.items[0].contentDetails.duration);
      document.getElementById("timeline").max=seconds;
    }
  }
  catch (error){
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