import { useId, useState } from 'react'
import PropTypes from 'prop-types'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { BsTrash3 } from 'react-icons/bs'

import { ErrorAlert } from '../ErrorAlert'

import './styles.css'

export const ButtonDelete = ({ uuid, title, record, deleteMutation, onDelete }) => {
	const description = [record.date, record.name, record.amount].filter(Boolean).join(', ')
	const titleId = useId()

	const [modal, setModal] = useState(false)
	const toggle = () => setModal(!modal)

	const [isDisabled, setIsDisabled] = useState(false)
	const [error, setError] = useState(null)

	const handleClick = () => {
		setIsDisabled(true)
		setError(null)

		const variables = { uuid: uuid }

		deleteMutation({ variables }).then(() => {
			toggle()
			onDelete()
		}).catch(e => {
			setIsDisabled(false)
			setError(e.message)
		})
	}

	return (
		<div>
			<Button color="link" disabled={isDisabled} onClick={toggle} className="button-delete p-0" aria-label={`Delete ${description}`}>
				<BsTrash3 size={20} aria-hidden="true" />
			</Button>
			<Modal isOpen={modal} toggle={toggle} labelledBy={titleId} centered className="delete-confirmation" contentClassName="bg-dark text-light border-secondary">
				<ModalHeader
					className="border-secondary"
					close={<button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={toggle} />}
				>
					<span id={titleId}>{title}</span>
				</ModalHeader>
				<ModalBody>
					{
						error && <ErrorAlert errorMessage={error} variant="form" />
					}
					<div className="mb-3">
						<p className="mb-0">{record.name}</p>
						<p className="mb-0 small text-white-50">
							{
								record.date && <><span className="text-nowrap">{record.date}</span> · </>
							}
							<span className="text-nowrap text-light">{record.amount}</span>
						</p>
					</div>
					<p className="text-white-50 mb-0">This cannot be undone.</p>
				</ModalBody>
				<ModalFooter className="d-grid gap-3 border-secondary">
					<Button color="danger" size="lg" className="m-0" onClick={handleClick} disabled={isDisabled}>Delete</Button>
					<Button color="info" size="lg" outline={true} className="m-0" onClick={toggle}>Cancel</Button>
				</ModalFooter>
			</Modal>
		</div>
	)
}

ButtonDelete.propTypes = {
	uuid: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	record: PropTypes.shape({
		name: PropTypes.string.isRequired,
		date: PropTypes.string,
		amount: PropTypes.string.isRequired
	}).isRequired,
	deleteMutation: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired
}