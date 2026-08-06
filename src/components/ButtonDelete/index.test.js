import { render, screen, within, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ButtonDelete } from './index'

const DETAILS = ['2026-08-02', 'Home - Electricity bill', '27.34 EUR']
const DESCRIPTION = DETAILS.join(', ')

const renderButtonDelete = ({ deleteMutation = vi.fn().mockResolvedValue({}), onDelete = vi.fn() } = {}) => {
	const user = userEvent.setup()

	render(<ButtonDelete uuid='abc-123' details={DETAILS} deleteMutation={deleteMutation} onDelete={onDelete} />)

	return { user, deleteMutation, onDelete }
}

const openTheConfirmation = async (user) => {
	await user.click(screen.getByRole('button', { name: `Delete ${DESCRIPTION}` }))

	return screen.findByRole('dialog')
}

describe('ButtonDelete', () => {
	it('asks for confirmation instead of deleting straight away', async () => {
		const { user, deleteMutation } = renderButtonDelete()

		const dialog = await openTheConfirmation(user)

		expect(within(dialog).getByText('Delete this record?')).toBeVisible()
		expect(deleteMutation).not.toHaveBeenCalled()
	})

	it.each(DETAILS)('shows %s so the user can recognise the record', async (detail) => {
		const { user } = renderButtonDelete()

		const dialog = await openTheConfirmation(user)

		expect(within(dialog).getByText(detail)).toBeVisible()
	})

	it('names the record on the button so rows are told apart', () => {
		renderButtonDelete()

		expect(screen.getByRole('button', { name: `Delete ${DESCRIPTION}` })).toBeVisible()
	})

	it('deletes nothing when the user backs out', async () => {
		const { user, deleteMutation, onDelete } = renderButtonDelete()
		const dialog = await openTheConfirmation(user)

		await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

		await waitForElementToBeRemoved(() => screen.queryByRole('dialog'))
		expect(deleteMutation).not.toHaveBeenCalled()
		expect(onDelete).not.toHaveBeenCalled()
	})

	it('deletes the record the button was given', async () => {
		const { user, deleteMutation } = renderButtonDelete()
		const dialog = await openTheConfirmation(user)

		await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

		expect(deleteMutation).toHaveBeenCalledWith({ variables: { uuid: 'abc-123' } })
	})

	it('tells the caller once the record is gone', async () => {
		const { user, onDelete } = renderButtonDelete()
		const dialog = await openTheConfirmation(user)

		await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

		expect(onDelete).toHaveBeenCalled()
	})

	it('explains why a failed deletion did not happen', async () => {
		const deleteMutation = vi.fn().mockRejectedValue(new Error('The registry is already gone'))
		const { user } = renderButtonDelete({ deleteMutation })
		const dialog = await openTheConfirmation(user)

		await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

		expect(await screen.findByRole('alert')).toHaveTextContent('The registry is already gone')
	})

	it('does not report a deletion that failed', async () => {
		const deleteMutation = vi.fn().mockRejectedValue(new Error('The registry is already gone'))
		const { user, onDelete } = renderButtonDelete({ deleteMutation })
		const dialog = await openTheConfirmation(user)

		await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

		await screen.findByRole('alert')
		expect(onDelete).not.toHaveBeenCalled()
	})

	it('lets the user try again after a failed deletion', async () => {
		const deleteMutation = vi.fn().mockRejectedValue(new Error('The registry is already gone'))
		const { user } = renderButtonDelete({ deleteMutation })
		const dialog = await openTheConfirmation(user)

		await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

		await screen.findByRole('alert')
		expect(within(dialog).getByRole('button', { name: 'Delete' })).toBeEnabled()
	})
})
