import { useState } from 'react'
import PropTypes from 'prop-types'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { BsTrash3 } from 'react-icons/bs'

import './styles.css'

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
			<Button color="link" disabled={isDisabled} onClick={toggle} className="button-delete p-0" aria-label={`Delete ${description}`}>
				<BsTrash3 size={20} aria-hidden="true" />
			</Button>
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