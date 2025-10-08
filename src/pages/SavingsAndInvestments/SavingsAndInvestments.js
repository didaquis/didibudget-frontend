import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'

import { GetExpensesSumByType } from '../../components/SavingsAndInvestments/GetExpensesSumByType'

const SavingsAndInvestments = () => {
	return (
		<Fragment>
			<PageTitle text='Savings and investments' />
			<GetExpensesSumByType />
		</Fragment>
	)
}

SavingsAndInvestments.displayName = 'SavingsAndInvestments'

export default SavingsAndInvestments
