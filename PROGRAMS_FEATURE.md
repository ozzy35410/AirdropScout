# 🎯 Programs Feature - XP/Airdrop Tracking

## Overview

The Programs section allows users to track their progress on various XP and airdrop programs. Each program has a set of tasks that can be completed, with progress persisted locally per tracked wallet address.

## Architecture

### Files Created

1. **`src/config/programs.ts`** - Program definitions and data model
2. **`src/lib/daily.ts`** - UTC date comparison utilities for daily task resets
3. **`src/components/ProgramsSection.tsx`** - React component for displaying programs
4. **Locale updates** - Added i18n keys to both `/locales` and `/public/locales`

### Data Model

```typescript
type ProgramTask = {
  id: string;
  kind: "daily" | "once" | "social";
  titleEN: string;
  titleTR: string;
  href?: string;        // Optional deep link
  notesEN?: string;
  notesTR?: string;
};

type Program = {
  slug: string;
  nameEN: string;
  nameTR: string;
  url: string;          // Main/referral URL
  socialX?: string;
  code?: string;        // Invite code
  tasks: ProgramTask[];
  tags?: string[];
  visible: boolean;
};
```

## Programs Included

### 1. Neura Protocol
- **URL**: https://neuraverse.neuraprotocol.io
- **Tasks**: Daily faucet, Swap, Bridge, Social tasks
- **Tags**: xp, faucet, swap, bridge, social

### 2. Nitrograph
- **URL**: https://community.nitrograph.com/app/missions
- **Invite Code**: K175LH9L
- **Tasks**: Daily check-in, Social missions
- **Tags**: xp, daily, social

### 3. Huddle
- **URL**: https://testnet.huddle01.com/r/0x5583ba39732db8006938A83BF64BBB029A0b12A0
- **Tasks**: Social tasks, Daily meetings (8h target for $HP)
- **Tags**: daily, hp, social

### 4. Incentiv
- **URL**: https://testnet.incentiv.io/login?refCode=9hNV9reoKaURoTJHAAQjzJ
- **Tasks**: Daily faucet, Swap, Send tokens
- **Tags**: faucet, swap, send, xp

### 5. idOS
- **URL**: https://app.idos.network?ref=3C276CCF
- **Tasks**: Sign up, Mobile verification, Social tasks, Daily check-in
- **Tags**: identity, daily, social

### 6. Soneium
- **URL**: https://portal.soneium.org
- **Tasks**: Seasonal quests, Daily activity, Mint season NFT
- **Tags**: season, activity, nft

## Features

### Task Types

1. **Daily Tasks** (`kind: "daily"`)
   - Reset at 00:00 UTC
   - Progress timestamp checked against current UTC date
   - Orange badge indicator

2. **One-time Tasks** (`kind: "once"`)
   - Completed once and stays completed
   - No reset mechanism

3. **Social Tasks** (`kind: "social"`)
   - Typically external platform tasks
   - Completed once

### Progress Storage

Progress is stored in `localStorage` with the following key format:
```
progress__<address>__<programSlug>__<taskId>
```

**Example**:
```
progress__0x1234...5678__neura-protocol__daily-faucet
```

**Storage Structure**:
```json
{
  "completed": true,
  "timestamp": 1696704000000
}
```

### Daily Task Reset Logic

```typescript
// From src/lib/daily.ts
export const isSameUTCDate = (a: number, b: number): boolean => {
  const A = new Date(a);
  const B = new Date(b);
  return (
    A.getUTCFullYear() === B.getUTCFullYear() &&
    A.getUTCMonth() === B.getUTCMonth() &&
    A.getUTCDate() === B.getUTCDate()
  );
};
```

Daily tasks are marked as incomplete if the saved timestamp is not from the same UTC day.

## User Experience

### Address Tracking

- Uses the same address tracking system as other features
- Progress is isolated per address
- Switching addresses shows different progress states
- Anonymous tracking available (uses "anon" as address key)

### UI Components

#### Program Card
- Program name with optional invite code pill
- Social links (X/Twitter)
- Tag badges
- Progress counter (completed/total)
- "Open" button for main program URL

#### Task Item
- Checkbox for completion toggle
- Task title and optional notes
- "Daily task" badge for daily resets
- Optional external link button for task-specific URLs

### Interaction Flow

