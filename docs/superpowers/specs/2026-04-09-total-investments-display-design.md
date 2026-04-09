# Design Spec: Add Total Investments Display

**Date:** April 9, 2026  
**Component:** `ViewGetSavingsAndInvestments`  
**Status:** Approved

## Overview

Add a total row to the savings and investments table that displays the sum of all investment amounts, shown in two places: as a semantic `<tfoot>` row in the table and as a descriptive paragraph below the table.

## Requirements

- **Same currency assumption:** All data rows are guaranteed to have the same currency ISO code
- **Table footer:** Add a `<tfoot>` element with a "Total" row showing the sum and currency
- **Summary paragraph:** Display "Total invested: {sum} {currency}" below the table
- **Language:** Interface is in English
- **Empty data handling:** If the data array is empty, total should be 0

## Implementation Details

### Calculation Logic

Create a utility function to calculate the total:
- Sum all `sum` values from the data array
- Extract the currency from the first element of the array
- Return both values (or null if array is empty)

### Table Structure Changes

**Current structure:**
```
<table>
  <thead>...</thead>
  <tbody>
    {data.map(...)}
  </tbody>
</table>
```

**New structure:**
```
<table>
  <thead>...</thead>
  <tbody>
    {data.map(...)}
  </tbody>
  <tfoot>
    <tr className="table-info text-dark">
      <td>Total</td>
      <td>{totalSum} {currency}</td>
    </tr>
  </tfoot>
</table>
```

### Paragraph Below Table

Add a paragraph element within the `<section>` but outside the table:
- Text format: `"Total invested: {totalSum} {currency}"`
- Position: Immediately after the closing `</table>` tag
- Styling: Apply Bootstrap classes for visual consistency (e.g., `text-muted` or appropriate class from the project's design system)

## Data Flow

1. Component receives `data` prop (array of investment objects)
2. On render, calculate total sum and extract currency
3. Render the `<tfoot>` row with calculated values
4. Render the summary paragraph with the same values
5. If data is empty, both locations show "Total invested: 0 {currency}" (or handle as needed)

## Styling Consistency

- **Tfoot row:** Use `table-info text-dark` classes to match the `<thead>` styling
- **Paragraph:** Use appropriate Bootstrap classes to align with project design language

## Testing Considerations

- Test with non-empty data (multiple rows)
- Test with single row
- Test with empty array
- Verify currency is correctly extracted and displayed in both locations
- Verify visual alignment and styling consistency

## Edge Cases

- **Empty data:** Total shows 0 with currency (if available)
- **Single row:** Total should equal that row's amount
- **Large numbers:** No special formatting required; assume data provider handles this

## Files to Modify

- `src/components/SavingsAndInvestments/ViewGetSavingsAndInvestments/index.js`
