// // Saving current playing audio in a Global Variable
// let currSong = new Audio()
// //current Folder
// let currFolder;
// // Global varibale of play button
// let img = document.getElementById("play-btn")
// // Global array can be acccessed in any bloack
// let songs
// let folder
// let Slidervalue

// // function which will convert .time and .duration from seconds to minutes:seconds format
// function formatTime(timeInSeconds) {
//     if (isNaN(timeInSeconds)) return "00:00"; // fallback if not ready
//     const totalSeconds = Math.floor(timeInSeconds);
//     const mins = Math.floor(totalSeconds / 60);
//     const secs = totalSeconds % 60;
//     return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
// }

// // function which will fetch songs from a folder and saving their sources in an Array
// async function getSongs(folder) {
//     currFolder = folder
//     let a = await fetch(`http://127.0.0.1:5500/songs/${currFolder}/`)
//     let response = await a.text()
//     let div = document.createElement("div")
//     div.innerHTML = response
//     let as = div.getElementsByTagName("a")
//     songs = []


//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         let song = element.href
//         if (song.endsWith(".mp3")) {
//             songs.push(song)
//         }
//     }

//     let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]

//     songUL.innerHTML = ""

//     // Storing the name of songs in the song-list element as html list
//     for (const song of songs) {
//         let s = song.split(`/songs/${currFolder}/`)[1]
//         songUL.innerHTML = songUL.innerHTML + `<li>
//                            <div class="image">
//                             <img id="cover" src="/assets/images/song.jpeg" alt="song cover">
//                             <img id="play" src="assets/svgs/play-white.svg" alt="play song">
//                            </div> 
//                            <div class="info">
//                             <h3>${s.replaceAll("%20", " ")}</h3>
//                             <p>Artist</p>
//                            </div>
//                         </li>`
//     }

//     // Play a song from list when it is clicked
//     Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
//         e.addEventListener('click', () => {
//             playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
//         })

//     });



// }


// // function which will play the source passed as global current song 
// const playMusic = (track) => {
//     currSong.src = `/songs/${currFolder}/` + track
//     currSong.play()
//     img.src = "assets/svgs/play.svg"
//     document.querySelector(".song-name").innerHTML = track
//     // document.querySelector(".song-duration").innerHTML = "0:0/0:0"

// }

// // List all folders as card
// async function getAlbums() {
//     let a = await fetch("http://127.0.0.1:5500/songs")
//     let response = await a.text()
//     let div = document.createElement("div")
//     let container = document.querySelector(".playlists-container")
//     div.innerHTML = response
//     let anchors = div.getElementsByTagName("a")
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];
//         if (e.href.includes("/songs/")) {
//             folder = e.href.split("/songs/")[1]
//             let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.JSON`)
//             let response = await a.json()
//             container.innerHTML = container.innerHTML + `<div data-folder="${folder}" class="card">
//                         <div class="image">
//                             <img id= "cover-image" src="/songs/${folder}/cover.jpeg" alt="playlist image">
//                             <div>
//                                 <img src="assets/svgs/pause.svg" alt="play hover">
//                             </div>
//                         </div>
//                         <div class="info">
//                             <h2>${response.title}</h2>
//                             <p>${response.description}</p>
//                         </div>                 
//                     </div>`
//         }
//     }

//        // Load playlist whenever card is clicked
//     Array.from(document.getElementsByClassName("card")).forEach(e => {
//         e.addEventListener("click", async item => {
//             document.querySelector(".left").style.left = "0"
//             await getSongs(item.currentTarget.dataset.folder)

//         })

//     })

  
// }

// // main async fucntion to call awaits for upper async functions
// async function main() {
//     // await getSongs(`${currFolder}`)
//     await getAlbums()

//     // play and pause the song when clicking on play-btn div
//     let play = document.getElementById("play-div")
//     play.addEventListener("click", () => {
//         if (currSong.paused) {
//             img.src = "assets/svgs/play.svg"
//             currSong.play()
//         }
//         else {
//             img.src = "assets/svgs/pause.svg"
//             currSong.pause()
//         }
//     })

//     // updating song time 
//     currSong.addEventListener("timeupdate", () => {
//         document.querySelector(".song-duration").innerHTML = `${formatTime(currSong.currentTime)} / ${formatTime(currSong.duration)}`
//         // updating position of circle inside seekbar with song time
//         document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%"
//         // updating position of green div inside seekbar with song time
//         document.querySelector(".played").style.width = (currSong.currentTime / currSong.duration) * 100 + "%"

//     })

//     // updating song time with percentage of seekbar filled
//     document.querySelector(".seekbar").addEventListener("click", e => {
//         let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
//         document.querySelector(".circle").style.left = percent + "%"
//         document.querySelector(".played").style.width = percent + "%"
//         currSong.currentTime = ((currSong.duration) * percent) / 100
//     })

//     // hamburger menu comes out
//     document.querySelector(".hamburger").addEventListener("click", () => {
//         document.querySelector(".left").style.left = "0"
//     })

//     //menu close event
//     document.querySelector(".close").addEventListener("click", () => {
//         document.querySelector(".left").style = "-100"
//     })

//       // will play previous song
//     previous.addEventListener("click", () => {
//         let index = songs.indexOf(currSong.src)
//         let previous = songs[index - 1].split(`${currFolder}/`)[1].replaceAll("%20", " ")
//         if (index <= songs.length) {
//             playMusic(previous)
//         }
//     })

//     // will play next song
//     next.addEventListener("click", () => {
//         let index = songs.indexOf(currSong.src)
//         let next = songs[index + 1].split(`${currFolder}/`)[1].replaceAll("%20", " ")
//         if (index >= 0) {
//             playMusic(next)
//         }
//     })



//       //Will mute the song
//       document.querySelector(".volume").firstElementChild.addEventListener("click", e=>{
//         if(e.target.src.includes("volume.svg")){
//             e.target.src = e.target.src.replace("volume","mute")
//             currSong.volume = 0
//             volume.value = 0
//         }

//         else{
//             e.target.src = e.target.src.replace("mute","volume")
//             currSong.volume = .100
//             volume.value = 10
//         }

//          updateSliderFill(volume);
//       })


//     volume.addEventListener("change", (e) => {
//         currSong.volume = parseInt(e.target.value) / 100
//     })

//       // This function (Slider track fill) is generated completely by CHATGPT
//     const slider = document.getElementById("volume");
//     function updateSliderFill(slider) {
//         Slidervalue = (slider.value - slider.min) / (slider.max - slider.min) * 100;
//         slider.style.background = `linear-gradient(to right, #1db954 ${Slidervalue}%, #444 ${Slidervalue}%)`;
//     }
//     slider.addEventListener("input", () => updateSliderFill(slider));
//     // Initialize on page load
//     updateSliderFill(slider);


  
  
// }

// main()  
