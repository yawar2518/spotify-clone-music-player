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

// Stores slider (volume) percentage value for background fill
let Slidervalue

// Stores previous volume level for unmute
let previousVolume = 0.5



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
    let a = await fetch("albums.json")
    let response = await a.json()

    let album = response[folder]

    songs = album.songs.map(song => `songs/${folder}/` + song)
    currFolder = folder

    let songUL = document.querySelector(".song-list ul")
    songUL.innerHTML = ""

    for (const song of songs) {
        let s = song.split(`${folder}/`)[1]
        songUL.innerHTML += `
            <li>
                <div class="image">
                    <img id="cover" src="assets/images/song.jpeg" alt="song cover">
                    <img id="play" src="assets/svgs/play-white.svg" alt="play song">
                </div> 
                <div class="info">
                    <h3>${s.replaceAll("%20", " ")}</h3>
                    <p>Artist</p>
                </div>
            </li>`
    }

    Array.from(document.querySelectorAll(".song-list li")).forEach(li => {
        li.addEventListener("click", () => {
            playMusic(li.querySelector(".info h3").innerText.trim())
        })
    })
}



// Play the given track from current folder
// Updates audio src, plays it, and shows track name in play bar
const playMusic = (track) => {
    currSong.src = `songs/${currFolder}/` + track
    currSong.play()
    img.src = "assets/svgs/play.svg"
    document.querySelector(".song-name").innerHTML = track
}



// Fetch all album folders from /songs directory and create cards
// Each folder must contain info.JSON for title/description
async function getAlbums() {
    let a = await fetch("albums.json")
    let response = await a.json()

    let container = document.querySelector(".playlists-container")
    container.innerHTML = ""

    for (const folder in response) {
        let album = response[folder]
        container.innerHTML += `
            <div data-folder="${folder}" class="card">
                <div class="image">
                    <img id="cover-image" src="${album.cover}" alt="playlist image">
                    <div>
                        <img src="assets/svgs/pause.svg" alt="play hover">
                    </div>
                </div>
                <div class="info">
                    <h2>${album.title}</h2>
                    <p>${album.description}</p>
                </div>
            </div>`
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

    // Get volume slider element
    let volume = document.getElementById("volume");

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
        document.querySelector(".left").style.left = "-100%"
    })

    // Previous button → play previous song in songs[]
    document.getElementById("previous").addEventListener("click", () => {
        let base = window.location.pathname.replace(/\/[^\/]*$/, '')
        let currSrc = new URL(currSong.src).pathname.replace(base, '')
        if (currSrc.startsWith('/')) currSrc = currSrc.slice(1)
        currSrc = decodeURIComponent(currSrc)
        let index = songs.indexOf(currSrc)
        if (index > 0) {
            let previousSong = songs[index - 1].split(`${currFolder}/`)[1].replaceAll("%20", " ")
            playMusic(previousSong)
        }
    })

    // Next button → play next song in songs[]
    document.getElementById("next").addEventListener("click", () => {
        let base = window.location.pathname.replace(/\/[^\/]*$/, '')
        let currSrc = new URL(currSong.src).pathname.replace(base, '')
        if (currSrc.startsWith('/')) currSrc = currSrc.slice(1)
        currSrc = decodeURIComponent(currSrc)
        let index = songs.indexOf(currSrc)
        if (index >= 0 && index < songs.length - 1) {
            let nextSong = songs[index + 1].split(`${currFolder}/`)[1].replaceAll("%20", " ")
            playMusic(nextSong)
        }
    })

    // Volume icon toggle → mute/unmute
    document.querySelector(".volume").firstElementChild.addEventListener("click", e=>{
        if (currSong.volume > 0) {
            previousVolume = currSong.volume;
            currSong.volume = 0;
            volume.value = 0;
            e.target.src = "assets/svgs/mute.svg";
        } else {
            currSong.volume = previousVolume;
            volume.value = previousVolume * 100;
            e.target.src = "assets/svgs/volume.svg";
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
