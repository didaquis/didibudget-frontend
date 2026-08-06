import { useState } from 'react'
import PropTypes from 'prop-types'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

export const ButtonDelete = ({ uuid, details, deleteMutation, onDelete }) => {
	const description = details.join(', ')

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
			<Button color="danger" outline={true} disabled={isDisabled} onClick={toggle} className="d-block d-md-inline-block me-2" aria-label={`Delete ${description}`}>Delete</Button>
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>Delete this record?</ModalHeader>
				<ModalBody>
					<ul className="list-unstyled bg-light rounded p-3 mb-3">
						{details.map((detail, index) => <li key={index}>{detail}</li>)}
					</ul>
					This cannot be undone.
				</ModalBody>
				<ModalFooter>
					<Button outline={true} onClick={toggle}>Cancel</Button>
					<Button color="danger" outline={true} onClick={handleClick} disabled={isDisabled}>Delete</Button>
				</ModalFooter>
				{
					error && <p className="alert alert-danger py-3 text-center m-3" role="alert">{error}</p>
				}
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