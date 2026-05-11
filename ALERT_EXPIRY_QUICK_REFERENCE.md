# Alert Expiry System - Quick Reference

## What Changed?

### Backend
- **Alert Model**: Added `expiresAt` field (Date type, optional)
- **createAlert**: Now accepts `expiresAt` parameter
- **getOfficerAlerts**: Returns alerts separated as `{ recent, expired }`

### Frontend UI
- **Filters**: Priority only (removed officer/search filters)
- **Form**: Added expiry date & time datetime-local input
- **Table Columns**: Removed "Created By" & "Time", added "Remaining Time" with live countdown
- **Layout**: Two tables - "Recent Alerts" (active) and "Expired Alerts" (expired)

---

## Key Features

### Real-Time Countdown
- Updates every 1 second
- Shows: "2d 5h left", "45m left", "Expired", "No expiry"
- Calculated server-side at fetch, updated client-side

### Dual Tables
```
Recent Alerts (Active)
├─ Green indicator
├─ Shows remaining time
└─ Independent pagination

Expired Alerts (Inactive)
├─ Gray indicator
├─ Shows "Expired" status
└─ Independent pagination
```

### Alert Lifecycle
```
Creation with expiry date
         ↓
Recent Alerts section (countdown active)
         ↓
Expiry time reached
         ↓
Expired Alerts section (status: "Expired")
         ↓
Manual deletion
```

---

## Files Modified

| File | Change |
|------|--------|
| `server/models/Alert.js` | Added expiresAt field |
| `server/controllers/officerController.js` | Updated createAlert & getOfficerAlerts |
| `client/app/officer/alerts/page.tsx` | Complete UI overhaul with dual tables |

---

## Testing Quick Steps

1. **Create alert with expiry:**
   - Click "Create Alert"
   - Set title, priority, expiry date & time
   - Select provinces
   - Submit

2. **View in dashboard:**
   - Alert appears in "Recent Alerts"
   - Countdown shows remaining time
   - Updates every second

3. **Wait for expiry:**
   - After expiry time passes
   - Alert moves to "Expired Alerts"
   - Shows "Expired" status

4. **Test pagination:**
   - Create 6+ alerts
   - Both tables paginate independently
   - Filter by priority (affects both tables)

---

## API Changes

### Request (create alert)
```json
{
  "title": "Heavy Rain Warning",
  "message": "...",
  "priority": "High",
  "targetType": "provinces",
  "targetProvinces": ["Western"],
  "targetDistricts": [],
  "expiresAt": "2026-05-15T18:00:00" // NEW OPTIONAL FIELD
}
```

### Response (get alerts)
```json
{
  "message": "Alerts retrieved successfully",
  "alerts": {
    "recent": [
      { _id, title, message, priority, expiresAt, ... }
    ],
    "expired": [
      { _id, title, message, priority, expiresAt, ... }
    ]
  }
}
```

---

## UI Quick Guide

### Priority Filter
- **All**: Shows all alerts
- **High**: Red badge alerts only
- **Medium**: Yellow badge alerts only
- **Low**: Blue badge alerts only

### Action Buttons
- **View**: Open alert details modal
- **Delete**: Delete alert (requires confirmation)

### Remaining Time Display
- `2d 5h left` - More than 1 hour remaining
- `45m left` - Less than 1 hour
- `Expired` - Past expiry date
- `No expiry` - No expiration set

---

## Common Tasks

### Create Alert that Expires Tomorrow at 6 PM
1. Click "Create Alert"
2. Fill in Title and Message
3. Set Priority
4. **Expiry Date & Time**: Select tomorrow's date at 18:00
5. Select target provinces
6. Submit

### Check Which Alerts Are About to Expire
1. Look at "Recent Alerts" table
2. Check "Remaining Time" column
3. Sort mentally or use priority filter
4. Alerts with less than 1 hour show "Xm left"

### Clean Up Expired Alerts
1. Scroll to "Expired Alerts" section
2. Click Delete on each alert
3. Confirm deletion in modal
4. Alert removed from dashboard

### Create Permanent Alert
1. Fill in alert details
2. **Leave "Expiry Date & Time" empty**
3. Submit
4. Alert stays in "Recent Alerts" indefinitely

---

## Countdown Examples

**Created at**: 2026-05-11 10:00 AM  
**Expires at**: 2026-05-13 18:00 PM

| Current Time | Display |
|--------------|---------|
| 2026-05-11 10:00 | 2d 8h left |
| 2026-05-12 10:00 | 1d 8h left |
| 2026-05-13 10:00 | 8h 0m left |
| 2026-05-13 17:45 | 15m left |
| 2026-05-13 18:00 | Expired |
| 2026-05-13 18:01 | Expired |

---

## Known Limitations

- ✅ Each table shows max 5 alerts per page
- ✅ Countdown updates every 1 second (not real-time in production)
- ✅ Expired alerts don't auto-delete (manual deletion required)
- ✅ No timezone conversion (uses browser's local timezone)

---

## Status

✅ All changes implemented and tested  
✅ Ready for production deployment  
✅ Backward compatible with existing alerts (no expiry)  

---

**Date**: May 11, 2026  
**Version**: 1.0  
