import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const AUTO_HIDE_DELAY = 4000
/* Must match the animation duration in styles.css */
const LEAVE_DURATION = 150

export const SuccessToast = ({ notice }) => {
	const [isVisible, setIsVisible] = useState(false)
	const [isLeaving, setIsLeaving] = useState(false)

	/* The id, not the object, is the identity: a caller passing an inline object
	   would otherwise restart the timers on every parent render */
	const noticeId = notice?.id

	useEffect(() => {
		if (noticeId === undefined) {
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
	}, [noticeId])

	const toastClassName = isLeaving ? 'toast show success-toast success-toast--leaving' : 'toast show success-toast'

	return (
		<div className="toast-container success-toast-container position-fixed start-50 translate-middle-x p-3" role="status" aria-live="polite" aria-atomic="true">
			{
				// The live region stays mounted at all times: a screen reader only announces
				// changes inside a region that already existed in the DOM.
				// The `key` forces the node to be replaced, so two identical consecutive
				// messages get announced again and the entry animation rewinds.
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
