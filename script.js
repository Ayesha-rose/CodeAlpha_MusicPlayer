document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const albumArt = document.getElementById('album-art');
    const title = document.getElementById('title');
    const artist = document.getElementById('artist');
    const progress = document.getElementById('progress');
    const progressContainer = document.querySelector('.progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const prevBtn = document.getElementById('prev-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const playlistEl = document.getElementById('playlist');

    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');

    // --- 1. SET UP YOUR PLAYLIST HERE ---
    // Add your songs here. 
    // - title: The song title to display.
    // - artist: The artist name to display.
    // - src: The path to the audio file in the 'music' folder.
    // - artwork: The path to the album art in the 'images' folder.
    const songs = [
        { title: 'Burj Khalifa', artist: 'Shashi, Dj Khushi, Nikhita Gandhi, Madhubanti', src: 'music/01 - Burj Khalifa (320 Kbps) - DownloadMing.ME.mp3', artwork: 'images/default_art.svg' },
        { title: 'Dus Bahane 2.0', artist: 'Vishal, Shekhar', src: 'music/01 - Dus Bahane 2.0(feat. K.K., Shaan, Tulsi Kumar) - DownloadMing.SE.mp3', artwork: 'images/default_art.svg' },
        { title: 'Muqabla', artist: 'Parampara Thakur, Yash Narvekar', src: 'music/01 - Muqabla - DownloadMing.SE.mp3', artwork: 'images/default_art.svg' },
        { title: 'Shayad', artist: 'Pritam • Arijit Singh', src: 'music/01 - Shayad - DownloadMing.SE.mp3', artwork: 'images/default_art.svg' },
        { title: 'Cham Cham', artist: 'Meet Bros & Monali Thakur', src: 'music/02 - Cham Cham - DownloadMing.io.mp3', artwork: 'images/default_art.svg' },
        { title: 'Garmi', artist: 'Badshah, Neha Kakkar', src: 'music/02 - Garmi - DownloadMing.SE.mp3', artwork: 'images/default_art.svg' },
        { title: 'Haan Main Galat', artist: 'Pritam • Arijit Singh • Shashwat Singh', src: 'music/02 - Haan Main Galat - DownloadMing.SE.mp3', artwork: 'images/default_art.svg' },
        { title: 'Lamborghini', artist: 'Meet Bros., Neha Kakkar, Jassie Gill', src: 'music/02 - Lamborghini - DownloadMing.SE.mp3', artwork: 'images/default_art.svg' },
        { title: 'Mere Liye Tum Kaafi Ho', artist: 'Ayushmann Khurrana', src: 'music/02 - Mere Liye Tum Kaafi Ho - DownloadMing.SE.mp3', artwork: 'images/default_art.svg' },
    ];
    // --- End of playlist setup ---

    let currentSongIndex = 0;
    let isPlaying = false;

    function loadSong(song) {
        title.textContent = song.title;
        artist.textContent = song.artist;
        audio.src = song.src;
        albumArt.src = song.artwork;
        updatePlaylistUI();
    }

    function playSong() {
        isPlaying = true;
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }

    function pauseSong() {
        isPlaying = false;
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }

    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0;
        }
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // Update time display
        durationEl.textContent = formatTime(duration);
        currentTimeEl.textContent = formatTime(currentTime);
    }
    
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function setVolume() {
        audio.volume = volumeSlider.value;
    }

    function renderPlaylist() {
        playlistEl.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            li.dataset.index = index;

            const title = document.createElement('div');
            title.className = 'playlist-item-title';
            title.textContent = song.title;

            const artist = document.createElement('div');
            artist.className = 'playlist-item-artist';
            artist.textContent = song.artist;
            
            li.appendChild(title);
            li.appendChild(artist);

            playlistEl.appendChild(li);
        });
    }

    function updatePlaylistUI() {
        const items = playlistEl.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function playFromPlaylist(e) {
        const item = e.target.closest('.playlist-item');
        if (item) {
            const index = parseInt(item.dataset.index, 10);
            if (index !== currentSongIndex || !isPlaying) {
                currentSongIndex = index;
                loadSong(songs[currentSongIndex]);
                playSong();
            }
        }
    }


    // Event Listeners
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong); // Autoplay

    progressContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    playlistEl.addEventListener('click', playFromPlaylist);

    // Initial Load
    renderPlaylist();
    loadSong(songs[currentSongIndex]);
});
