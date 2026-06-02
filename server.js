const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');
const ADMIN_PASSWORD = 'Sexwithrealaaquif';

app.use(cors());
app.use(express.json());

// Default database template
const defaultDbData = {
  stats: {
    subs: 11700,
    views: 700000,
    uploads: 79,
    discord: 1500
  },
  siteSettings: {
    settingsVersion: 3,
    heroTag: "OFFICIAL YOUTUBE PORTAL",
    heroTitle1: "OFFICIAL WEPSITE",
    heroTitle2: "REAL AAQUIF",
    heroDesc: "Real Aaquif is a Minecraft YouTuber known for creating entertaining PvP, challenge, and gameplay content for the Minecraft community. This is the official website of Real Aaquif, where you can find updates, content, and everything related to the channel.",
    aboutTitle: "THE ORIGIN",
    aboutSubtitle: "CREATOR PORTRAIT // REAL AAQUIF",
    aboutDesc1: "Hey! I'm Aaquif, also known online as Real Aaquif. I create entertaining Minecraft PvP content that combines intense battles, funny moments, and engaging storytelling to keep viewers entertained from start to finish.",
    aboutDesc2: "My videos focus on delivering high-quality content through exciting PvP experiences, unique challenges, and memorable stories within the Minecraft community. As an active and growing creator, I'm dedicated to consistently providing enjoyable content for my audience while building a strong and interactive community around my channel.",
    aboutDesc3: "Through my content, I aim to entertain, make people laugh, and create experiences that viewers genuinely enjoy watching and sharing with others.",
    youtubeLink: "https://youtube.com/@realaaquif",
    discordLink: "https://discord.gg/AeYDnRqpxp",
    instagramLink: "https://www.instagram.com/realaaquif",
    pfpUrl: "assets/pfp.png"
  },
  spoilers: [
    {
      id: 1,
      title: "Minecraft RealSMP Trap Challenge!",
      desc: "Sneak peek of the giant redstone logic trap I built under Steve's house. Spoiler: It uses 500 TNT blocks and a secret wireless tripwire!",
      date: "Friday, June 12",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
  ],
  posts: [
    {
      id: 1,
      title: "MINECRAFT REDSTONE COMPUTER: 8-BIT ALU!",
      desc: "In this episode, I build a fully functional 8-bit Arithmetic Logic Unit (ALU) using pure Minecraft redstone circuitry. Check out the wiring schematic and step-by-step assembly!",
      date: "June 01, 2026",
      tag: "video",
      img: "https://images.unsplash.com/photo-1607988795691-3d0147b43231?w=600&auto=format&fit=crop",
      link: "https://youtube.com/@realaaquif"
    },
    {
      id: 2,
      title: "WE REACHED 11.7K SUBSCRIBERS! 🎉",
      desc: "Words cannot describe how thankful I am for this community! 11,700 of you have joined this channel. A special Q&A video and subscriber server world-download are coming next week!",
      date: "May 28, 2026",
      tag: "announcement",
      img: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop",
      link: "https://youtube.com/@realaaquif"
    },
    {
      id: 3,
      title: "CREATOR SURVIVAL WORLD SEED UPDATE",
      desc: "The official seeds and download links for the Survival Season 3 world have been updated. Join the Discord to download the folder and explore my secret bases yourself!",
      date: "May 25, 2026",
      tag: "announcement",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop",
      link: "https://discord.gg/AeYDnRqpxp"
    },
    {
      id: 4,
      title: "REAL MULTIPLAYER FPS BOOST TEXTURE PACK (1.21+)",
      desc: "Download my custom PvP texture pack optimized for maximum frame rate. Features clean short-swords, low fire overlay, clear glass, and custom sky boxes!",
      date: "May 22, 2026",
      tag: "media",
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop",
      link: "https://youtube.com/@realaaquif"
    }
  ]
};

// Database helper functions
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(defaultDbData);
      return defaultDbData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, returning default data:", err);
    return defaultDbData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error writing database file:", err);
    return false;
  }
}

// Authentication Middleware
function requireAdmin(req, res, next) {
  const authHeaderPassword = req.headers['x-admin-password'];
  if (authHeaderPassword === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized: Invalid access key." });
  }
}

// API Endpoints
app.get('/api/data', (req, res) => {
  const dbData = readDb();
  res.json(dbData);
});

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Access denied." });
  }
});

app.post('/api/save', requireAdmin, (req, res) => {
  const { stats, siteSettings, spoilers, posts } = req.body;
  
  const currentDb = readDb();
  if (stats) currentDb.stats = stats;
  if (siteSettings) currentDb.siteSettings = siteSettings;
  if (spoilers) currentDb.spoilers = spoilers;
  if (posts) currentDb.posts = posts;

  const success = writeDb(currentDb);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: "Failed to save data." });
  }
});

// Securely serve specific static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/app.js', (req, res) => res.sendFile(path.join(__dirname, 'app.js')));
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css')));

// Fallback to home page for any other route to handle simple client routing
app.get('*', (req, res) => res.redirect('/'));

// Initialize database on startup
readDb();

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Real Aaquif Portfolio running on http://localhost:${PORT}`);
  console.log(`Admin Password set to: ${ADMIN_PASSWORD}`);
  console.log(`==================================================`);
});
