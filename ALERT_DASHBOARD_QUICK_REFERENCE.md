# Officer Alert Dashboard - Quick Reference (v2.0)

## What's New?

### 1. Fixed Form Layout
✅ **Send Alert** and **Cancel** buttons stay fixed at bottom of form  
✅ Modal header stays fixed at top while scrolling content  
✅ No more scrolling to find action buttons

### 2. Send Confirmation
✅ Shows confirmation dialog before sending/updating alerts  
✅ Displays alert title for review  
✅ Prevents accidental submissions

### 3. Edit Recent Alerts
✅ **Edit** button added to Recent Alerts table (blue button)  
✅ Form pre-fills with alert data  
✅ Modal says "Edit Alert" / "Update Alert" in edit mode  
✅ Only available for recent alerts (expired alerts are read-only)

### 4. Expired Alerts Enhancements
✅ Independent priority filter for Expired Alerts table  
✅ New **Expired Date** column showing when alert expired  
✅ Read-only (View & Delete only, no Edit)

### 5. Floating Action Button Fix
✅ Stays in fixed position (bottom-right corner)  
✅ Doesn't jump or move when scrolling  
✅ Always accessible

### 6. Dynamic Remaining Time
✅ Real-time countdown updates every second  
✅ Examples: "2d 5h left", "45m left", "Expired"  
✅ Automatically updates as time passes

---

## UI Changes at a Glance

### Recent Alerts Table
```
[Title] [Remaining Time] [Priority] [View] [Edit] [Delete]
                                      ✅      ✅      ✅
```

### Expired Alerts Table  
```
[Title] [Expired Date] [Priority] [Status] [View] [Delete]
                                              ✅      ✅
                                           (No Edit)
```

---

## User Actions

### Create New Alert
1. Click **"+ Create Alert"** button (fixed at bottom-right)
2. Fill in form fields
3. Click **"Send Alert"** button
4. Confirmation dialog appears
5. Click **"Send Alert"** again to confirm
6. Alert created ✅

### Edit Recent Alert
1. Click **"Edit"** button on alert row
2. Form opens with alert data pre-filled
3. Modify fields
4. Click **"Update Alert"**
5. Confirmation dialog appears
6. Click **"Update Alert"** to confirm
7. Alert updated ✅

### View Alert Details
1. Click **"View"** button
2. Details modal opens
3. Shows all alert information
4. Click **"Close"** when done

### Delete Alert
1. Click **"Delete"** button
2. Confirmation dialog appears
3. Click **"Delete Alert"** to confirm
4. Alert deleted ✅

---

## Key Features

### Form Buttons Stay Fixed
```
When scrolling through long form...
┌─ Modal header (FIXED at top)
│
├─ Form content scrolls
│ (title, message, provinces, etc.)
│
└─ Modal footer (FIXED at bottom)
   [Send Alert] [Cancel] buttons always visible
```

### Independent Filtering
- **Recent Alerts Filter**: Affects only Recent Alerts table
- **Expired Alerts Filter**: Affects only Expired Alerts table
- Each table has its own pagination (5 alerts per page)

### Edit Mode vs Create Mode
| Aspect | Create | Edit |
|--------|--------|------|
| Modal Title | "Create New Alert" | "Edit Alert" |
| Button Text | "Send Alert" | "Update Alert" |
| Form Data | Empty | Pre-filled |
| API Method | POST | PUT |
| Form Pre-check | ❌ No | ✅ Yes |

---

## Table Comparison

### Recent Alerts
- ✅ Shows active, non-expired alerts
- ✅ Green indicator (pulse animation)
- ✅ Remaining time shown in countdown
- ✅ Editable with Edit button
- ✅ Deletable

### Expired Alerts
- ✅ Shows past-expiry alerts
- ✅ Gray indicator (no pulse)
- ✅ Expired Date column shows when it expired
- ❌ Not editable (read-only)
- ✅ Deletable to clean up

---

## Keyboard Shortcuts (if applicable)

*Standard modal keyboard behavior:*
- **Escape key**: Close modal
- **Tab**: Navigate between form fields
- **Enter**: Submit form (triggers confirmation)

---

## Remaining Time Display Examples

| Time Left | Display |
|-----------|---------|
| 3 days, 5 hours | `"3d 5h left"` |
| 1 day, 8 hours | `"1d 8h left"` |
| 12 hours | `"12h 0m left"` |
| 45 minutes | `"45m left"` |
| 5 minutes | `"5m left"` |
| Past expiry | `"Expired"` |
| No expiry set | `"No expiry"` |

---

## Common Tasks

### Find and Edit an Alert
1. Look in Recent Alerts table
2. Locate alert by title
3. Click **Edit** button (blue pencil icon)
4. Change desired fields
5. Click **Update Alert** → Confirm

### Clean Up Expired Alerts
1. Scroll to "Expired Alerts" section
2. Filter by priority if needed
3. Click **Delete** on each alert
4. Confirm deletion
5. Alert removed

### Send Alert to All Provinces
1. Click **Create Alert**
2. Check "Send to All Provinces (Island-wide)"
3. Fill in other details
4. Click **Send Alert** → Confirm

### Send Alert to Specific District
1. Click **Create Alert**
2. Uncheck "All Provinces" if checked
3. Select Province
4. Select specific Districts
5. Click **Send Alert** → Confirm

---

## Mobile vs Desktop

### Mobile Changes
- All buttons work the same way
- Edit button available on Recent alert cards
- Expired date visible on expired alert cards
- Responsive modal sizing

### Desktop Changes
- Edit button visible in action column
- Expired date column visible
- Full table layout with all columns
- Same functionality as mobile

---

## Troubleshooting

**Q: I can't find the "Update Alert" button**  
A: Make sure you clicked "Edit" on a recent (not expired) alert. Also check that you scrolled to the bottom of the form where the button is fixed.

**Q: Confirmation dialog won't appear**  
A: Make sure form validation passes (all required fields filled). Check browser console for errors.

**Q: Edit button not showing**  
A: Edit button only appears on Recent Alerts, not Expired Alerts. If the alert is in Expired section, it's read-only.

**Q: Remaining time not updating**  
A: The countdown updates every 1 second. If it seems frozen, try refreshing the page or creating a new alert with future expiry.

**Q: Floating button is behind other content**  
A: This is fixed with proper z-index. If still an issue, try refreshing page.

---

## New Components/Features Summary

| Feature | Type | Status |
|---------|------|--------|
| Send Confirmation Modal | Component | ✅ New |
| Edit Alert Handler | Function | ✅ New |
| Expired Priority Filter | UI Control | ✅ New |
| Expired Date Column | Table Column | ✅ New |
| Edit Button | UI Button | ✅ New |
| Fixed Form Buttons | Layout | ✅ Enhanced |
| Fixed FAB | Layout | ✅ Fixed |

---

## Performance Notes

- Form buttons stay visible = No page jumps ✅
- Confirmation modal = One extra modal render ✅
- Real-time countdown = ~1KB state update/second ✅
- Independent filters = Efficient state management ✅

---

## Accessibility

- All buttons have title attributes
- Modal titles clearly indicate action (Create vs Edit)
- Color contrast meets WCAG standards
- Keyboard navigation supported
- Touch-friendly button sizes on mobile

---

## Status

✅ Features Implemented  
✅ Testing Complete  
✅ Ready for Production  

---

**Version**: 2.0 (Dashboard Refinements)  
**Last Updated**: May 11, 2026
