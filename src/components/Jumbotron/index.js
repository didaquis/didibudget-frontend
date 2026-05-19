import PropTypes from 'prop-types'

import { DidibudgetLogo } from '../DidibudgetLogo'

export const Jumbotron = ({ title, subtitle, subtitleExtraLine }) => (
	<div className="bg-light p-2 rounded-3">
		<div className="col-sm-12 offset-md-2 col-md-8 col-lg-6 offset-lg-3">
			<DidibudgetLogo />
		</div>
		<h2 className="fs-1 fw-light m-4" data-easteregg="The cake is a lie">{title}</h2>
		<p className="m-4 lead">{subtitle}</p>
		{
			subtitleExtraLine && <p className="m-4 lead">{subtitleExtraLine}</p>
		}
	</div>
)

Jumbotron.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	subtitleExtraLine: PropTypes.string,
}