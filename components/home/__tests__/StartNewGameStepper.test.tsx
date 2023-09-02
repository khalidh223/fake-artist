import { render, screen } from "@testing-library/react"
import StartNewGameStepper from "../StartNewGameStepper"

describe("StartNewGameStepper", () => {
  it("renders without crashing", () => {
    render(<StartNewGameStepper open={true} onClose={jest.fn()} />)
  })

  it("opens and closes the dialog correctly", () => {
    const { rerender } = render(
      <StartNewGameStepper open={false} onClose={jest.fn()} />
    )
    expect(screen.queryByRole("dialog")).toBeNull()

    rerender(<StartNewGameStepper open={true} onClose={jest.fn()} />)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })
})
