import { Link } from 'react-router'

import { DidibudgetLogo } from '../DidibudgetLogo'

import './styles.css'

export const HomeHero = () => (
	<section className="row justify-content-center">
		<div className="col-12 col-sm-10 col-md-8 col-lg-6">
			<div className="position-relative px-1">
				<div className="home-hero__glow" aria-hidden="true"></div>
				<h1 className="m-0 lh-1">
					<DidibudgetLogo />
				</h1>
			</div>
			<p className="mt-4 mb-3 fs-2 fw-light fst-italic text-light" data-easteregg="The cake is a lie">Your money, month by month.</p>
			<p className="lead fw-light text-white-50">Track your savings and see where the spending goes.</p>
			<div className="mt-5 pt-3">
				<Link className="btn btn-outline-info btn-lg w-100" to='/login'>Log in</Link>
			</div>
			<div className="mt-3 text-center">
				<Link className="text-info fw-light small" to='/register'>
					Create an account
				</Link>
			</div>
		</div>
	</section>
)
