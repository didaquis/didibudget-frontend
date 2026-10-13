import { DidibudgetLogo } from '../DidibudgetLogo'

import './styles.css'

export const HomeHero = () => (
	<section className="row justify-content-center text-center mb-4">
		<div className="col-12 col-sm-10 col-md-8 col-lg-6">
			<div className="position-relative px-1">
				<div className="home-hero__glow" aria-hidden="true"></div>
				<h1 className="m-0 lh-1">
					<DidibudgetLogo />
				</h1>
			</div>
			<p className="mt-4 mb-0 fs-2 fw-light fst-italic text-light" data-easteregg="The cake is a lie">Your money, month by month.</p>
		</div>
	</section>
)
