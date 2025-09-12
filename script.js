// ---------------------------
// Global Variables
// ---------------------------

// Stores the current playing audio
let currSong = new Audio()

// Stores the current folder (album) being used
let currFolder;

// Reference to the play button image in play bar (index.html → #play-btn)
let img = document.getElementById("play-btn")

// Array to hold list of songs fetched from the server
let songs

// Stores each album folder name while fetching albums
let folder

// Stores slider (volume) percentage value for background fill
let Slidervalue



// ---------------------------
// Helper Functions
// ---------------------------

// Convert seconds (audio.currentTime & duration) into MM:SS format
function formatTime(timeInSeconds) {
    if (isNaN(timeInSeconds)) return "00:00"; // Fallback if duration not ready
    const totalSeconds = Math.floor(timeInSeconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}



// ---------------------------
// Core Functions
// ---------------------------

// Fetch songs from a folder and display them in "Your Library"
// Called when user clicks an album card from right section (index.html → .playlists-container)
async function getSongs(folder) {
    currFolder = folder
    // Local  fetch
    // let a = await fetch(`http://127.0.0.1:5500/songs/${currFolder}/`)
    // Git pages fetch
    let a = await fetch(`songs/${currFolder}/`)
    let response = await a.text()

    // Create temporary div to parse folder content
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []

    // Collect only .mp3 files into songs[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        let song = element.href
        if (song.endsWith(".mp3")) {
            songs.push(song)
        }
    }

    // Get the <ul> inside .song-list (index.html → left sidebar library)
    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""

    // Render each song into sidebar library
    for (const song of songs) {
        let s = song.split(`/songs/${currFolder}/`)[1]
        songUL.innerHTML += `<li>
                           <div class="image">
                            <img id="cover" src="/assets/images/song.jpeg" alt="song cover">
                            <img id="play" src="assets/svgs/play-white.svg" alt="play song">
                           </div> 
                           <div class="info">
                            <h3>${s.replaceAll("%20", " ")}</h3>
                            <p>Artist</p>
                           </div>
                        </li>`
    }

    // Attach click event to each song in sidebar → play it
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });
}



// Play the given track from current folder
// Updates audio src, plays it, and shows track name in play bar
const playMusic = (track) => {
    currSong.src = `/songs/${currFolder}/` + track
    currSong.play()
    img.src = "assets/svgs/play.svg"
    document.querySelector(".song-name").innerHTML = track
}



// Fetch all album folders from /songs directory and create cards
// Each folder must contain info.JSON for title/description
async function getAlbums() {
    //For local use
    // let a = await fetch("http://127.0.0.1:5500/songs")
    //For Deployment
    let a = await fetch("/songs")
    let response = await a.text()

    let div = document.createElement("div")
    let container = document.querySelector(".playlists-container") // index.html → right panel
    div.innerHTML = response

    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            folder = e.href.split("/songs/")[1]

            // Each folder has info.JSON with album title + description
            //For Local use
            // let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.JSON`)
            //For Deployment
            let a = await fetch(`/songs/${folder}/info.JSON`)
            let response = await a.json()

            // Create album card inside playlists-container
            container.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="image">
                            <img id="cover-image" src="/songs/${folder}/cover.jpeg" alt="playlist image">
                            <div>
                                <img src="assets/svgs/pause.svg" alt="play hover">
                            </div>
                        </div>
                        <div class="info">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>                 
                    </div>`
        }
    }

    // On clicking an album card → load songs of that folder in left sidebar
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            document.querySelector(".left").style.left = "0"
            await getSongs(item.currentTarget.dataset.folder)
        })
    })
}



// ---------------------------
// Main Function
// ---------------------------

async function main() {
    // Load album cards on page load
    await getAlbums()

    // Play / Pause button in play bar
    let play = document.getElementById("play-div")
    play.addEventListener("click", () => {
        if (currSong.paused) {
            img.src = "assets/svgs/play.svg"
            currSong.play()
        }
        else {
            img.src = "assets/svgs/pause.svg"
            currSong.pause()
        }
    })

    // Update song progress (time + seekbar)
    currSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-duration").innerHTML = 
          `${formatTime(currSong.currentTime)} / ${formatTime(currSong.duration)}`

        // Move circle and fill green bar according to time
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%"
        document.querySelector(".played").style.width = (currSong.currentTime / currSong.duration) * 100 + "%"
    })

    // Seekbar click → jump to clicked position in song
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        document.querySelector(".played").style.width = percent + "%"
        currSong.currentTime = ((currSong.duration) * percent) / 100
    })

    // Sidebar open (hamburger)
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Sidebar close (X button)
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style = "-100"
    })

    // Previous button → play previous song in songs[]
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currSong.src)
        let previous = songs[index - 1].split(`${currFolder}/`)[1].replaceAll("%20", " ")
        if (index <= songs.length) {
            playMusic(previous)
        }
    })

    // Next button → play next song in songs[]
    next.addEventListener("click", () => {
        let index = songs.indexOf(currSong.src)
        let next = songs[index + 1].split(`${currFolder}/`)[1].replaceAll("%20", " ")
        if (index >= 0) {
            playMusic(next)
        }
    })

    // Volume icon toggle → mute/unmute
    document.querySelector(".volume").firstElementChild.addEventListener("click", e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume","mute")
            currSong.volume = 0
            volume.value = 0
        }
        else{
            e.target.src = e.target.src.replace("mute","volume")
            currSong.volume = .100
            volume.value = 10
        }
        updateSliderFill(volume);
    })

    // Volume slider change → update audio volume
    volume.addEventListener("change", (e) => {
        currSong.volume = parseInt(e.target.value) / 100
    })

    // Update slider track with green fill (Spotify style)
    const slider = document.getElementById("volume");
    function updateSliderFill(slider) {
        Slidervalue = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, #1db954 ${Slidervalue}%, #444 ${Slidervalue}%)`;
    }
    slider.addEventListener("input", () => updateSliderFill(slider));
    updateSliderFill(slider); // initialize once
}



// Run main app
main()
