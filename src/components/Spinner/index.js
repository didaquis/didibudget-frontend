import './styles.css'

export const Spinner = () => {
	return (
		<div className="spinner">
			<span className="visually-hidden">Loading...</span>
			<div className="bounce1"></div>
			<div className="bounce2"></div>
			<div className="bounce3"></div>
		</div>
	)
}
