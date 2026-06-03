/* ==========================================================================
   INTERACTIVE LOGIC - REAL AAQUIF PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- STATE MANAGEMENT ---
  let isAdmin = sessionStorage.getItem('aaquif_admin') === 'true';
  const defaultPassword = 'Sexwithrealaaquif';

  // Default Stats Metrics
  const defaultStats = {
    subs: 11700,
    views: 700000,
    uploads: 79,
    discord: 1500
  };

  // Load or Save stats to localStorage
  let channelStats = JSON.parse(localStorage.getItem('aaquif_stats'));
  if (!channelStats) {
    channelStats = defaultStats;
    localStorage.setItem('aaquif_stats', JSON.stringify(channelStats));
  }

  // Default Site Branding Settings
  const defaultSiteSettings = {
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
  };

  // Load or Save site settings to localStorage (merging defaults to prevent undefined keys)
  let siteSettings = JSON.parse(localStorage.getItem('aaquif_site_settings'));
  if (!siteSettings) {
    siteSettings = defaultSiteSettings;
    localStorage.setItem('aaquif_site_settings', JSON.stringify(siteSettings));
  } else {
    // If settings version is outdated, perform migration to new defaults
    if (!siteSettings.settingsVersion || siteSettings.settingsVersion < 3) {
      siteSettings.settingsVersion = 3;
      siteSettings.heroTitle1 = defaultSiteSettings.heroTitle1;
      siteSettings.heroTitle2 = defaultSiteSettings.heroTitle2;
      siteSettings.heroDesc = defaultSiteSettings.heroDesc;
      siteSettings.aboutDesc1 = defaultSiteSettings.aboutDesc1;
      siteSettings.aboutDesc2 = defaultSiteSettings.aboutDesc2;
      siteSettings.aboutDesc3 = defaultSiteSettings.aboutDesc3;
      localStorage.setItem('aaquif_site_settings', JSON.stringify(siteSettings));
    } else {
      // Merge any missing keys from defaults (e.g. instagramLink, aboutDesc3)
      let needsUpdate = false;
      for (const key in defaultSiteSettings) {
        if (siteSettings[key] === undefined) {
          siteSettings[key] = defaultSiteSettings[key];
          needsUpdate = true;
        }
      }
      if (needsUpdate) {
        localStorage.setItem('aaquif_site_settings', JSON.stringify(siteSettings));
      }
    }
  }

  // Function to apply site branding to the homepage HTML dynamically
  function applySiteSettingsToPage() {
    const settings = JSON.parse(localStorage.getItem('aaquif_site_settings')) || defaultSiteSettings;
    
    // Hero DOM elements
    const heroTagEl = document.querySelector('.hero-tag');
    if (heroTagEl) heroTagEl.textContent = settings.heroTag;

    const heroTitle1El = document.querySelector('.hero-title span:not(.accent)');
    if (heroTitle1El) heroTitle1El.textContent = settings.heroTitle1;

    const heroTitle2El = document.querySelector('.hero-title span.accent');
    if (heroTitle2El) heroTitle2El.textContent = settings.heroTitle2;

    const heroDescEl = document.querySelector('.hero-description');
    if (heroDescEl) heroDescEl.textContent = settings.heroDesc;

    // About DOM elements
    const aboutTitleEl = document.querySelector('#about .section-title');
    if (aboutTitleEl) {
      // Find the last word and wrap it in a span tag for styled red color
      const titleWords = settings.aboutTitle.split(' ');
      if (titleWords.length > 1) {
        const lastWord = titleWords.pop();
        aboutTitleEl.innerHTML = titleWords.join(' ') + ` <span>${lastWord}</span>`;
      } else {
        aboutTitleEl.innerHTML = `<span>${settings.aboutTitle}</span>`;
      }
    }
    
    const aboutSubtitleEl = document.querySelector('.about-subtitle');
    if (aboutSubtitleEl) aboutSubtitleEl.textContent = settings.aboutSubtitle;

    const aboutPfpEl = document.querySelector('.about-pfp-img');
    if (aboutPfpEl) aboutPfpEl.src = settings.pfpUrl;

    const aboutDescs = document.querySelectorAll('.about-description');
    if (aboutDescs.length >= 3) {
      aboutDescs[0].innerHTML = settings.aboutDesc1;
      aboutDescs[1].innerHTML = settings.aboutDesc2;
      aboutDescs[2].innerHTML = settings.aboutDesc3;
    } else if (aboutDescs.length >= 2) {
      aboutDescs[0].innerHTML = settings.aboutDesc1;
      aboutDescs[1].innerHTML = settings.aboutDesc2;
    }

    // Social buttons integration
    const youtubeBtn = document.querySelector('.social-glass-btn.youtube');
    if (youtubeBtn) youtubeBtn.href = settings.youtubeLink;

    const discordBtn = document.querySelector('.social-glass-btn.discord');
    if (discordBtn) discordBtn.href = settings.discordLink;

    const instagramBtn = document.querySelector('.social-glass-btn.instagram');
    if (instagramBtn) {
      instagramBtn.href = settings.instagramLink;
    }
  }

  // Default Spoilers list
  const defaultSpoilers = [
    {
      id: 1,
      title: "Minecraft RealSMP Trap Challenge!",
      desc: "Sneak peek of the giant redstone logic trap I built under Steve's house. Spoiler: It uses 500 TNT blocks and a secret wireless tripwire!",
      date: "Friday, June 12",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" // Looping sample video
    }
  ];

  // Load or Save spoilers to localStorage
  let spoilers = JSON.parse(localStorage.getItem('aaquif_spoilers'));
  if (!spoilers || spoilers.length === 0) {
    spoilers = defaultSpoilers;
    localStorage.setItem('aaquif_spoilers', JSON.stringify(spoilers));
  }

  // Default Mock Posts Data
  const defaultPosts = [
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
  ];

  // Get posts from LocalStorage or seed default posts
  let posts = JSON.parse(localStorage.getItem('aaquif_posts'));
  const hasMediaPost = posts && posts.some(p => p.tag === 'media');
  if (!posts || posts.length === 0 || !hasMediaPost) {
    posts = defaultPosts;
    localStorage.setItem('aaquif_posts', JSON.stringify(posts));
  }

  // Database helper functions for server synchronization
  async function loadDataFromServer() {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      
      // Update local variables
      if (data.stats) channelStats = data.stats;
      if (data.siteSettings) siteSettings = data.siteSettings;
      if (data.spoilers) spoilers = data.spoilers;
      if (data.posts) posts = data.posts;

      // Sync to localStorage
      localStorage.setItem('aaquif_stats', JSON.stringify(channelStats));
      localStorage.setItem('aaquif_site_settings', JSON.stringify(siteSettings));
      localStorage.setItem('aaquif_spoilers', JSON.stringify(spoilers));
      localStorage.setItem('aaquif_posts', JSON.stringify(posts));
      
      return true;
    } catch (err) {
      console.warn("Could not load database from backend, using localStorage cache:", err);
      return false;
    }
  }

  async function saveDataToServer() {
    const password = sessionStorage.getItem('aaquif_admin_password') || '';
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password
        },
        body: JSON.stringify({
          stats: channelStats,
          siteSettings: siteSettings,
          spoilers: spoilers,
          posts: posts
        })
      });
      if (response.status === 401) {
        showNotification("Session unauthorized. Re-authenticating...", "error");
        isAdmin = false;
        sessionStorage.removeItem('aaquif_admin');
        sessionStorage.removeItem('aaquif_admin_password');
        updateAdminUI();
        adminDashboardModal.classList.remove('active');
        loginModal.classList.add('active');
        return false;
      }
      if (!response.ok) throw new Error("Failed to save to database server.");
      return true;
    } catch (err) {
      console.error(err);
      showNotification("Saved locally. (Database server offline)", "info");
      return false;
    }
  }

  // --- DOM ELEMENTS ---
  const body = document.body;
  const interactiveCube = document.getElementById('interactiveCube');
  const cubeViewport = document.querySelector('.cube-viewport');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const feedGrid = document.getElementById('feedGrid');
  const spoilersContainer = document.getElementById('spoilersContainer');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portalTriggerBtn = document.getElementById('portalTriggerBtn');
  const creatorPfpCard = document.getElementById('creatorPfpCard');

  // Modals & Forms
  const loginModal = document.getElementById('loginModal');
  const closeLoginBtn = document.getElementById('closeLoginBtn');
  const loginForm = document.getElementById('loginForm');
  const loginPassword = document.getElementById('loginPassword');

  const adminDashboardModal = document.getElementById('adminDashboardModal');
  const closeDashboardBtn = document.getElementById('closeDashboardBtn');

  // Dashboard Pane Forms
  const adjustStatsForm = document.getElementById('adjustStatsForm');
  const uploadSpoilerForm = document.getElementById('uploadSpoilerForm');
  const createPostForm = document.getElementById('createPostForm');
  const alterSiteForm = document.getElementById('alterSiteForm');

  // Admin Banner
  const adminBanner = document.getElementById('adminBanner');
  const exitAdminBtn = document.getElementById('exitAdminBtn');
  const bannerOpenDashboardBtn = document.getElementById('bannerOpenDashboardBtn');
  const sidebarExitBtn = document.getElementById('sidebarExitBtn');

  // Manage lists & search inputs
  const adminFeedList = document.getElementById('adminFeedList');
  const adminSpoilersList = document.getElementById('adminSpoilersList');
  const adminFeedSearch = document.getElementById('adminFeedSearch');
  const adminFeedFilter = document.getElementById('adminFeedFilter');
  const dashboardPaneTitle = document.getElementById('dashboardPaneTitle');

  // Contact Form
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // --- INITIALIZE VIEWS & UI ---
  async function initApp() {
    await loadDataFromServer();
    applySiteSettingsToPage();
    updateAdminUI();
    renderPosts();
    renderSpoilers();
    applyStatsToCards();
  }
  initApp();

  // --- TABS CONTROL FOR DASHBOARD ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active class
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle pane active class
      const targetPaneId = btn.getAttribute('data-pane');
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetPaneId) {
          pane.classList.add('active');
        }
      });

      // Update Dashboard Pane Title & trigger specific renders if necessary
      const paneTitles = {
        'paneStats': 'CHANNEL METRICS & OVERVIEW',
        'paneAlterSite': 'SITE BRANDING CUSTOMIZER',
        'paneManageFeed': 'MANAGE VIDEOS & UPDATES',
        'paneManageSpoilers': 'MANAGE VIDEO TEASERS',
        'panePublish': 'PUBLISH NEW CONTENT'
      };
      if (dashboardPaneTitle && paneTitles[targetPaneId]) {
        dashboardPaneTitle.textContent = paneTitles[targetPaneId];
      }

      if (targetPaneId === 'paneManageFeed') {
        renderAdminFeedList();
      } else if (targetPaneId === 'paneManageSpoilers') {
        renderAdminSpoilersList();
      }
    });
  });

  // --- 3D INTERACTIVE CUBE (MOUSE TRACKING & CLICK THEMES) ---
  const themes = ['theme-redstone', 'theme-diamond', 'theme-emerald', 'theme-gold'];
  let currentThemeIndex = 0;

  if (cubeViewport && interactiveCube) {
    // Click to cycle channel material themes!
    cubeViewport.addEventListener('click', () => {
      themes.forEach(t => body.classList.remove(t));
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const newTheme = themes[currentThemeIndex];
      body.classList.add(newTheme);

      // Pulse scale animation
      interactiveCube.classList.add('click-pulse');
      setTimeout(() => interactiveCube.classList.remove('click-pulse'), 300);

      const themeDisplayNames = {
        'theme-redstone': 'Redstone (Crimson Suit Red)',
        'theme-diamond': 'Diamond (Sky Blue Glow)',
        'theme-emerald': 'Emerald (Resource Green)',
        'theme-gold': 'Gold (Ingot Yellow)'
      };
      showNotification(`Website theme set to: ${themeDisplayNames[newTheme]}`, 'success');
    });

    cubeViewport.addEventListener('mousemove', (e) => {
      const rect = cubeViewport.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Calculate rotation angles based on cursor offset
      const tiltX = (y / (rect.height / 2)) * -25;
      const tiltY = (x / (rect.width / 2)) * 25;

      // Overwrite CSS animation during hover, add smooth transition properties
      interactiveCube.style.animation = 'none';
      interactiveCube.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    cubeViewport.addEventListener('mouseleave', () => {
      // Resume automatic rotation
      interactiveCube.style.transform = '';
      interactiveCube.style.animation = 'rotateCube 24s linear infinite';
    });
  }

  // --- INTERSECTION OBSERVER FOR TOP NAV SYNC ---
  const sectionObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // Remove active class from all top nav links
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to corresponding nav item
        const activeNav = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeNav) {
          activeNav.classList.add('active');
        }
      }
    });
  }, sectionObserverOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // --- APPLY STATS TO DATA TARGETS ---
  function applyStatsToCards() {
    const stats = JSON.parse(localStorage.getItem('aaquif_stats')) || defaultStats;
    const cards = document.querySelectorAll('.stat-card .stat-number');
    if (cards.length >= 4) {
      cards[0].setAttribute('data-target', stats.subs);
      cards[1].setAttribute('data-target', stats.views);
      cards[2].setAttribute('data-target', stats.uploads);
      cards[3].setAttribute('data-target', stats.discord);
    }
  }

  // --- STATS COUNTER ROLLUP ANIMATION ---
  const statsSection = document.getElementById('achievements');
  let animatedStats = false;

  function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(num => {
      const target = parseFloat(num.getAttribute('data-target'));
      const suffix = num.getAttribute('data-suffix') || '';
      const duration = 1800; // ms duration
      let startTime = null;

      function updateCounter(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Easing function: easeOutQuad
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);

        // Format number beautifully
        if (target >= 1000000) {
          num.innerText = (currentValue / 1000000).toFixed(1) + 'M' + suffix;
        } else if (target >= 1000) {
          const val = (currentValue / 1000);
          num.innerText = (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'K' + suffix;
        } else {
          num.innerText = currentValue + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          // Force exact final target value display
          if (target >= 1000000) {
            num.innerText = (target / 1000000).toFixed(1) + 'M' + suffix;
          } else if (target >= 1000) {
            const finalVal = (target / 1000);
            num.innerText = (finalVal % 1 === 0 ? finalVal.toFixed(0) : finalVal.toFixed(1)) + 'K' + suffix;
          } else {
            num.innerText = target + suffix;
          }
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Observe achievements section to trigger counter animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats) {
        animateCounters();
        animatedStats = true;
      }
    });
  }, { threshold: 0.15 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // --- CUSTOM CURSOR SPOTLIGHT TRACKER ---
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  // --- SPOILERS SECTION RENDER ---
  function renderSpoilers() {
    spoilersContainer.innerHTML = '';

    if (spoilers.length === 0) {
      spoilersContainer.innerHTML = `
        <div class="glass-panel" style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-subtle);">
          <i class="fa-solid fa-clapperboard" style="font-size: 2.5rem; margin-bottom: 15px; color: var(--color-cyan-glow);"></i>
          <p>No spoilers or sneak peeks added yet.</p>
        </div>
      `;
      return;
    }

    spoilers.forEach(sp => {
      const card = document.createElement('div');
      card.className = 'spoiler-card glass-panel';
      card.setAttribute('data-id', sp.id);

      // Select fallback/source video
      const videoSource = sp.videoUrl && sp.videoUrl.trim() !== '' ? sp.videoUrl : 'https://www.w3schools.com/html/mov_bbb.mp4';

      card.innerHTML = `
        <button class="spoiler-delete-btn" title="Delete Spoiler"><i class="fa-solid fa-trash-can"></i></button>
        <div class="spoiler-badge">Sneak Peek</div>
        <h3 class="spoiler-title">${sp.title}</h3>
        
        <div class="spoiler-video-wrapper">
          <video src="${videoSource}" controls loop muted playsinline></video>
        </div>
        
        <p class="spoiler-desc">${sp.desc}</p>
        
        <div class="spoiler-meta">
          <span>Release Info:</span>
          <span class="spoiler-date">${sp.date}</span>
        </div>
      `;

      // Wire delete event
      const deleteBtn = card.querySelector('.spoiler-delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSpoiler(sp.id);
      });

      spoilersContainer.appendChild(card);
    });
  }

  function deleteSpoiler(id) {
    if (!isAdmin) return;
    if (confirm("Are you sure you want to remove this sneak peek?")) {
      spoilers = spoilers.filter(sp => sp.id !== id);
      localStorage.setItem('aaquif_spoilers', JSON.stringify(spoilers));
      renderSpoilers();
      renderAdminSpoilersList(); // Update the control panel list
      showNotification("Spoiler removed.", "info");
      saveDataToServer();
    }
  }

  // --- RENDER ADMIN FEED CONTENT MANAGER ---
  function renderAdminFeedList() {
    if (!adminFeedList) return;
    adminFeedList.innerHTML = '';

    const searchQuery = (adminFeedSearch ? adminFeedSearch.value : '').toLowerCase().trim();
    const filterTag = adminFeedFilter ? adminFeedFilter.value : 'all';

    const filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery) || post.desc.toLowerCase().includes(searchQuery);
      const matchesFilter = filterTag === 'all' || post.tag === filterTag;
      return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
      adminFeedList.innerHTML = `
        <div style="padding: 30px; text-align: center; color: var(--text-subtle);">
          <i class="fa-solid fa-circle-question" style="font-size: 1.8rem; margin-bottom: 10px; color: var(--color-red-glow);"></i>
          <p>No matching feed items found.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(post => {
      const item = document.createElement('div');
      item.className = 'admin-list-item';
      
      const imgHtml = post.img && post.img.trim() !== '' 
        ? `<img src="${post.img}" class="item-thumb" onerror="this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop'">`
        : `<div class="item-fallback-icon"><i class="fa-solid fa-photo-film"></i></div>`;

      item.innerHTML = `
        <div class="item-meta-info">
          ${imgHtml}
          <div class="item-details">
            <div class="item-title" title="${post.title}">${post.title}</div>
            <div class="item-badges">
              <span class="item-tag ${post.tag}">${post.tag}</span>
              <span class="item-date">${post.date}</span>
            </div>
          </div>
        </div>
        <button class="item-remove-btn"><i class="fa-solid fa-trash-can"></i> Remove</button>
      `;

      const removeBtn = item.querySelector('.item-remove-btn');
      removeBtn.addEventListener('click', () => {
        deletePost(post.id);
      });

      adminFeedList.appendChild(item);
    });
  }

  // --- RENDER ADMIN SPOILERS TEASERS MANAGER ---
  function renderAdminSpoilersList() {
    if (!adminSpoilersList) return;
    adminSpoilersList.innerHTML = '';

    if (spoilers.length === 0) {
      adminSpoilersList.innerHTML = `
        <div style="padding: 30px; text-align: center; color: var(--text-subtle);">
          <i class="fa-solid fa-circle-question" style="font-size: 1.8rem; margin-bottom: 10px; color: var(--color-cyan-glow);"></i>
          <p>No upcoming teasers found.</p>
        </div>
      `;
      return;
    }

    spoilers.forEach(sp => {
      const item = document.createElement('div');
      item.className = 'admin-list-item';

      item.innerHTML = `
        <div class="item-meta-info">
          <div class="item-fallback-icon"><i class="fa-solid fa-film"></i></div>
          <div class="item-details">
            <div class="item-title" title="${sp.title}">${sp.title}</div>
            <div class="item-badges">
              <span class="item-tag spoiler">Teaser</span>
              <span class="item-date">${sp.date}</span>
            </div>
          </div>
        </div>
        <button class="item-remove-btn"><i class="fa-solid fa-trash-can"></i> Remove</button>
      `;

      const removeBtn = item.querySelector('.item-remove-btn');
      removeBtn.addEventListener('click', () => {
        deleteSpoiler(sp.id);
      });

      adminSpoilersList.appendChild(item);
    });
  }

  // Bind list management search and filter events
  if (adminFeedSearch) {
    adminFeedSearch.addEventListener('input', renderAdminFeedList);
  }
  if (adminFeedFilter) {
    adminFeedFilter.addEventListener('change', renderAdminFeedList);
  }

  // --- POSTS RENDER & FILTERING ---
  function renderPosts(filter = 'all') {
    feedGrid.innerHTML = '';
    const filteredPosts = posts.filter(post => filter === 'all' || post.tag === filter);

    if (filteredPosts.length === 0) {
      feedGrid.innerHTML = `
        <div class="glass-panel" style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-subtle);">
          <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 15px; color: var(--color-red-glow);"></i>
          <p>No posts published in this category yet.</p>
        </div>
      `;
      return;
    }

    filteredPosts.forEach(post => {
      const card = document.createElement('div');
      card.className = `feed-card glass-panel`;
      card.setAttribute('data-id', post.id);

      const coverImg = post.img && post.img.trim() !== '' ? post.img : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop';
      const actionLink = post.link && post.link.trim() !== '' ? post.link : '#';

      card.innerHTML = `
        <button class="card-delete-btn" title="Delete Post"><i class="fa-solid fa-trash-can"></i></button>
        <div class="card-img-container">
          <div class="card-tag ${post.tag}">${post.tag}</div>
          <img src="${coverImg}" alt="${post.title}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop'">
        </div>
        <div class="card-content">
          <div class="card-date">${post.date}</div>
          <h3 class="card-title">${post.title}</h3>
          <p class="card-desc">${post.desc}</p>
          <a href="${actionLink}" target="_blank" class="card-link">
            READ MORE <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      `;

      const deleteBtn = card.querySelector('.card-delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deletePost(post.id);
      });

      feedGrid.appendChild(card);
    });
  }

  // Filter Buttons Interaction
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.id === 'portalTriggerBtn') return;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPosts(btn.getAttribute('data-filter'));
    });
  });

  // --- ADMIN PORTAL LOGIC ---

  // --- PREFILL BRANDING FORM INPUTS ---
  function fillAlterSiteInputs() {
    const settings = JSON.parse(localStorage.getItem('aaquif_site_settings')) || defaultSiteSettings;
    const heroTitle1El = document.getElementById('siteHeroTitle1');
    const heroTitle2El = document.getElementById('siteHeroTitle2');
    const heroDescEl = document.getElementById('siteHeroDesc');
    const pfpUrlEl = document.getElementById('sitePfpUrl');
    const aboutDesc1El = document.getElementById('siteAboutDesc1');
    const aboutDesc2El = document.getElementById('siteAboutDesc2');
    const aboutDesc3El = document.getElementById('siteAboutDesc3');
    const youtubeUrlEl = document.getElementById('siteYoutubeUrl');
    const discordUrlEl = document.getElementById('siteDiscordUrl');
    const instagramEl = document.getElementById('siteInstagram');

    if (heroTitle1El) heroTitle1El.value = settings.heroTitle1 || '';
    if (heroTitle2El) heroTitle2El.value = settings.heroTitle2 || '';
    if (heroDescEl) heroDescEl.value = settings.heroDesc || '';
    if (pfpUrlEl) pfpUrlEl.value = settings.pfpUrl || '';
    if (aboutDesc1El) aboutDesc1El.value = settings.aboutDesc1 || '';
    if (aboutDesc2El) aboutDesc2El.value = settings.aboutDesc2 || '';
    if (aboutDesc3El) aboutDesc3El.value = settings.aboutDesc3 || '';
    if (youtubeUrlEl) youtubeUrlEl.value = settings.youtubeLink || '';
    if (discordUrlEl) discordUrlEl.value = settings.discordLink || '';
    if (instagramEl) instagramEl.value = settings.instagramLink || '';
  }

  // --- ADMIN PORTAL OPEN/CLOSE TRIGGERS ---
  
  function openCreatorDashboard() {
    // Load current stats into inputs
    const stats = JSON.parse(localStorage.getItem('aaquif_stats')) || defaultStats;
    document.getElementById('statSubsInput').value = stats.subs;
    document.getElementById('statViewsInput').value = stats.views;
    document.getElementById('statVideosInput').value = stats.uploads;
    document.getElementById('statDiscordInput').value = stats.discord;

    fillAlterSiteInputs();

    // Reset default active tab to paneStats when opening
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));
    
    const defaultTab = document.querySelector('.tab-btn[data-pane="paneStats"]');
    const defaultPane = document.getElementById('paneStats');
    if (defaultTab && defaultPane) {
      defaultTab.classList.add('active');
      defaultPane.classList.add('active');
      if (dashboardPaneTitle) dashboardPaneTitle.textContent = 'CHANNEL METRICS & OVERVIEW';
    }

    adminDashboardModal.classList.add('active');
  }

  // Trigger login modal or open dashboard
  portalTriggerBtn.addEventListener('click', () => {
    if (isAdmin) {
      openCreatorDashboard();
    } else {
      loginModal.classList.add('active');
      loginPassword.focus();
    }
  });

  // Banner Control button click
  if (bannerOpenDashboardBtn) {
    bannerOpenDashboardBtn.addEventListener('click', () => {
      if (isAdmin) {
        openCreatorDashboard();
      }
    });
  }

  // Double Click avatar to bypass/login
  if (creatorPfpCard) {
    creatorPfpCard.addEventListener('dblclick', () => {
      if (!isAdmin) {
        loginModal.classList.add('active');
        loginPassword.focus();
        showNotification("Welcome back! Enter key to unlock Creator Portal.", "info");
      } else {
        openCreatorDashboard();
      }
    });
  }

  // Close Modals
  closeLoginBtn.addEventListener('click', () => {
    loginModal.classList.remove('active');
    loginForm.reset();
  });

  closeDashboardBtn.addEventListener('click', () => {
    adminDashboardModal.classList.remove('active');
    adjustStatsForm.reset();
    uploadSpoilerForm.reset();
    createPostForm.reset();
  });

  // Close modals on clicking overlay background
  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.classList.remove('active');
      loginForm.reset();
    }
    if (e.target === adminDashboardModal) {
      adminDashboardModal.classList.remove('active');
      adjustStatsForm.reset();
      uploadSpoilerForm.reset();
      createPostForm.reset();
    }
  });

  // Form Submit: Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const enteredPass = loginPassword.value.trim();

    // Authenticate with server if possible
    let authSuccess = false;
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: enteredPass })
      });
      if (response.ok) {
        authSuccess = true;
      }
    } catch (err) {
      // Fallback to client check if server is offline
      if (enteredPass === defaultPassword) {
        authSuccess = true;
      }
    }

    if (authSuccess) {
      isAdmin = true;
      sessionStorage.setItem('aaquif_admin', 'true');
      sessionStorage.setItem('aaquif_admin_password', enteredPass);
      updateAdminUI();
      loginModal.classList.remove('active');
      loginForm.reset();
      showNotification("Creator Dashboard unlocked!", "success");

      // Automatically open dashboard
      setTimeout(() => {
        openCreatorDashboard();
      }, 500);
    } else {
      showNotification("Access denied. Incorrect key code.", "error");
      loginPassword.classList.add('shake');
      setTimeout(() => loginPassword.classList.remove('shake'), 500);
    }
  });

  // Form Submit 1: Adjust stats metrics
  adjustStatsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedStats = {
      subs: parseInt(document.getElementById('statSubsInput').value),
      views: parseInt(document.getElementById('statViewsInput').value),
      uploads: parseInt(document.getElementById('statVideosInput').value),
      discord: parseInt(document.getElementById('statDiscordInput').value)
    };

    channelStats = updatedStats;
    localStorage.setItem('aaquif_stats', JSON.stringify(channelStats));
    applyStatsToCards();

    // Trigger rollup counter redraw
    animatedStats = false;
    animateCounters();
    animatedStats = true;

    adminDashboardModal.classList.remove('active');
    showNotification("Milestone statistics updated in real-time!", "success");
    saveDataToServer();
  });

  // Form Submit 2: Alter Site Customizer
  if (alterSiteForm) {
    alterSiteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newSettings = {
        settingsVersion: 3,
        heroTag: "OFFICIAL YOUTUBE PORTAL",
        heroTitle1: document.getElementById('siteHeroTitle1').value.trim(),
        heroTitle2: document.getElementById('siteHeroTitle2').value.trim(),
        heroDesc: document.getElementById('siteHeroDesc').value.trim(),
        aboutTitle: "THE ORIGIN", 
        aboutSubtitle: "CREATOR PORTRAIT // REAL AAQUIF",
        aboutDesc1: document.getElementById('siteAboutDesc1').value.trim(),
        aboutDesc2: document.getElementById('siteAboutDesc2').value.trim(),
        aboutDesc3: document.getElementById('siteAboutDesc3').value.trim(),
        youtubeLink: document.getElementById('siteYoutubeUrl').value.trim(),
        discordLink: document.getElementById('siteDiscordUrl').value.trim(),
        instagramLink: document.getElementById('siteInstagram').value.trim(),
        pfpUrl: document.getElementById('sitePfpUrl').value.trim()
      };

      // Ensure some defaults for About title/subtitle if not available
      const currentSettings = JSON.parse(localStorage.getItem('aaquif_site_settings')) || defaultSiteSettings;
      newSettings.aboutTitle = currentSettings.aboutTitle || defaultSiteSettings.aboutTitle;
      newSettings.aboutSubtitle = currentSettings.aboutSubtitle || defaultSiteSettings.aboutSubtitle;
      newSettings.heroTag = currentSettings.heroTag || defaultSiteSettings.heroTag;

      siteSettings = newSettings;
      localStorage.setItem('aaquif_site_settings', JSON.stringify(siteSettings));
      applySiteSettingsToPage();

      adminDashboardModal.classList.remove('active');
      showNotification("Site branding updated successfully!", "success");
      saveDataToServer();
    });
  }

  // Form Submit 3: Upload Spoilers
  uploadSpoilerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const titleVal = document.getElementById('spoilerTitle').value.trim();
    const dateVal = document.getElementById('spoilerDate').value.trim();
    const descVal = document.getElementById('spoilerDesc').value.trim();
    const youtubeUrlVal = document.getElementById('spoilerYoutubeUrl').value.trim();
    const fileInput = document.getElementById('spoilerVideoFile');

    let videoUrlResult = youtubeUrlVal;

    // Handle local file preview
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      videoUrlResult = URL.createObjectURL(file);
    }

    const newSpoiler = {
      id: Date.now(),
      title: titleVal,
      date: dateVal,
      desc: descVal,
      videoUrl: videoUrlResult
    };

    spoilers.unshift(newSpoiler);
    localStorage.setItem('aaquif_spoilers', JSON.stringify(spoilers));
    renderSpoilers();
    renderAdminSpoilersList();

    adminDashboardModal.classList.remove('active');
    uploadSpoilerForm.reset();
    showNotification("Upcoming spoiler snippet published!", "success");
    saveDataToServer();
  });

  // Form Submit 4: Create Feed Post
  createPostForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newPost = {
      id: Date.now(),
      title: document.getElementById('postTitle').value.trim(),
      tag: document.getElementById('postTag').value,
      link: document.getElementById('postLink').value.trim(),
      img: document.getElementById('postImg').value.trim(),
      desc: document.getElementById('postDesc').value.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
    };

    posts.unshift(newPost);
    localStorage.setItem('aaquif_posts', JSON.stringify(posts));

    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter') || 'all';
    renderPosts(activeFilter);
    renderAdminFeedList();

    adminDashboardModal.classList.remove('active');
    createPostForm.reset();
    showNotification("New feed update published successfully!", "success");
    saveDataToServer();
  });

  // --- PUBLISH TYPE SELECTOR ---
  const btnTypeFeed = document.getElementById('btnTypeFeed');
  const btnTypeSpoiler = document.getElementById('btnTypeSpoiler');
  const createPostFormEl = document.getElementById('createPostForm');
  const uploadSpoilerFormEl = document.getElementById('uploadSpoilerForm');

  if (btnTypeFeed && btnTypeSpoiler) {
    btnTypeFeed.addEventListener('click', () => {
      btnTypeFeed.classList.add('active');
      btnTypeSpoiler.classList.remove('active');
      createPostFormEl.classList.add('active');
      uploadSpoilerFormEl.classList.remove('active');
    });

    btnTypeSpoiler.addEventListener('click', () => {
      btnTypeSpoiler.classList.add('active');
      btnTypeFeed.classList.remove('active');
      uploadSpoilerFormEl.classList.add('active');
      createPostFormEl.classList.remove('active');
    });
  }

  // Delete Post
  function deletePost(id) {
    if (!isAdmin) return;
    if (confirm("Are you sure you want to remove this update?")) {
      posts = posts.filter(post => post.id !== id);
      localStorage.setItem('aaquif_posts', JSON.stringify(posts));

      const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter') || 'all';
      renderPosts(activeFilter);
      renderAdminFeedList(); // Refresh admin manager list
      showNotification("Update deleted.", "info");
      saveDataToServer();
    }
  }

  // Exit Admin Mode (Banner)
  exitAdminBtn.addEventListener('click', () => {
    isAdmin = false;
    sessionStorage.removeItem('aaquif_admin');
    sessionStorage.removeItem('aaquif_admin_password');
    updateAdminUI();
    showNotification("Logged out from Creator Portal.", "info");
  });

  // Exit Admin Mode (Sidebar)
  if (sidebarExitBtn) {
    sidebarExitBtn.addEventListener('click', () => {
      isAdmin = false;
      sessionStorage.removeItem('aaquif_admin');
      sessionStorage.removeItem('aaquif_admin_password');
      updateAdminUI();
      adminDashboardModal.classList.remove('active');
      showNotification("Logged out from Creator Portal.", "info");
    });
  }

  // Update DOM depending on Admin State
  function updateAdminUI() {
    if (isAdmin) {
      body.classList.add('admin-mode-active');
      portalTriggerBtn.innerHTML = '<i class="fa-solid fa-square-plus"></i> CREATOR PORTAL';
      portalTriggerBtn.style.borderColor = 'var(--color-cyan)';
      portalTriggerBtn.style.color = 'var(--color-cyan)';
    } else {
      body.classList.remove('admin-mode-active');
      portalTriggerBtn.innerHTML = '<i class="fa-solid fa-lock"></i> CREATOR PORTAL';
      portalTriggerBtn.style.borderColor = 'rgba(209, 26, 42, 0.4)';
      portalTriggerBtn.style.color = 'var(--color-red-bright)';
    }
  }

  // --- CONTACT FORM SUBMISSION ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origBtnContent = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'SENDING MESSAGE <i class="fa-solid fa-circle-notch fa-spin"></i>';

      setTimeout(() => {
        const senderName = document.getElementById('formName').value.trim();

        formStatus.className = 'form-status success';
        formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${senderName}</strong>! Your message was submitted successfully via your Gmail simulation. Aaquif will review it shortly.`;

        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnContent;
        contactForm.reset();

        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 8000);
      }, 1500);
    });
  }

  // --- SHIFT + A SHORTCUT TO OPEN PORTAL ---
  document.addEventListener('keydown', (e) => {
    // Only trigger if Shift + A is pressed and the user is not focused on an input element
    if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);

      if (!isInput) {
        e.preventDefault();
        if (isAdmin) {
          // Open dashboard directly if already admin
          const stats = JSON.parse(localStorage.getItem('aaquif_stats')) || defaultStats;
          document.getElementById('statSubsInput').value = stats.subs;
          document.getElementById('statViewsInput').value = stats.views;
          document.getElementById('statVideosInput').value = stats.uploads;
          document.getElementById('statDiscordInput').value = stats.discord;

          adminDashboardModal.classList.add('active');
          showNotification("Creator Dashboard opened via Shift + A shortcut.", "success");
        } else {
          loginModal.classList.add('active');
          loginPassword.focus();
          showNotification("Welcome back! Enter key to unlock Creator Portal.", "info");
        }
      }
    }
  });

  // --- HEURISTIC TOAST NOTIFICATIONS ---
  function showNotification(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = '8px';
    toast.style.color = 'white';
    toast.style.fontFamily = 'var(--font-body)';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '500';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.transition = 'all 0.3s ease';
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    toast.style.backdropFilter = 'blur(10px)';

    let icon = '<i class="fa-solid fa-circle-info"></i>';
    if (type === 'success') {
      toast.style.background = 'rgba(46, 117, 89, 0.9)';
      toast.style.border = '1px solid #10b981';
      icon = '<i class="fa-solid fa-circle-check"></i>';
    } else if (type === 'error') {
      toast.style.background = 'rgba(163, 31, 46, 0.9)';
      toast.style.border = '1px solid #ef4444';
      icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    } else {
      toast.style.background = 'rgba(22, 8, 11, 0.95)';
      toast.style.border = '1px solid rgba(255,255,255,0.1)';
    }

    toast.innerHTML = `${icon} ${msg}`;
    body.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --- SCROLL REVEAL OBSERVER ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserverOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      } else {
        entry.target.classList.remove('revealed');
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // --- SHIFT + B SHORTCUT TO OPEN STAFF PANEL ---
  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && (e.key === 'B' || e.key === 'b')) {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);

      if (!isInput) {
        e.preventDefault();
        window.open('/staff', '_blank');
        showNotification("Opening Staff Support Portal...", "success");
      }
    }
  });

  // --- USER SUPPORT CHAT WIDGET LOGIC ---
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatBox = document.getElementById('chatBox');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatSetupPane = document.getElementById('chatSetupPane');
  const chatSetupForm = document.getElementById('chatSetupForm');
  const chatUserNameInput = document.getElementById('chatUserNameInput');
  const chatMessagesPane = document.getElementById('chatMessagesPane');
  const chatMessagesList = document.getElementById('chatMessagesList');
  const chatInputForm = document.getElementById('chatInputForm');
  const chatMessageInput = document.getElementById('chatMessageInput');
  const staffAssignedTag = document.getElementById('staffAssignedTag');
  const chatNotificationBadge = document.getElementById('chatNotificationBadge');

  let chatSessionId = localStorage.getItem('aaquif_chat_session_id');
  let chatUserName = localStorage.getItem('aaquif_chat_user_name');
  let chatPollInterval = null;
  let unreadCount = 0;
  let lastMessageCount = 0;

  // Toggle Chat Box
  if (chatToggleBtn && chatBox) {
    chatToggleBtn.addEventListener('click', () => {
      const isActive = chatBox.classList.toggle('active');
      if (isActive) {
        chatBox.style.display = 'flex';
        // Clear badge
        unreadCount = 0;
        chatNotificationBadge.style.display = 'none';
        chatNotificationBadge.textContent = '0';
        
        // Setup or Load
        if (chatSessionId && chatUserName) {
          chatSetupPane.style.display = 'none';
          chatMessagesPane.style.display = 'flex';
          loadChatMessages();
          startPollingMessages();
        } else {
          chatSetupPane.style.display = 'block';
          chatMessagesPane.style.display = 'none';
          chatUserNameInput.focus();
        }
      } else {
        chatBox.style.display = 'none';
        stopPollingMessages();
      }
    });
  }

  if (chatCloseBtn && chatBox) {
    chatCloseBtn.addEventListener('click', () => {
      chatBox.classList.remove('active');
      chatBox.style.display = 'none';
      stopPollingMessages();
    });
  }

  // Register Session
  if (chatSetupForm) {
    chatSetupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = chatUserNameInput.value.trim();
      if (!name) return;

      try {
        const response = await fetch('/api/chat/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name })
        });
        if (response.ok) {
          const chat = await response.json();
          chatSessionId = chat.sessionId;
          chatUserName = chat.userName;
          localStorage.setItem('aaquif_chat_session_id', chatSessionId);
          localStorage.setItem('aaquif_chat_user_name', chatUserName);

          chatSetupPane.style.display = 'none';
          chatMessagesPane.style.display = 'flex';
          
          renderChatMessages(chat.messages, chat.assignedStaffName);
          startPollingMessages();
        } else {
          showNotification("Could not start support session.", "error");
        }
      } catch (err) {
        console.error("Chat register error:", err);
        showNotification("Support server offline.", "error");
      }
    });
  }

  // Reset Chat Session
  function resetChatSession() {
    chatSessionId = null;
    chatUserName = null;
    localStorage.removeItem('aaquif_chat_session_id');
    localStorage.removeItem('aaquif_chat_user_name');
    stopPollingMessages();
    chatSetupPane.style.display = 'block';
    chatMessagesPane.style.display = 'none';
    chatUserNameInput.value = '';
    if (staffAssignedTag) {
      staffAssignedTag.textContent = 'Connecting...';
    }
  }

  // Send Message
  if (chatInputForm) {
    chatInputForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = chatMessageInput.value.trim();
      if (!text || !chatSessionId) return;

      // Clear input immediately
      chatMessageInput.value = '';

      try {
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: chatSessionId, text: text })
        });
        if (response.ok) {
          const data = await response.json();
          renderChatMessages(data.chat.messages, data.chat.assignedStaffName);
        } else if (response.status === 404) {
          resetChatSession();
          showNotification("Support session expired. Please start a new session.", "error");
        }
      } catch (err) {
        console.error("Message send failure:", err);
      }
    });
  }

  // Start / Stop Polling
  function startPollingMessages() {
    stopPollingMessages(); // ensure no double intervals
    chatPollInterval = setInterval(loadChatMessages, 3000);
  }

  function stopPollingMessages() {
    if (chatPollInterval) {
      clearInterval(chatPollInterval);
      chatPollInterval = null;
    }
  }

  // Load Messages
  async function loadChatMessages() {
    if (!chatSessionId) return;
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${chatSessionId}`);
      if (response.ok) {
        const chat = await response.json();
        renderChatMessages(chat.messages, chat.assignedStaffName);
      } else if (response.status === 404) {
        resetChatSession();
      }
    } catch (err) {
      console.error("Messages fetch failure:", err);
    }
  }

  // Render Messages
  function renderChatMessages(messages, staffName) {
    if (staffAssignedTag) {
      staffAssignedTag.textContent = staffName ? `Assigned Staff: ${staffName}` : 'Connecting...';
    }

    const isScrolledToBottom = chatMessagesList.scrollHeight - chatMessagesList.clientHeight <= chatMessagesList.scrollTop + 60;

    // Increment notification badge if chat window is closed and message count increased
    if (messages.length > lastMessageCount) {
      if (lastMessageCount > 0 && chatBox.style.display !== 'flex') {
        const latestMsg = messages[messages.length - 1];
        if (latestMsg.sender !== 'user') {
          unreadCount += (messages.length - lastMessageCount);
          chatNotificationBadge.textContent = unreadCount;
          chatNotificationBadge.style.display = 'flex';
          showNotification(`Support Reply: "${latestMsg.text.substring(0, 25)}..."`, "info");
        }
      }
      lastMessageCount = messages.length;
    }

    chatMessagesList.innerHTML = '';
    messages.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble-msg ${msg.sender}`;
      
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      bubble.innerHTML = `
        <div class="chat-bubble-meta">
          <span class="chat-bubble-sender">${msg.senderName}</span>
          <span class="chat-bubble-time">${time}</span>
        </div>
        <div class="chat-bubble-text">${msg.text}</div>
      `;
      chatMessagesList.appendChild(bubble);
    });

    if (isScrolledToBottom || chatMessagesList.children.length <= 2) {
      chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
    }
  }

  // Poll in background even if closed just to check for new staff responses
  setInterval(() => {
    if (chatSessionId && chatBox.style.display !== 'flex') {
      loadChatMessages();
    }
  }, 5000);

});
