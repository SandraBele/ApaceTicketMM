import { render, screen } from '@testing-library/react'
import Home from './index'

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { status: 'ok' } }))
}))

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', {
      name: /apace ticket system/i,
    })

    expect(heading).toBeInTheDocument()
  })
})