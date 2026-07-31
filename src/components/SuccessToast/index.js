import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const AUTO_HIDE_DELAY = 4000
/* Tiene que coincidir con la duración de las animaciones de styles.css */
const LEAVE_DURATION = 150

export const SuccessToast = ({ notice }) => {
	const [isVisible, setIsVisible] = useState(false)
	const [isLeaving, setIsLeaving] = useState(false)

	useEffect(() => {
		if (!notice) {
			return
		}

		setIsLeaving(false)
		setIsVisible(true)

		const leaveTimer = setTimeout(() => setIsLeaving(true), AUTO_HIDE_DELAY)
		const hideTimer = setTimeout(() => setIsVisible(false), AUTO_HIDE_DELAY + LEAVE_DURATION)

		return () => {
			clearTimeout(leaveTimer)
			clearTimeout(hideTimer)
		}
	}, [notice?.id])

	const toastClassName = isLeaving ? 'toast show success-toast success-toast--leaving' : 'toast show success-toast'

	return (
		<div className="toast-container success-toast-container position-fixed top-0 start-50 translate-middle-x p-3" role="status" aria-live="polite" aria-atomic="true">
			{
				// La región viva se queda montada siempre: un lector de pantalla sólo anuncia
				// cambios dentro de una región que ya existía en el DOM.
				// La `key` fuerza el reemplazo del nodo, para que dos mensajes idénticos
				// seguidos se vuelvan a anunciar y se rebobine la animación de entrada.
			}
			{
				isVisible && notice && (
					<div className={toastClassName} key={notice.id}>
						<div className="toast-body text-center">
							<span aria-hidden="true">✓ </span>{notice.message}
						</div>
					</div>
				)
			}
		</div>
	)
}

SuccessToast.propTypes = {
	notice: PropTypes.shape({
		id: PropTypes.number.isRequired,
		message: PropTypes.string.isRequired
	})
}
