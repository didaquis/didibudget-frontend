# Total Investments Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a total row to the savings and investments table and display a summary paragraph below the table.

**Architecture:** Modify the `ViewGetSavingsAndInvestments` component to calculate the total of all investments and display it in two places: a semantic `<tfoot>` row in the table and a descriptive paragraph below.

**Tech Stack:** React, PropTypes, Bootstrap (Reactstrap classes)

---

## File Structure

**Files to modify:**
- `src/components/SavingsAndInvestments/ViewGetSavingsAndInvestments/index.js` - Main component file

**Files to create:**
- `src/components/SavingsAndInvestments/ViewGetSavingsAndInvestments/index.test.js` - Component tests (if not already present)

---

## Task 1: Extract Currency and Calculate Total

**Files:**
- Modify: `src/components/SavingsAndInvestments/ViewGetSavingsAndInvestments/index.js`

- [ ] **Step 1: Create helper functions inside the component**

Add two helper functions at the top of the file (before the component definition):

```javascript
// Helper to extract currency from data
const getCurrency = (data) => {
	if (!data || data.length === 0) return null
	return data[0].currencyISO
}

// Helper to calculate total sum
const calculateTotal = (data) => {
	if (!data || data.length === 0) return 0
	return data.reduce((sum, item) => sum + item.sum, 0)
}
```

These functions should be placed after the import statement and before the component export.

- [ ] **Step 2: Use the helpers in the component**

Inside the `ViewGetSavingsAndInvestments` component function, add two lines at the beginning to compute values:

```javascript
const totalInvested = calculateTotal(data)
const currency = getCurrency(data)
```

These lines should be placed right after the opening of the function body, before the return statement.

- [ ] **Step 3: Commit the helper functions**

```bash
git add src/components/SavingsAndInvestments/ViewGetSavingsAndInvestments/index.js
git commit -m "feat: add helper functions to calculate total and extract currency"
```

---

## Task 2: Add tfoot Row to Table

**Files:**
- Modify: `src/components/SavingsAndInvestments/ViewGetSavingsAndInvestments/index.js:26-26` (after closing tbody)

- [ ] **Step 1: Add tfoot element with total row**

Replace the section from line 15 to line 27 (the tbody and closing tags) with:

```javascript
				<tbody>
					{
						data.map(expenseSum => {
							return (
								<tr key={expenseSum.categoryType}>
									<td>{ getCategoryTypeText(expenseSum.categoryType) }</td>
									<td>{expenseSum.sum} {expenseSum.currencyISO}</td>
								</tr>
							)
						})
					}
				</tbody>
				<tfoot>
					<tr className="table-info text-dark">
						<td>Total</td>
						<td>{totalInvested} {currency}</td>
					</tr>
				</tfoot>
```

The tfoot row should appear immediately after the closing `</tbody>` tag and before the closing `</table>` tag.

- [ ] **Step 2: Verify the table structure is correct**

The complete table structure should now be:
- `<thead>` with headers
- `<tbody>` with data rows
- `<tfoot>` with total row
- All wrapped in `<table>`

- [ ] **Step 3: Commit the tfoot row**

```bash
git add src/components/SavingsAndInvestments/ViewGetSavingsAndInvestments/index.js
git commit -m "feat: add tfoot row with total investments to table"
```

---

## Task 3: Add Summary Paragraph Below Table

**Files:**
- Modify: `src/components/SavingsAndInvestments/ViewGetSavingsAndInvestments/index.js:27-29` (after table, before closing section)

- [ ] **Step 1: Add paragraph element after the table**

After the closing `</table>` tag and before the closing `</section>` tag, add:

```javascript
			<p className="text-muted mt-3">
				Total invested: {totalInvested} {currency}
			</p>
```

The full section should now look like:

```javascript
	return (
		<section className="table-responsive">
			<table className="table table-dark table-hover">
				<thead>
					<tr className="table-info text-dark">
						<th scope="col">Product</th>
						<th scope="col">Total invested</th>
					</tr>
				</thead>
				<tbody>
					{
						data.map(expenseSum => {
							return (
								<tr key={expenseSum.categoryType}>
									<td>{ getCategoryTypeText(expenseSum.categoryType) }</td>
									<td>{expenseSum.sum} {expenseSum.currencyISO}</td>
								</tr>
							)
						})
					}
				</tbody>
				<tfoot>
					<tr className="table-info text-dark">
						<td>Total</td>
						<td>{totalInvested} {currency}</td>
					</tr>
				</tfoot>
			</table>
			<p className="text-muted mt-3">
				Total invested: {totalInvested} {currency}
			</p>
		</section>
	)
```

