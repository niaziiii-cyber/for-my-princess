// Memory data - each object represents a memory card
const memories = [
    {
        id: 1,
        title: "Long Distance",
        note: "Even with miles between us, you feel closer than anyone ever has. Every sunset I watch alone, I know you're seeing it too. Every conversation, every 'good morning' text, every 'I miss you' whispered through the screen - they're not reminders of the distance, but proof that love knows no boundaries. These pixels on my screen hold the most beautiful heart I've ever known, and though I can't reach out and touch you, I feel your presence in every moment of my day. The space between us is just geography; in every way that matters, you're right here with me.",
        videoFile: "video1.mp4",
        icon: "fas fa-plane",
        viewed: false
    },
    {
        id: 2,
        title: "We found each other",
        videoFile: "video2.mp4",
        note: "In this crowded world, amidst the chaos of life, our eyes met and everything else faded away. It was as if the universe conspired to bring us together in that perfect moment.",
        date: "August 2, 2023",
        icon: "fas fa-heart",
        viewed: false
    },
    {
        id: 3,
        title: "I love you",
        videoFile: "video3.mp4",
        note: "Even on the messy days, thinking of you makes everything better. Your smile is my favorite sight, your laughter my favorite sound. I love you more than words can express.",
        icon: "fas fa-infinity",
        viewed: false
    },
    {
        id: 4,
        title: "First time we talked",
        videoFile: "video4.mp4",
        note: "I remember the night we talked for the first time. That night after a very long time I smiled with all my heart. Your words were like a melody that played on repeat in my mind.",
        date: "March 16, 2025",
        icon: "fas fa-comments",
        viewed: false
    },
    {
        id: 5,
        title: "You are my everything",
        videoFile: "video5.mp4",
        note: "You are my sunshine on cloudy days, my anchor in the stormy seas. With you, I've found a love that fills every corner of my heart and makes life worth living.",
        icon: "fas fa-sun",
        viewed: false
    },
    {
        id: 6,
        title: "Your eyes",
        videoFile: "video6.mp4",
        note: "Your eyes are like a universe I could get lost in forever. They hold stories, dreams, and a depth of emotion that captivates me every time I look into them.",
        icon: "fas fa-eye",
        viewed: false
    }
];

// DOM Elements
const galleryEl = document.getElementById('gallery');
const videoModal = document.getElementById('videoModal');
const closeModalBtn = document.getElementById('closeModal');
const memoryVideo = document.getElementById('memoryVideo');
const videoTitle = document.getElementById('videoTitle');
const videoNote = document.getElementById('videoNote');
const videoDate = document.getElementById('videoDate');
const videoDuration = document.getElementById('videoDuration');
const videoPlaceholder = document.getElementById('videoPlaceholder');
const finalCardContainer = document.getElementById('finalCardContainer');
const finalCard = document.getElementById('finalCard');
const revealLetterBtn = document.getElementById('revealLetterBtn');
const letterOverlay = document.getElementById('letterOverlay');
const closeLetterBtn = document.getElementById('closeLetter');
const progressBar = document.querySelector('.progress-bar');
const viewedCountEl = document.getElementById('viewedCount');
const totalCountEl = document.getElementById('totalCount');

// State
let viewedMemories = [];
let activeMemoryId = null;

// Initialize the page
function init() {
    loadViewedMemories();
    renderGallery();
    updateProgress();
    setupEventListeners();
    checkVideoSupport();
}

// Load viewed memories from localStorage
function loadViewedMemories() {
    const saved = localStorage.getItem('viewedMemories');
    if (saved) {
        viewedMemories = JSON.parse(saved);
        
        // Update memory objects
        memories.forEach(memory => {
            if (viewedMemories.includes(memory.id)) {
                memory.viewed = true;
            }
        });
    }
}

// Save viewed memories to localStorage
function saveViewedMemories() {
    localStorage.setItem('viewedMemories', JSON.stringify(viewedMemories));
}

// Render the gallery of memory cards
function renderGallery() {
    galleryEl.innerHTML = '';
    
    memories.forEach(memory => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.id = memory.id;
        
        // Add viewed class if already viewed
        if (memory.viewed) {
            card.classList.add('viewed');
        }
        
        card.innerHTML = `
            <div class="card-icon">
                <i class="${memory.icon}"></i>
            </div>
            <h3>${memory.title}</h3>
            <p>Click to relive this memory</p>
            ${memory.viewed ? '<div class="viewed-badge"><i class="fas fa-check"></i></div>' : ''}
        `;
        
        card.addEventListener('click', () => openMemory(memory.id));
        
        // Add animation delay for staggered appearance
        card.style.animationDelay = `${memory.id * 0.1}s`;
        
        galleryEl.appendChild(card);
    });
    
    // Update total count
    totalCountEl.textContent = memories.length;
}

// Check video format support
function checkVideoSupport() {
    const video = document.createElement('video');
    const canPlayMP4 = video.canPlayType('video/mp4');
    
    console.log('MP4 support:', canPlayMP4);
    
    if (!canPlayMP4) {
        console.warn('Browser MP4 support is limited. Videos may not play correctly.');
    }
}

