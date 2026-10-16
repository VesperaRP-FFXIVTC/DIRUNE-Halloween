document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 自訂魔法風格 Modal Alert
    // ==========================================
    const magicAlert = document.getElementById("magic-alert-modal");
    const magicAlertMsg = document.getElementById("magic-alert-message");
    const magicAlertBtn = document.getElementById("magic-alert-btn");

    const magicAlertTitle = magicAlert ? magicAlert.querySelector(".alert-title") : null;
    // type：success 成功 / error 錯誤 / warn 提醒（會換成對應的標題與按鈕文字）
    const ALERT_STYLES = {
        success: { title: "🔮 契約完成 🔮", btn: "踏上旅途" },
        error:   { title: "⚠️ 魔法失靈 ⚠️", btn: "再試一次" },
        warn:    { title: "📜 魔法陣的提醒 📜", btn: "知道了" }
    };
    function showMagicAlert(message, type = "error") {
        if (magicAlert && magicAlertMsg) {
            const st = ALERT_STYLES[type] || ALERT_STYLES.error;
            magicAlertMsg.innerHTML = message;
            if (magicAlertTitle) magicAlertTitle.textContent = st.title;
            if (magicAlertBtn) magicAlertBtn.textContent = st.btn;
            magicAlert.dataset.type = type;
            magicAlert.style.display = "flex";
        }
    }

    // 點擊「踏上旅途」關閉
    if (magicAlertBtn) {
        magicAlertBtn.addEventListener("click", () => {
            magicAlert.style.display = "none";
        });
    }
    // ==========================================
    // 1. 導覽列分頁切換邏輯
    // ==========================================
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".page-section");

    navButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); // 防止網址列加上 # 造成跳轉

            // 移除所有按鈕的 active 狀態
            navButtons.forEach(b => b.classList.remove("active"));
            // 將點擊的按鈕設為 active
            btn.classList.add("active");

            // 取得目標區塊的 id，並切換顯示
            const targetId = btn.getAttribute("data-target");
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add("active");
                } else {
                    section.classList.remove("active");
                }
            });
            
            // 手機版自動捲動到最上方
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    // ==========================================
    // 額外按鈕的分頁切換邏輯 (玩法介紹區塊的按鈕)
    // ==========================================
    const actionLinks = document.querySelectorAll(".action-link");
    actionLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            
            // 同步更新上方導覽列的 Active 狀態
            navButtons.forEach(b => {
                if (b.getAttribute("data-target") === targetId) {
                    b.classList.add("active");
                } else {
                    b.classList.remove("active");
                }
            });

            // 切換區塊顯示
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add("active");
                } else {
                    section.classList.remove("active");
                }
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // ==========================================
    // 2. 音樂控制邏輯 (從上面移出來，獨立運作)
    // ==========================================
    const bgm = document.getElementById("bgm");
    const musicBtn = document.getElementById("music-btn");
    let isPlaying = false;

    // 點擊按鈕時播放或暫停
    musicBtn.addEventListener("click", () => {
        if (isPlaying) {
            bgm.pause();
            musicBtn.textContent = "🎵 播放音樂";
        } else {
            bgm.play();
            musicBtn.textContent = "🔊 暫停音樂";
        }
        isPlaying = !isPlaying;
    });

    // 突破自動播放限制：使用者第一次點擊網頁任何地方時，順勢播放
    document.body.addEventListener("click", () => {
        if (!isPlaying) {
            bgm.play().then(() => {
                isPlaying = true;
                musicBtn.textContent = "🔊 暫停音樂";
            }).catch((error) => {
                console.log("瀏覽器阻擋自動播放，需等待使用者手動點擊按鈕");
            });
        }
    }, { once: true });