1. User clicks checkbox to mark task complete
2. Progress saved to localStorage with timestamp
3. UI updates immediately
4. For daily tasks: resets automatically at UTC midnight
5. Clicking task-specific link opens in new tab
6. Clicking "Open" on card opens main program URL

## Integration

### In TasksPage

```tsx
import { ProgramsSection } from '../ProgramsSection';

// ... in render:
{/* Programs Section - Network Agnostic */}
<div className="mt-12">
  <ProgramsSection language={language} />
</div>
```

### i18n Keys

Added to both `/locales/*.json` and `/public/locales/*.json`:

```json
{
  "programs": "Programs",
  "open": "Open",
  "invite_code": "Invite code",
  "completed": "Completed",
  "daily_task": "Daily task (resets 00:00 UTC)"
}
```

Turkish translations:

```json
{
  "programs": "Programlar",
  "open": "Aç",
  "invite_code": "Davet kodu",
  "completed": "Tamamlandı",
  "daily_task": "Günlük görev (00:00 UTC'de sıfırlanır)"
}
```

## Adding New Programs

To add a new program, edit `src/config/programs.ts`:

```typescript
{
  slug: "new-program",
  nameEN: "New Program",
  nameTR: "Yeni Program",
  url: "https://example.com?ref=YOUR_REF",
  socialX: "https://x.com/NewProgram",
  code: "INVITE123",
  tasks: [
    {
      id: "task-1",
      kind: "daily",
      titleEN: "Complete daily task",
      titleTR: "Günlük görevi tamamla",
      href: "https://example.com/tasks/daily",
      notesEN: "Optional notes",
      notesTR: "Opsiyonel notlar"
    }
  ],
  tags: ["xp", "daily"],
  visible: true
}
```

## Testing

### Manual Testing Checklist

- [ ] Programs section appears in Tasks page
- [ ] All 6 programs display correctly
- [ ] Invite codes show for Nitrograph
- [ ] Social icons link to X profiles
- [ ] "Open" buttons open correct URLs in new tabs
- [ ] Checkboxes toggle task completion
- [ ] Progress persists on page reload
- [ ] Switching address shows different progress
- [ ] Daily tasks reset at 00:00 UTC
- [ ] Task-specific links work correctly
- [ ] English/Turkish translations work
- [ ] Mobile responsive layout

### localStorage Inspection

Open browser DevTools → Application/Storage → Local Storage:

```javascript
// View all progress entries
Object.keys(localStorage)
  .filter(key => key.startsWith('progress__'))
  .forEach(key => {
    console.log(key, JSON.parse(localStorage[key]));
  });
```

### Testing Daily Reset

```javascript
// Manually test daily reset logic
import { isSameUTCDate } from './src/lib/daily';

const yesterday = Date.now() - 86400000; // 24h ago
const today = Date.now();

console.log(isSameUTCDate(yesterday, today)); // false
console.log(isSameUTCDate(today, today)); // true
```

## Security & Privacy

- ✅ No wallet connection required
- ✅ No external API calls
- ✅ All progress stored locally
- ✅ External links open with `noopener,noreferrer`
- ✅ Read-only interface (no transactions)
- ✅ Referral links pre-included (no user data exposed)

## Future Enhancements

### Potential Features
1. Export/import progress as JSON
2. Progress sync across devices (optional cloud backup)
3. Achievement badges for completing all tasks
4. Progress visualization (charts/graphs)
5. Program-specific notes/reminders
6. Browser notifications for daily task resets
7. Search/filter programs by tags
8. Sort programs by completion percentage

### Code Improvements
1. Extract task rendering to separate component
2. Add loading states for initial render
3. Implement optimistic UI updates
4. Add undo functionality for accidental completions
5. Create custom hook for progress management

## Deployment

No special deployment steps required. The feature is:
- Client-side only
- No backend dependencies
- No environment variables needed
- Compatible with static hosting (Bolt.new, Vercel, Netlify)

## Troubleshooting

### Progress not saving
- Check browser localStorage quota
- Verify browser allows localStorage
- Check console for errors

### Daily tasks not resetting
- Verify system clock is correct
- Check UTC vs local time confusion
- Inspect timestamp in localStorage

### Programs not appearing
- Check `visible: true` in config
- Verify import paths are correct
- Check browser console for errors

## Support

For issues or questions:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Try clearing localStorage: `localStorage.clear()`
4. Check network tab for any failed requests
5. Test in incognito mode to rule out extensions

---

**Created**: October 7, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
