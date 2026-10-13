import { useId, useState } from 'react'
import PropTypes from 'prop-types'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { BsTrash3 } from 'react-icons/bs'

import { ErrorAlert } from '../ErrorAlert'

import './styles.css'

export const ButtonDelete = ({ uuid, details, deleteMutation, onDelete }) => {
	const description = details.join(', ')
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
			<Modal isOpen={modal} toggle={toggle} labelledBy={titleId} contentClassName="bg-dark text-light border-secondary">
				<ModalHeader
					className="border-secondary"
					close={<button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={toggle} />}
				>
					<span id={titleId}>Delete this record?</span>
				</ModalHeader>
				<ModalBody>
					{
						error && <ErrorAlert errorMessage={error} variant="form" />
					}
					<ul className="list-unstyled mb-3">
						{details.map((detail, index) => <li key={index}>{detail}</li>)}
					</ul>
					<p className="text-white-50 mb-0">This cannot be undone.</p>
				</ModalBody>
				<ModalFooter className="border-secondary">
					<Button color="info" outline={true} onClick={toggle}>Cancel</Button>
					<Button color="danger" onClick={handleClick} disabled={isDisabled}>Delete</Button>
				</ModalFooter>
			</Modal>
		</div>
	)
}

ButtonDelete.propTypes = {
	uuid: PropTypes.string.isRequired,
	details: PropTypes.arrayOf(PropTypes.string).isRequired,
	deleteMutation: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired
}