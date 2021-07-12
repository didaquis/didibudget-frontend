import PropTypes from 'prop-types'

import { DidibudgetLogo } from '../DidibudgetLogo'

import './styles.css'

export const Jumbotron = ({ title, subtitle, subtitleExtraLine }) => (
	<div className="jumbotron">
		<div className="col-sm-12 offset-md-2 col-md-8 col-lg-8">
			<DidibudgetLogo />
		</div>
		<h2 className="custom-title m-4" data-easteregg="The cake is a lie">{title}</h2>
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