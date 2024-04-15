// const io= require('socket.io');
let rooms = [];
let search;
let id = [];
let title = [];
let q;
async function query() {
  q = document.querySelector("input").value;
  console.log("q=", q);
  await getVideos(q); // Wait for getVideos to complete
  processVideos();  // Process the videos after getVideos is completed
}
console.log("script.js loaded");
// function changebutton(){
//   setTimeout(()=>
//   {
//     const roomValue = document.getElementById('enterroom').value;
//     const submitButton = document.getElementById("submit");
//     console.log("executing changebutton function");
//     console.log(typeof roomValue);
//     console.log(rooms);
//     console.log(typeof rooms[0]);
//     // Check against the socket ID directly
//     if(rooms.includes(roomValue)) {
//       submitButton.innerHTML = "Enter Room";
//       submitButton.onclick = enterroom;  // Assign function reference
//     } else {
//       document.getElementById('enterroom').placeholder = "wrong room id";
//       submitButton.innerHTML = "wrong room id";
//       submitButton.onclick = null;  // Remove onclick
//     }
//   } , 2000);
// }
console.log("script.js loaded");

// Listen for updateRooms event to update rooms array
socket.on('updateRooms', (updatedRooms) => {
    console.log("Received updated rooms in script.js:", updatedRooms);
    rooms = updatedRooms;
    changebutton();  // Call changebutton after updating rooms
});

function changebutton(){
    setTimeout(() => {
        const roomValue = document.getElementById('enterroom').value;
        const submitButton = document.getElementById("submit");
        console.log("executing changebutton function");
        console.log("rooms array in changebutton:", rooms);
        console.log("roomValue in changebutton:", roomValue);

        if(rooms.includes(roomValue)) {
            submitButton.innerHTML = "Enter Room";
            submitButton.onclick = enterroom;
        } else {
            document.getElementById('enterroom').placeholder = "wrong room id";
            submitButton.innerHTML = "wrong room id";
            // submitButton.onclick = null;
        }
    }, 2000);
}

async function getVideos(q) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyDNORMjwCOXb_AXfl36NMGV1ZSJnhQ_MoQ&q=${q}&type=video&part=snippet`, requestOptions);

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
function playVideo(vid) 
{
  const video = document.querySelector('iframe');
  h1 = document.querySelector('h1');
  h1.textContent = vid.title;
  id=vid.videoId;
  video.src = `https://www.youtube.com/embed/${id}?si=JkMawwWwe-8avw1C&autoplay=1`;
}