import { render } from '@testing-library/react'
import NotFound from '../NotFound'

describe('<NotFound />', () => {
  it('Should render message', () => {
    const message = 'test message'
    const { getByText } = render(<NotFound message={message} />)

    expect(getByText(message)).toBeInTheDocument()
  })
})
