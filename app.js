/* ==========================================================================
   INTERACTIVE LOGIC - REAL AAQUIF PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- STATE MANAGEMENT ---
  let isAdmin = sessionStorage.getItem('aaquif_admin') === 'true';
  const defaultPassword = 'meonika143';

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

  // Admin Banner
  const adminBanner = document.getElementById('adminBanner');
  const exitAdminBtn = document.getElementById('exitAdminBtn');

  // Contact Form
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // --- INITIALIZE VIEWS & UI ---
  updateAdminUI();
  renderPosts();
  renderSpoilers();
  applyStatsToCards();

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
      showNotification("Spoiler removed.", "info");
    }
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

  // Trigger login modal
  portalTriggerBtn.addEventListener('click', () => {
    if (isAdmin) {
      // Load current stats into inputs
      const stats = JSON.parse(localStorage.getItem('aaquif_stats')) || defaultStats;
      document.getElementById('statSubsInput').value = stats.subs;
      document.getElementById('statViewsInput').value = stats.views;
      document.getElementById('statVideosInput').value = stats.uploads;
      document.getElementById('statDiscordInput').value = stats.discord;

      adminDashboardModal.classList.add('active');
    } else {
      loginModal.classList.add('active');
      loginPassword.focus();
    }
  });

  // Double Click avatar to bypass/login
  if (creatorPfpCard) {
    creatorPfpCard.addEventListener('dblclick', () => {
      if (!isAdmin) {
        loginModal.classList.add('active');
        loginPassword.focus();
        showNotification("Welcome back! Enter key to unlock Creator Portal.", "info");
      } else {
        adminDashboardModal.classList.add('active');
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
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredPass = loginPassword.value.trim().toLowerCase();

    if (enteredPass === defaultPassword) {
      isAdmin = true;
      sessionStorage.setItem('aaquif_admin', 'true');
      updateAdminUI();
      loginModal.classList.remove('active');
      loginForm.reset();
      showNotification("Creator Dashboard unlocked!", "success");

      // Automatically open dashboard
      setTimeout(() => {
        adminDashboardModal.classList.add('active');
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

    localStorage.setItem('aaquif_stats', JSON.stringify(updatedStats));
    applyStatsToCards();

    // Trigger rollup counter redraw
    animatedStats = false;
    animateCounters();
    animatedStats = true;

    adminDashboardModal.classList.remove('active');
    showNotification("Milestone statistics updated in real-time!", "success");
  });

  // Form Submit 2: Upload Spoilers
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

    adminDashboardModal.classList.remove('active');
    uploadSpoilerForm.reset();
    showNotification("Upcoming spoiler snippet published!", "success");
  });

  // Form Submit 3: Create Feed Post
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

    adminDashboardModal.classList.remove('active');
    createPostForm.reset();
    showNotification("New feed update published successfully!", "success");
  });

  // Delete Post
  function deletePost(id) {
    if (!isAdmin) return;
    if (confirm("Are you sure you want to remove this update?")) {
      posts = posts.filter(post => post.id !== id);
      localStorage.setItem('aaquif_posts', JSON.stringify(posts));

      const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter') || 'all';
      renderPosts(activeFilter);
      showNotification("Update deleted.", "info");
    }
  }

  // Exit Admin Mode
  exitAdminBtn.addEventListener('click', () => {
    isAdmin = false;
    sessionStorage.removeItem('aaquif_admin');
    updateAdminUI();
    showNotification("Logged out from Creator Portal.", "info");
  });

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

});
