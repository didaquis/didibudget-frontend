import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'

import { GetSavingsAndInvestments } from '../../components/SavingsAndInvestments/GetSavingsAndInvestments'

const SavingsAndInvestments = () => {
	return (
		<Fragment>
			<PageTitle text='Put aside' />
			<GetSavingsAndInvestments />
		</Fragment>
	)
}

SavingsAndInvestments.displayName = 'SavingsAndInvestments'

export default SavingsAndInvestments