- [ ] **Step 2: Verify positioning and classes**

- Paragraph uses `text-muted` class for subtle styling (consistent with Bootstrap conventions)
- Paragraph uses `mt-3` (margin-top) for spacing from the table
- Paragraph is inside the `<section>` but outside the `<table>`

- [ ] **Step 3: Commit the paragraph**

```bash
git commit -m "feat: add summary paragraph showing total invested below table"
```

---

## Task 4: Write Tests for the Component

**Files:**
- Create/Modify: `src/components/SavingsAndInvestments/ViewGetSavingsAndInvestments/index.test.js`

- [ ] **Step 1: Create test file with imports**

Create the file with the following content:

```javascript
import { render, screen } from '@testing-library/react'
import { ViewGetSavingsAndInvestments } from './index'

describe('ViewGetSavingsAndInvestments', () => {
	const mockData = [
		{ categoryType: 'stocks', sum: 5000, currencyISO: 'EUR' },
		{ categoryType: 'bonds', sum: 3000, currencyISO: 'EUR' },
		{ categoryType: 'savings', sum: 2000, currencyISO: 'EUR' }
	]

	test('renders table with data rows', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		expect(screen.getByText(/stocks|bonds|savings/)).toBeInTheDocument()
	})

	test('displays total in tfoot row', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		const totalCell = screen.getByText('10000 EUR')
		expect(totalCell).toBeInTheDocument()
	})

	test('displays summary paragraph with total', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		expect(screen.getByText(/Total invested: 10000 EUR/)).toBeInTheDocument()
	})

	test('displays 0 total for empty data', () => {
		render(<ViewGetSavingsAndInvestments data={[]} />)
		expect(screen.getByText(/Total invested: 0/)).toBeInTheDocument()
	})

	test('displays total in both table footer and paragraph', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		const totalElements = screen.getAllByText('10000 EUR')
		expect(totalElements.length).toBe(2) // One in tfoot, one in paragraph
	})
})
```

- [ ] **Step 2: Run the tests to verify they pass**

```bash
npm run test -- --testPathPattern=ViewGetSavingsAndInvestments
```

Expected output: All tests pass

- [ ] **Step 3: Commit the tests**

```bash
git add src/components/SavingsAndInvestments/ViewGetSavingsAndInvestments/index.test.js
git commit -m "test: add tests for total investments display"
```

---

## Task 5: Verify Linting and Build

**Files:**
- All modified files

- [ ] **Step 1: Run linter**

```bash
npm run lint
```

Expected: No errors related to the modified component

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build completes successfully, no errors

- [ ] **Step 3: Commit verification**

```bash
git log --oneline -5
```

Expected: Last 5 commits should show:
1. test: add tests for total investments display
2. feat: add summary paragraph showing total invested below table
3. feat: add tfoot row with total investments to table
4. feat: add helper functions to calculate total and extract currency
5. docs: add design spec for total investments display feature

---

## Self-Review Checklist

✓ **Spec Coverage:**
- ✓ Same currency assumption (handled by getCurrency helper)
- ✓ Table footer with tfoot (Task 2)
- ✓ Summary paragraph (Task 3)
- ✓ English language text (verified in code)
- ✓ Empty data handling (getCurrency and calculateTotal handle empty arrays)

✓ **Placeholder Scan:**
- ✓ No "TBD" or "TODO" placeholders
- ✓ All code is complete and executable
- ✓ All test code is included
- ✓ All commands are exact and include expected output

✓ **Type Consistency:**
- ✓ `calculateTotal` returns number
- ✓ `getCurrency` returns string or null
- ✓ Component uses these values consistently
- ✓ Test data matches expected prop types

✓ **No Assumptions:**
- ✓ All file paths are exact
- ✓ All code blocks are complete
- ✓ All commands are exact with output expectations
