import { render, screen } from '@testing-library/react'

import { Jumbotron } from './'

describe('Jumbotron', () => {
	it('contains an expected text', () => {
		render(<Jumbotron title='foo' subtitle='bar' />)

		expect(screen.getByText('foo')).toBeVisible()
		expect(screen.getByText('bar')).toBeVisible()
	})

	it('contains an expected text, included more content as subtitle', () => {
		render(<Jumbotron title='foo' subtitle='bar' subtitleExtraLine='biz' />)

		expect(screen.getByText('foo')).toBeVisible()
		expect(screen.getByText('bar')).toBeVisible()
		expect(screen.getByText('biz')).toBeVisible()
	})

	it('contains the correct DOM nodes', () => {
		/* This test is just for learning purpose. Observe how you can get access to the DOM node properties */

		render(<Jumbotron title='my-title' subtitle='my-subtitle' />)

		const nodeTitle = screen.getByText('my-title')

		expect(nodeTitle.localName).toBe('h2')
		expect(nodeTitle.dataset.easteregg).toBe('The cake is a lie')
		expect(nodeTitle.className).toBe('fs-1 fw-light m-4')


		const nodeSubtitle = screen.getByText('my-subtitle')

		expect(nodeSubtitle.localName).toBe('p')
		expect(nodeSubtitle.className).toBe('m-4 lead')

		/*
			Other interesting properties of nodes:
			- node.dataset
			- node.id
			- node.innerHTML
			- node.textContent
			- node.parentNode
			- node.childNodes
			- node.firstChild
			- node.lastChild
			- node.nextSibling (return another node, so you can concatenate properties like this: node.nextSibling.localName)
			- node.previousSibling

		 */
	})
})