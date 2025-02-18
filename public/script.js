document.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app');

    const navItems = ['All', 'Live', 'Schedule', 'News'];
    let activeTab = 'all';

    // Fetch live match data from API
    const fetchMatches = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/byte-capsule/FanCode-Hls-Fetcher/main/Fancode_hls_m3u8.Json');
            const data = await response.json();
            return data.matches;
        } catch (error) {
            console.error('Error fetching match data:', error);
            return [];
        }
    };

    const matches = await fetchMatches();

    // Create Navigation
    const nav = document.createElement('nav');
    nav.innerHTML = `
      <div class="logo">SportStream</div>
      <div class="nav-links">
        ${navItems.map(tab => `<button class="${tab.toLowerCase() === activeTab ? 'active' : ''}" data-tab="${tab.toLowerCase()}">${tab}</button>`).join('')}
      </div>
      <input type="text" class="search-box" placeholder="Search events...">
    `;
    app.appendChild(nav);

    // Main Banner
    const banner = document.createElement('div');
    banner.className = 'main-banner';
    banner.innerHTML = `
      <div class="banner-content">
        <h1>Your Ultimate Sports Streaming Experience</h1>
      </div>
    `;
    app.appendChild(banner);

    // Live Matches Section
    const liveSection = document.createElement('div');
    liveSection.className = 'section';
    liveSection.innerHTML = `<h2>Live Matches</h2>`;
    const matchContainer = document.createElement('div');
    matchContainer.className = 'live-matches';

    // Loop through the fetched match data and display it in a grid layout
    matches.forEach(match => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.innerHTML = `
            <div class="match-banner">
                <img src="${match.banner}" alt="${match.match_name}" />
            </div>
            <div class="match-info">
                <h3>${match.match_name}</h3>
                <button class="watch-now-button" data-stream="${match.stream_link}">Watch Now</button>
            </div>
        `;
        matchContainer.appendChild(card);
    });

    liveSection.appendChild(matchContainer);
    app.appendChild(liveSection);

    // Footer
    const footer = document.createElement('footer');
    footer.innerHTML = `&copy; 2025 SportStream. All rights reserved.`;
    app.appendChild(footer);

    // Navigation button event listener
    const navButtons = document.querySelectorAll('.nav-links button');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTab = btn.dataset.tab;
            console.log(`Switched to ${activeTab}`);
        });
    });

    // Watch Now button click event handler
    const watchNowButtons = document.querySelectorAll('.watch-now-button');
    watchNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const streamUrl = e.target.dataset.stream;
            playStream(streamUrl);
        });
    });

    // Function to play the HLS stream using hls.js
    function playStream(url) {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        const videoElement = document.createElement('video');
        videoElement.controls = true;
        videoElement.style.width = '100%';
        videoElement.style.maxWidth = '800px';

        videoContainer.appendChild(videoElement);
        app.appendChild(videoContainer);

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(videoElement);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                videoElement.play();
            });
        }
        else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            videoElement.src = url;
            videoElement.addEventListener('loadedmetadata', function() {
                videoElement.play();
            });
        }
    }
});
