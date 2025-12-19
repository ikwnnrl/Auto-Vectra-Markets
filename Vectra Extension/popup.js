// Fungsi Utama Tantangan
function injectTantangan() {
    const NILAI_WAGER = "30";
    console.log("%c[BOT] Mode Tantangan Dimulai...", "background: #27ef67; color: black; font-weight: bold; padding: 5px;");

    async function loopBet() {
        const cards = document.querySelectorAll('.predication-game-card');
        if (cards.length === 0) {
            console.log("%c[BOT] Selesai: Tantangan tidak ditemukan.", "color: red;");
            return;
        }

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (!card.offsetParent) continue;

            const yesBtn = Array.from(card.querySelectorAll('button')).find(b => b.innerText.trim().toUpperCase() === 'YES');
            if (yesBtn) {
                yesBtn.click();
                await new Promise(r => setTimeout(r, 2000));

                const input = document.getElementById('wagerInput');
                if (input) {
                    input.value = NILAI_WAGER;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log("   - Wager 30 Diisi");
                }

                await new Promise(r => setTimeout(r, 1000));
                const confirmBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim().toUpperCase() === 'CONFIRM');
                if (confirmBtn && !confirmBtn.disabled) {
                    confirmBtn.click();
                    console.log("%c   - Sukses! Jeda 10 Detik...", "color: #27ef67;");
                    await new Promise(r => setTimeout(r, 10000));
                }
            }
        }
        setTimeout(loopBet, 3000);
    }
    loopBet();
}

// Fungsi Utama Claim
function injectClaim() {
    console.log("%c[BOT] Mode Claim Dimulai...", "background: #a5a4ff; color: black; font-weight: bold; padding: 5px;");

    async function startClaim() {
        // Klik Tab Completed
        const tabs = Array.from(document.querySelectorAll('button'));
        const completedTab = tabs.find(b => b.innerText.includes('Completed'));
        if (completedTab) {
            completedTab.click();
            await new Promise(r => setTimeout(r, 3000));
        }

        async function claimLoop() {
            const claimButtons = Array.from(document.querySelectorAll('button'))
                .filter(b => b.innerText.trim().toUpperCase() === 'CLAIM' && b.offsetParent !== null);

            if (claimButtons.length === 0) {
                console.log("%c[BOT] Hadiah Habis.", "color: red;");
                return;
            }

            claimButtons[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            claimButtons[0].click();
            console.log("%c   - Claim Berhasil! Jeda 15 Detik...", "color: #a5a4ff;");
            await new Promise(r => setTimeout(r, 15000));
            claimLoop();
        }
        claimLoop();
    }
    startClaim();
}

// Listener Tombol Popup
document.getElementById('startBet').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectTantangan
    });
});

document.getElementById('startClaim').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectClaim
    });
});