// Open a memory (show modal with video)
function openMemory(id) {
    const memory = memories.find(m => m.id === id);
    
    if (!memory) {
        console.error("Memory not found with ID:", id);
        return;
    }
    
    activeMemoryId = id;
    
    // Update video information
    videoTitle.textContent = memory.title;
    videoNote.textContent = memory.note;
    videoDate.textContent = memory.date;
    videoDuration.textContent = memory.duration;
    
    // Show loading placeholder
    videoPlaceholder.style.display = 'flex';
    
    // Clear previous video source
    memoryVideo.pause();
    memoryVideo.currentTime = 0;
    
    // Remove existing source elements
    while (memoryVideo.firstChild) {
        memoryVideo.removeChild(memoryVideo.firstChild);
    }
    
    // Create new source element
    const source = document.createElement('source');
    source.src = memory.videoFile;
    source.type = 'video/mp4';
    memoryVideo.appendChild(source);
    
    // Load the video
    memoryVideo.load();
    
    // Show modal
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Mark as viewed if not already
    if (!memory.viewed) {
        memory.viewed = true;
        
        if (!viewedMemories.includes(id)) {
            viewedMemories.push(id);
            saveViewedMemories();
            updateProgress();
            renderGallery();
        }
    }
}

// Setup video event listeners
function setupVideoListeners() {
    memoryVideo.addEventListener('loadeddata', function() {
        console.log('Video loaded:', this.src);
        videoPlaceholder.style.display = 'none';
    });
    
    memoryVideo.addEventListener('canplay', function() {
        console.log('Video can play');
        videoPlaceholder.style.display = 'none';
        
        // Try to play automatically (muted to avoid autoplay restrictions)
        this.muted = true;
        this.play().catch(error => {
            console.log('Autoplay prevented:', error.message);
            this.muted = false;
        });
    });
    
    memoryVideo.addEventListener('error', function(e) {
        console.error('Video error:', this.error);
        videoPlaceholder.style.display = 'flex';
        videoPlaceholder.innerHTML = `
            <div style="text-align: center; color: #ff6b6b;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>Error loading video</p>
                <p style="font-size: 0.8rem; margin-top: 5px;">Please check console for details</p>
            </div>
        `;
        
        // Test with placeholder video
        console.log('Testing with placeholder video...');
        const testSource = document.createElement('source');
        testSource.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
        testSource.type = 'video/mp4';
        
        // Clear and try placeholder
        while (memoryVideo.firstChild) {
            memoryVideo.removeChild(memoryVideo.firstChild);
        }
        memoryVideo.appendChild(testSource);
        memoryVideo.load();
    });
    
    memoryVideo.addEventListener('waiting', function() {
        videoPlaceholder.style.display = 'flex';
    });
    
    memoryVideo.addEventListener('playing', function() {
        videoPlaceholder.style.display = 'none';
    });
}

// Close video modal
function closeMemoryModal() {
    videoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Pause and reset video
    memoryVideo.pause();
    memoryVideo.currentTime = 0;
    
    // Reset placeholder
    videoPlaceholder.style.display = 'flex';
    videoPlaceholder.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading video...</p>
    `;
}

// Update progress bar and check if all memories viewed
function updateProgress() {
    const viewedCount = viewedMemories.length;
    const totalCount = memories.length;
    const progressPercentage = (viewedCount / totalCount) * 100;
    
    // Update progress bar
    progressBar.style.setProperty('--progress-width', `${progressPercentage}%`);
    
    // Update viewed count
    viewedCountEl.textContent = viewedCount;
    
    // Show final card if all memories viewed
    if (viewedCount === totalCount && totalCount > 0) {
        showFinalCard();
    } else {
        finalCardContainer.style.display = 'none';
    }
}

// Show the final hidden card
function showFinalCard() {
    finalCardContainer.style.display = 'block';
    
    // Add animation class
    setTimeout(() => {
        finalCard.classList.add('animate');
    }, 100);
}

// Open the fullscreen letter
function openLetter() {
    letterOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close the fullscreen letter
function closeLetter() {
    letterOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Setup event listeners
function setupEventListeners() {
    // Close modal when clicking X or outside modal
    closeModalBtn.addEventListener('click', closeMemoryModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeMemoryModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeMemoryModal();
        }
    });
    
    // Final card button
    revealLetterBtn.addEventListener('click', openLetter);
    
    // Close letter
    closeLetterBtn.addEventListener('click', closeLetter);
    letterOverlay.addEventListener('click', (e) => {
        if (e.target === letterOverlay) {
            closeLetter();
        }
    });
    
    // Close letter with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && letterOverlay.classList.contains('active')) {
            closeLetter();
        }
    });
    
    // Setup video listeners
    setupVideoListeners();
}

// Reset all viewed memories (for testing)
function resetViewedMemories() {
    viewedMemories = [];
    localStorage.removeItem('viewedMemories');
    memories.forEach(memory => {
        memory.viewed = false;
    });
    renderGallery();
    updateProgress();
    console.log("All memories reset to unviewed");
}

// Initialize the app when DOM is loaded

document.addEventListener('DOMContentLoaded', init);