// ==========================================
    // 圖片點擊放大邏輯 (Lightbox)
    // ==========================================
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("enlarged-img");
    const closeModal = document.querySelector(".close-modal");
    const mapPreview = document.getElementById("map-preview");

    if (mapPreview) {
        mapPreview.addEventListener("click", function() {
            modal.style.display = "flex"; // 顯示燈箱
            
            // 檢查裡面有沒有真的圖片 (img 標籤)
            const imgElement = this.querySelector("img");
            if (imgElement) {
                // 如果有放圖片，就抓取該圖片的路徑
                modalImg.src = imgElement.src;
            } else {
                // 如果還是預留區，先顯示一張系統佔位圖
                modalImg.src = "https://via.placeholder.com/800x600/1a1525/ff7300?text=Map+Coming+Soon...";
            }
        });
    }

    // 點擊 (X) 關閉按鈕，隱藏燈箱
    if (closeModal) {
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    // 點擊燈箱的黑色背景也能關閉
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
 // ==========================================
    // 您的 Google Apps Script API 網址
    // ==========================================
    const API_URL = "https://script.google.com/macros/s/AKfycbzhmLK2BTTQQ4hej4SHwhzOgYWhoI5u29c4d6iDeaWyFz97ydRNYbCC32hUnJ129_0Wdw/exec";

    // ==========================================
    // 魔書啟動邏輯 (點擊魔法陣 -> 顯示輸入框 -> 啟動)
    // ==========================================
    const awakenCircleBtn = document.getElementById("awaken-circle-btn");
    const bookInputGroup = document.getElementById("book-input-group");
    const enterBookBtn = document.getElementById("enter-book-btn");
    const confirmCodeInput = document.getElementById("confirm-code-input");

    // 1. 點擊魔法陣，顯示輸入框
    if (awakenCircleBtn && bookInputGroup) {
        awakenCircleBtn.addEventListener("click", () => {
            bookInputGroup.classList.add("show");
            
            // 讓網頁自動稍微往下滑，確保玩家能清楚看到輸入框
            setTimeout(() => {
                bookInputGroup.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 100);
        });
    }

    // 2. 驗證並開啟魔書
    if (enterBookBtn) {
        enterBookBtn.addEventListener("click", () => {
            const inputVal = confirmCodeInput.value.trim().toUpperCase();

            if (!/^[A-Z0-9]{4}$/.test(inputVal)) {
                showMagicAlert("❌ 契約碼格式錯誤！請輸入關主派發的 4 碼契約碼。");
                return;
            }

            // 先開一個空白分頁（必須在點擊當下開，否則會被瀏覽器當成彈出廣告擋掉）
            const bookWindow = window.open("", "_blank");
            const bookUrl = "grimoire.html?id=" + encodeURIComponent(inputVal);
            enterBookBtn.disabled = true;
            enterBookBtn.textContent = "驗證中…";

            fetch(`${API_URL}?action=get_stamps&code=${encodeURIComponent(inputVal)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        if (bookWindow) bookWindow.location.href = bookUrl;
                        else window.location.href = bookUrl;
                    } else {
                        if (bookWindow) bookWindow.close();
                        showMagicAlert("❌ 查無此契約碼！<br>請確認關主給你的 4 碼契約碼是否輸入正確。");
                    }
                })
                .catch(() => {
                    if (bookWindow) bookWindow.close();
                    showMagicAlert("❌ 魔力傳輸中斷，請檢查網路後再試一次。");
                })
                .finally(() => {
                    enterBookBtn.disabled = false;
                    enterBookBtn.textContent = "啟動";
                });
        });

        // 在輸入框按 Enter 也能啟動
        confirmCodeInput.addEventListener("keydown", e => {
            if (e.key === "Enter") enterBookBtn.click();
        });
    }
// ==========================================
    // 載入時段空位資料與生成按鈕 (包裝成函數)
    // ==========================================
    function loadTimeSlots() {
        const timeSlotGrid = document.getElementById("time-slot-grid");
        const timeSlotInput = document.getElementById("timeSlot");
        const playerCountSelect = document.getElementById("playerCount"); // 取得人數下拉選單
        const MAX_CAPACITY = 8;
        const timeSlots = ["21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00"];

        if (timeSlotGrid) {
            timeSlotGrid.innerHTML = `<div style="color: #a855f7; text-align: center; width: 100%;">讀取時段資料中...</div>`;
            fetch(`${API_URL}?action=get_availability`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        timeSlotGrid.innerHTML = ""; 
                        timeSlotInput.value = ""; // 清空隱藏欄位
                        
                        // 每次重新讀取時，先還原所有下拉選單的選項
                        Array.from(playerCountSelect.options).forEach(opt => {
                            opt.disabled = false;
                            opt.style.color = ""; // 恢復原本顏色
                        });
                        
                        timeSlots.forEach(slot => {
                            const booked = data.booked[slot] || 0;
                            const remaining = MAX_CAPACITY - booked;
                            
                            const btn = document.createElement("button");
                            btn.type = "button"; 
                            btn.className = "time-btn";
                            
                            if (remaining <= 0) {
                                btn.disabled = true;
                                btn.innerHTML = `<span class="time-text">${slot}</span><span class="spots-text">已滿</span>`;
                            } else {
                                btn.innerHTML = `<span class="time-text">${slot}</span><span class="spots-text">剩餘 ${remaining} 人</span>`;
                                btn.addEventListener("click", () => {
                                    // 1. 處理時段按鈕的點擊與視覺效果
                                    document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("selected"));
                                    btn.classList.add("selected");
                                    timeSlotInput.value = slot;

                                    // 2. ⭐️ 處理同行人數下拉選單的連動
                                    Array.from(playerCountSelect.options).forEach(opt => {
                                        const count = parseInt(opt.value);
                                        if (count > remaining) {
                                            // 超出剩餘人數的選項反灰禁用
                                            opt.disabled = true;
                                            opt.style.color = "rgba(255, 255, 255, 0.2)"; // 讓字體變暗 (部分瀏覽器支援)
                                        } else {
                                            // 在可用範圍內的選項保持正常
                                            opt.disabled = false;
                                            opt.style.color = "";
                                        }
                                    });

                                    // 3. 防呆機制：如果玩家「原本」選中的人數大於這個新時段的剩餘人數
                                    if (parseInt(playerCountSelect.value) > remaining) {
                                        // 自動幫他降到目前時段的最大可選人數
                                        playerCountSelect.value = remaining.toString();
                                        // 彈出我們自訂的魔法提示框告訴他
                                        showMagicAlert(`魔法陣感應到空間不足！<br>該時段僅剩 ${remaining} 個名額，已為您自動調整同行人數。`, "warn");
                                    }
                                });
                            }
                            timeSlotGrid.appendChild(btn);
                        });
                    }
                })
                .catch(err => {
                    timeSlotGrid.innerHTML = `<div style="color: #ef4444;">讀取失敗，請稍後重試。</div>`;
                });
        }
    }

    // 網頁初始載入時，執行一次讀取
    loadTimeSlots();

    // ==========================================
    // 報名表單提交 (寫入 Google Sheets)
    // ==========================================
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault(); 
            const submitBtn = bookingForm.querySelector('.submit-btn');
            const timeSlotInput = document.getElementById("timeSlot");
            
            // 防呆：確認玩家有選擇時段
            if (!timeSlotInput.value) {
                showMagicAlert("❌ 請先選擇一個入場時段！");
                return;
            }

            submitBtn.innerHTML = "⏳ 契約傳送中...";
            submitBtn.disabled = true;

            const formData = {
                action: 'booking',
                playerName: document.getElementById('playerName').value,
                playerDiscord: document.getElementById('playerDiscord').value,
                timeSlot: timeSlotInput.value,
                playerCount: document.getElementById('playerCount').value
            };

            fetch(API_URL, {
                method: "POST",
                body: JSON.stringify(formData)
            }).then(res => res.json()).then(res => {
                if (res.status === "success") {
                    showMagicAlert("🐾 契約簽署成功！期待您參加守護天節！", "success");
                    bookingForm.reset();
                    // ⭐️ 報名成功後，立刻重新抓取空位，按鈕會瞬間變更狀態！
                    loadTimeSlots(); 
                } else {
                    showMagicAlert("❌ 傳送失敗：" + res.message);
                }
            }).catch(err => {
                showMagicAlert("❌ 契約傳送失敗，請稍後再試。");
            }).finally(() => {
                submitBtn.innerHTML = "✍️ 簽署契約 (送出報名)";
                submitBtn.disabled = false;
            });
        });
    }
});
// ==========================================
// 惡魔懸賞令（貓咪介紹）
// ==========================================
// ⭐️ 每一隻貓一筆資料，直接改文字就好：
//    name  名字 ／ title  稱號（可省略） ／ crime  罪狀 ／ danger  危險度 1~5 ／ gil  懸賞金
//    boss: true   = 魔王的大張通緝令
//    mystery: true = 模糊剪影（神出鬼沒的 ？？？）
//    rabbit: true = 兔子彩蛋（剪影會冒出長耳朵）
// 剪影會自動使用 stamps.js 裡設定的紋章圖片；找不到圖片時顯示預設的貓咪剪影
const BOUNTIES = [
    { no: 17, boss: true, name: '紅貓魔王', danger: 5, gil: '？？？',
      crime: '包括：<br>1. 經常對著其他惡魔講幹話。<br>2. 喜歡唱各種奇怪的歌洗腦平民，例如 DJ版雨愛，森林裡的小餐館（奇諾比奧ver.）<br>3. 咏唱很長但毫無意義的咒文，需時約41秒。<br>4. 胡亂使用魔法導致一座城鎮被大火吞噬。<br>...還有約4872條，未能盡錄。' },
    { no: 1,  name: '長耳貓', danger: 1, gil: '5,000',
      crime: '偽裝成貓咪至今無人發現。' },
    { no: 2,  name: '投石機', danger: 1, gil: '5,000',
      crime: '閃耀閃耀閃耀閃耀閃耀閃耀迅速魔閃耀<br>無中生有醫養閃耀閃耀閃耀閃耀。' },
    { no: 3,  name: '健身狂人', danger: 1, gil: '5,000',
      crime: '據聞他的拳頭可以一拳打穿山體，但他的力量都用在舉啞鈴。' },
    { no: 4,  name: '打印貓', danger: 1, gil: '5,000',
      crime: '城鎮裡面每次有修路的地方，他都喜歡趁著水泥還沒乾的時候，偷偷地在上面留下自己的腳印。' },
    { no: 5,  name: '柔軟奶油貓', danger: 2, gil: '10,000',
      crime: '有貓洗澡的地方就會有他，不止偷看還會闖進去上手。' },
    { no: 6,  name: '收割師', danger: 2, gil: '10,000',
      crime: '用無辜的眼神騙走路人手上的點心。' },
    { no: 7,  name: '鎖鏈的白魔', danger: 2, gil: '10,000',
      crime: '把待在黑魔紋裡詠唱的人用營救拉出來。' },
    { no: 8,  name: '助獵者', danger: 3, gil: '20,000',
      crime: '縱容獵貓者的行為，甚至會循跡被獵貓者沾上貓毛與氣味的貓男，利用攝影技能把他們關進照片裡。' },
    { no: 9,  name: '獵貓者', danger: 3, gil: '20,000',
      crime: '喜歡在海都的以太之光旁邊等待貓男的出現，每看到一個都會跑上去蹭蹭留下自己的氣味跟貓毛，然後消失不見。' },
    { no: 10, name: '布丁審判官', danger: 3, gil: '20,000',
      crime: '所有送到面前的布丁，都得接受審判。色澤、彈性、甜度、焦糖，只要有一項不合格，就地宣判「有罪」，判決無法上訴，也沒有重審機會。至於真正好吃的——會被他一口不剩地處理掉，再淡淡補上一句：「……還有嗎？」恭喜，特赦。' },
    { no: 11, name: '天然系災厄', danger: 3, gil: '20,000',
      crime: '對其可愛程度沒有自覺，每個動作，每次出現都會導致人類停止運作約一周。' },
    { no: 12, name: '罐罐強盜', danger: 4, gil: '30,000',
      crime: '路邊遇到會打招呼的紳士貓咪，但貓手離不開對方手上的罐罐。我的罐罐是我的，你的罐罐也是我的！' },
    { no: 13, name: '奶茶神偷', danger: 4, gil: '30,000',
      crime: '說要借喝一口奶茶，最後都是直接shot掉，然後裝沒事。' },
    { no: 14, name: '恐怖炸彈客', danger: 4, gil: '30,000',
      crime: '會帶著死刑衝向人群。' },
    { no: 15, mystery: true, name: '？？？', danger: 4, gil: '50,000',
      crime: '每個嘗試揭露其身份的人都會在瞬間被無盡的黑暗吞噬，至今無人能掌握其行蹤。' },
    { no: 16, name: '魔王心腹', danger: 4, gil: '50,000',
      crime: '作為騎士，他守著魔王城的門口，但總是喜歡挑釁然後退避給補師。' }
];

// 紋章編號 → 出沒地點
function bountyPlace(n) {
    const map = { 5: '第一關', 6: '第二關', 7: '第三關', 8: '第四關', 9: '第四關', 10: '第五關',
                  11: '第六關', 12: '第七關', 13: '第七關', 14: '第八關', 15: '行蹤不明',
                  16: '魔王城', 17: '魔王城' };
    return n <= 4 ? '序章' : map[n];
}

// 找不到紋章圖片時使用的貓咪剪影
const CAT_SILHOUETTE = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 92 C22 92 20 80 24 66 C27 56 30 50 33 46 L28 20 L42 34 C47 32 53 32 58 34 L72 20 L67 46 C70 50 73 56 76 66 C80 80 78 92 70 92 Z"/><path d="M74 88 C88 86 92 72 86 62 C84 58 88 56 90 60 C97 74 90 92 74 93 Z"/></svg>`;
const BUNNY_EARS = `<svg class="bunny-ears" viewBox="0 0 60 50" aria-hidden="true"><path d="M14 50 C6 30 6 6 14 2 C22 6 22 30 20 50 Z M40 50 C38 30 38 6 46 2 C54 6 54 30 46 50 Z"/></svg>`;

document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("bountyBoard");
    if (!board) return;

    const escapeHtml = str => String(str ?? '').replace(/[&<>"']/g, ch =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    // 罪狀可以換行：寫 <br> 或 \n 都可以
    const multiline = str => escapeHtml(str).replace(/&lt;br\s*\/?&gt;/gi, '<br>').replace(/\n/g, '<br>');
    const starsOf = d => "★".repeat(d) + "☆".repeat(5 - d);

    const photoHTML = b => `
        <div class="poster-photo">
            ${b.rabbit ? BUNNY_EARS : ''}
            <img src="${stampImageUrl(b.no)}" alt="">
            ${b.mystery ? '<span class="q-mark">?</span>' : ''}
        </div>`;

    const infoHTML = b => `
        <div class="poster-head">WANTED</div>
        <div class="poster-sub">懸賞通緝 ・ No.${b.no}</div>`;

    const detailHTML = b => `
        <div class="poster-name">${escapeHtml(b.name)}</div>
        ${b.title ? `<div class="poster-title">${escapeHtml(b.title)}</div>` : ''}
        <div class="poster-danger">危險度 <span class="stars">${starsOf(b.danger)}</span></div>`;

    const crimeHTML = b => `
        <p class="poster-crime"><b>罪狀</b>${multiline(b.crime)}</p>
        <div class="poster-foot">
            <span>出沒：${bountyPlace(b.no)}</span>
            <span class="gil">懸賞 ${escapeHtml(b.gil)} Gil</span>
        </div>`;

    // 沒有紋章圖片時，換成預設貓咪剪影
    const fixImages = root => root.querySelectorAll(".poster-photo img").forEach(img => {
        img.addEventListener("error", () => { img.outerHTML = CAT_SILHOUETTE; }, { once: true });
    });

    // ----- 放大檢視視窗 -----
    const modal = document.createElement("div");
    modal.className = "bounty-modal";
    modal.innerHTML = `<button class="close-bounty" type="button" aria-label="關閉">&times;</button><div class="bounty-modal-body"></div>`;
    document.body.appendChild(modal);
    const modalBody = modal.querySelector(".bounty-modal-body");
    let lastFocus = null;

    function openPoster(b) {
        lastFocus = document.activeElement;
        modalBody.innerHTML = `
            <article class="poster full${b.mystery ? ' mystery' : ''}">
                <div class="pin"></div>
                ${infoHTML(b)}${photoHTML(b)}${detailHTML(b)}${crimeHTML(b)}
            </article>`;
        fixImages(modalBody);
        modal.classList.add("open");
        modal.querySelector(".close-bounty").focus();
    }
    function closePoster() {
        modal.classList.remove("open");
        if (lastFocus) lastFocus.focus();
    }
    modal.addEventListener("click", e => {
        if (e.target === modal || e.target.closest(".close-bounty")) closePoster();
    });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.classList.contains("open")) closePoster();
    });

    // ----- 告示板 -----
    BOUNTIES.forEach((b, i) => {
        const card = document.createElement("article");

        if (b.boss) {
            // 魔王：橫向大張，資訊全部直接顯示
            card.className = "poster boss";
            card.innerHTML = `
                <div class="pin"></div>
                ${photoHTML(b)}
                <div class="boss-info">${infoHTML(b)}${detailHTML(b)}</div>
                <div class="boss-detail">${crimeHTML(b)}</div>
                <div class="poster-stamp">最高懸賞</div>`;
        } else {
            // 一般貓：小張，點擊放大看罪狀
            card.className = "poster mini" + (b.mystery ? " mystery" : "");
            card.style.setProperty("--rot", (((i * 47) % 7) - 3) + "deg");
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `查看 ${b.name} 的通緝令`);
            card.innerHTML = `
                <div class="pin"></div>
                ${infoHTML(b)}${photoHTML(b)}
                <div class="poster-name">${escapeHtml(b.name)}</div>
                <div class="stars">${starsOf(b.danger)}</div>
                <div class="peek">點擊查看罪狀</div>`;
            card.addEventListener("click", () => openPoster(b));
            card.addEventListener("keydown", e => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPoster(b); }
            });
        }
        fixImages(card);
        board.appendChild(card);
    });
});