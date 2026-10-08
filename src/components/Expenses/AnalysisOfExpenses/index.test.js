import { render, screen } from '@testing-library/react'

import { AnalysisOfExpenses } from './'

describe('AnalysisOfExpenses', () => {
	it('should say no spending is recorded in the period when there is none', () => {
		render(<AnalysisOfExpenses expenses={[]} categories={[]} />)

		expect(screen.getByRole('status')).toHaveTextContent('No spending recorded in this period.')
	})
})
