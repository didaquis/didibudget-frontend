import './styles.css'

export const Spinner = () => {
	return (
		<div className="spinner">
			<span className="visually-hidden" role="status">Loading…</span>
			<div className="bounce1" aria-hidden="true"></div>
			<div className="bounce2" aria-hidden="true"></div>
			<div className="bounce3" aria-hidden="true"></div>
		</div>
	)
}
