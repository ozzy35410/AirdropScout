# 🧪 Programs Feature - Visual Testing Guide

## Quick Test Steps

### 1️⃣ Navigate to Programs Section
```
1. Open: http://localhost:5173 (or live URL)
2. Click "Tasks" in main navigation
3. Scroll down past Base/Sei/Giwa/Pharos tasks
4. See purple gradient "Programs" header
```

**Expected**: Beautiful purple-to-blue gradient header with title "Programs"

---

### 2️⃣ Verify All 6 Program Cards

Each card should have:
- ✅ Program name (bold, large)
- ✅ Tags (gray badges)
- ✅ Progress counter (e.g., "Completed: 0/4")
- ✅ Social icon (X logo, clickable)
- ✅ Blue "Open" button
- ✅ Task list with checkboxes

#### Card 1: Neura Protocol
```
Name: Neura Protocol
Tags: xp, faucet, swap, bridge, social
Tasks: 4 tasks
  □ Claim daily faucet (Daily task badge)
  □ Swap tokens
  □ Bridge tokens
  □ Do social tasks for XP
Social: ✓ (X icon)
Invite Code: None
```

#### Card 2: Nitrograph
```
Name: Nitrograph
Tags: xp, daily, social
Tasks: 2 tasks
  □ Daily check-in for XP / $NITRO (Daily task badge)
  □ Complete social missions
Social: ✓ (X icon)
Invite Code: ✓ "K175LH9L" (purple pill)
```

#### Card 3: Huddle
```
Name: Huddle
Tags: daily, hp, social
Tasks: 2 tasks
  □ Do social tasks
  □ Join meetings (target 8h/day) to earn $HP (Daily task badge + external link icon)
Social: ✓ (X icon)
Invite Code: None
```

#### Card 4: Incentiv
```
Name: Incentiv
Tags: faucet, swap, send, xp
Tasks: 3 tasks
  □ Claim daily test tokens (Daily task badge)
  □ Swap tokens
  □ Send tokens to any address
Social: ✓ (X icon)
Invite Code: None
```

#### Card 5: idOS
```
Name: idOS
Tags: identity, daily, social
Tasks: 4 tasks
  □ Sign up
  □ Mobile humanity verification
  □ Telegram & X tasks
  □ Daily check-in for points (Daily task badge)
Social: ✓ (X icon)
Invite Code: None
```

#### Card 6: Soneium
```
Name: Soneium
Tags: season, activity, nft
Tasks: 3 tasks
  □ Seasonal quests (on-chain)
  □ Daily activity (small transactions) (Daily task badge)
  □ Mint the season NFT
Social: ✓ (X icon)
Invite Code: None
```

---

### 3️⃣ Test Task Completion

#### Basic Checkbox Test
```
1. Click any task checkbox (should fill with green checkmark)
2. Card background turns green
3. Progress counter updates: "Completed: 1/4"
4. Reload page (Ctrl+R)
5. Verify checkbox still checked
```

**Expected**: 
- ✅ Green checkmark appears
- ✅ Progress persists after reload
- ✅ Green background on completed task

#### Uncheck Test
```
1. Click same checkbox again
2. Should uncheck
3. Progress decrements
4. Reload page
5. Verify unchecked
```

---

### 4️⃣ Test Address Tracking

#### Test Different Addresses
```
1. In "Track by Address" input at top, paste:
   0x1111111111111111111111111111111111111111

2. Scroll to Programs
3. Check some tasks (e.g., Neura Protocol → Swap)
4. Note progress (e.g., "Completed: 1/4")

5. Change address to:
   0x2222222222222222222222222222222222222222

6. Scroll to Programs
7. Verify all tasks unchecked (different address)
8. Check different tasks

9. Switch back to first address:
   0x1111111111111111111111111111111111111111

10. Verify original progress restored
```

**Expected**:
- ✅ Each address has isolated progress
- ✅ Switching address shows different states
- ✅ Progress persists per address

---

### 5️⃣ Test External Links

#### Test "Open" Button
```
1. Click blue "Open" button on Neura Protocol card
2. Should open: https://neuraverse.neuraprotocol.io
3. Verify new tab opens
4. Repeat for all 6 programs
```

**Expected URLs**:
1. Neura: https://neuraverse.neuraprotocol.io
2. Nitrograph: https://community.nitrograph.com/app/missions
3. Huddle: https://testnet.huddle01.com/r/0x5583ba39732db8006938A83BF64BBB029A0b12A0
4. Incentiv: https://testnet.incentiv.io/login?refCode=9hNV9reoKaURoTJHAAQjzJ
5. idOS: https://app.idos.network?ref=3C276CCF
6. Soneium: https://portal.soneium.org

#### Test Social Icons
```
1. Click X icon on any card
2. Should open Twitter/X profile
3. Verify new tab opens
```

**Expected X URLs**:
1. Neura: https://x.com/Neura_io
2. Nitrograph: https://x.com/Nitrograph
3. Huddle: https://x.com/huddle01com
4. Incentiv: https://x.com/Incentiv_net
5. idOS: https://x.com/idOS_network
6. Soneium: https://x.com/soneium

#### Test Task-Specific Links
```
1. Find Huddle card
2. Find task: "Join meetings (target 8h/day) to earn $HP"
3. Click small external link icon on right
4. Should open: https://huddle01.app/room/cey-zyrk-wtu/lobby
```

---

### 6️⃣ Test Daily Task Reset

