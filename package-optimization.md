# Package Optimization Recommendations

## Redundant Dependencies to Remove

### Charting Libraries (Choose One)
- **Keep**: `recharts` (lighter, better React integration)
- **Remove**: `chart.js` + `react-chartjs-2` (heavier)
- **Savings**: ~200KB

### Excel Processing (Choose One)
- **Keep**: `xlsx` (lighter, widely used)
- **Remove**: `exceljs` (heavier)
- **Savings**: ~150KB

### Toast Libraries (Consolidate)
- **Keep**: `react-hot-toast` OR `react-toastify` (not both)
- **Remove**: `sonner` (redundant)
- **Savings**: ~50KB

### UI Libraries (Consolidate)
- **Keep**: `@radix-ui/*` components
- **Consider removing**: `@mantine/core` if not heavily used
- **Savings**: ~300KB

### Utilities (Review)
- **Keep**: `date-fns` OR `dayjs` (not both)
- **Remove**: The other one
- **Savings**: ~100KB

## Commands to run:

```bash
npm uninstall chart.js react-chartjs-2 exceljs sonner dayjs @mantine/core @mantine/hooks
```

**Total potential savings: ~800KB-1MB**