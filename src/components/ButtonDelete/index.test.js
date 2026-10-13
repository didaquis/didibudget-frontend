import { render, screen, within, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ButtonDelete } from './index'

const TITLE = 'Delete this spending?'
const RECORD = { name: 'Home › Electricity bill', date: '2026-08-02', amount: '27.34 EUR' }
const DESCRIPTION = '2026-08-02, Home › Electricity bill, 27.34 EUR'

const renderButtonDelete = ({ record = RECORD, deleteMutation = vi.fn().mockResolvedValue({}), onDelete = vi.fn() } = {}) => {
	const user = userEvent.setup()

	render(<ButtonDelete uuid='abc-123' title={TITLE} record={record} deleteMutation={deleteMutation} onDelete={onDelete} />)

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

		expect(within(dialog).getByText(TITLE)).toBeVisible()
		expect(deleteMutation).not.toHaveBeenCalled()
	})

	it('names the confirmation after its question', async () => {
		const { user } = renderButtonDelete()

		await openTheConfirmation(user)

		expect(screen.getByRole('dialog', { name: TITLE })).toBeVisible()
	})

	it.each(Object.values(RECORD))('shows %s so the user can recognise the record', async (detail) => {
		const { user } = renderButtonDelete()

		const dialog = await openTheConfirmation(user)

		expect(within(dialog).getByText(detail)).toBeVisible()
	})

	it('shows a record that has no date', async () => {
		const { user } = renderButtonDelete({ record: { name: 'January 2026', amount: '1234.50 EUR' } })

		await user.click(screen.getByRole('button', { name: 'Delete January 2026, 1234.50 EUR' }))
		const dialog = await screen.findByRole('dialog')

		expect(within(dialog).getByText('1234.50 EUR')).toBeVisible()
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