#### Manual UTC Reset Test
```javascript
// Open DevTools Console (F12)

// 1. Complete a daily task normally (click checkbox)
// 2. Then run this to set timestamp to yesterday:
const key = 'progress__anon__neura-protocol__daily-faucet';
const yesterday = Date.now() - 86400000; // 24h ago
localStorage.setItem(key, JSON.stringify({
  completed: true,
  timestamp: yesterday
}));

// 3. Reload page
location.reload();

// 4. Expected: Task should be unchecked (reset due to old date)
```

#### Verify Same-Day Persistence
```javascript
// 1. Check a daily task
// 2. Run this to verify it's stored:
const key = 'progress__anon__neura-protocol__daily-faucet';
console.log(JSON.parse(localStorage.getItem(key)));
// Should show: { completed: true, timestamp: <recent timestamp> }

// 3. Reload page
// 4. Expected: Still checked (same UTC day)
```

---

### 7️⃣ Test Language Switch

#### English → Turkish
```
1. Set language to Turkish (if your app has language switcher)
2. Verify Programs section shows:
   - "Programlar" (instead of "Programs")
   - "Aç" (instead of "Open")
   - "Davet kodu" (instead of "Invite code")
   - "Tamamlandı" (instead of "Completed")
   - "Günlük görev (00:00 UTC'de sıfırlanır)" (daily task badge)

3. Verify task titles in Turkish (e.g., "Günlük faucet al")
```

---

### 8️⃣ Test Mobile Responsive

#### Mobile View (< 768px)
```
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 Pro or similar
4. Scroll to Programs section

Expected:
- ✅ Cards stack vertically (1 column)
- ✅ All buttons remain clickable
- ✅ Text remains readable
- ✅ No horizontal scroll
- ✅ Tag badges wrap properly
```

#### Tablet View (768px - 1024px)
```
1. Set viewport to iPad (820px)

Expected:
- ✅ 2-column grid (lg:grid-cols-2)
- ✅ Cards side-by-side
```

#### Desktop View (> 1024px)
```
1. Set viewport to 1920px

Expected:
- ✅ 2-column grid maintained
- ✅ Proper spacing between cards
```

---

### 9️⃣ Test LocalStorage Inspection

#### View Progress Data
```javascript
// Open DevTools → Console

// 1. View all progress entries
Object.keys(localStorage)
  .filter(key => key.startsWith('progress__'))
  .forEach(key => {
    const data = JSON.parse(localStorage[key]);
    console.log(key);
    console.log('  Completed:', data.completed);
    console.log('  Date:', new Date(data.timestamp).toLocaleString());
  });

// 2. Count completed tasks
const completed = Object.keys(localStorage)
  .filter(key => key.startsWith('progress__'))
  .map(key => JSON.parse(localStorage[key]))
  .filter(data => data.completed)
  .length;
console.log('Total completed tasks:', completed);

// 3. Clear all progress (for testing)
Object.keys(localStorage)
  .filter(key => key.startsWith('progress__'))
  .forEach(key => localStorage.removeItem(key));
console.log('Progress cleared!');
```

---

### 🔟 Browser Compatibility

Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

---

## ✅ Final Checklist

Before marking complete, verify:

### Visual
- [ ] All 6 program cards visible
- [ ] Purple gradient header looks good
- [ ] Invite code pill on Nitrograph card
- [ ] Orange "Daily task" badges on correct tasks
- [ ] Social icons render correctly
- [ ] Tag badges display properly
- [ ] Progress counters accurate

### Functionality
- [ ] Checkboxes toggle correctly
- [ ] Progress persists after reload
- [ ] Address switching works
- [ ] "Open" buttons open correct URLs
- [ ] Social icons open X profiles
- [ ] Task-specific links work (Huddle)
- [ ] Daily tasks reset at UTC midnight

### Data
- [ ] LocalStorage keys formatted correctly
- [ ] Timestamps saved properly
- [ ] Anonymous user support works
- [ ] Multiple addresses isolated

### i18n
- [ ] English strings show correctly
- [ ] Turkish strings show correctly
- [ ] No hardcoded text visible
- [ ] Language switching works

### Responsive
- [ ] Mobile view (1 column)
- [ ] Tablet view (2 columns)
- [ ] Desktop view (2 columns)
- [ ] No overflow issues

### Security
- [ ] Links open with `target="_blank"`
- [ ] Links have `noopener,noreferrer`
- [ ] No wallet connect triggered
- [ ] No external API calls made
- [ ] LocalStorage quota not exceeded

---

## 🐛 Common Issues

### Issue: Tasks not persisting
**Check**: Browser allows localStorage
**Fix**: Test in normal mode (not incognito)

### Issue: Daily tasks not resetting
**Check**: System clock is correct
**Fix**: Use browser DevTools to manually set old timestamp

### Issue: Address switching not working
**Check**: Input has valid address format
**Fix**: Use format: 0x + 40 hex characters

### Issue: Cards not appearing
**Check**: Browser console for errors
**Fix**: Verify all files imported correctly

---

## 📊 Expected Performance

- **Initial render**: < 100ms
- **Checkbox toggle**: Instant (no lag)
- **Address switch**: < 50ms
- **Page reload**: Progress restored in < 10ms

---

**Testing Completed**: ____________________  
**Tester**: ____________________  
**Date**: ____________________  
**Result**: ⭐⭐⭐⭐⭐ / 5
