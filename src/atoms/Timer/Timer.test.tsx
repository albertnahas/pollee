import React from "react"
import { mount, shallow } from "enzyme"
import { Timer } from "./Timer"
import waitFor from "../../utils/waitFor"

describe("Timer widget", function () {
  console.error = jest.fn()
  it("renders without crashing", () => {
    const component = shallow(<Timer active={true} />)
    expect(component).toMatchSnapshot()
  })

  it("starts at 00:00", () => {
    const component = shallow(<Timer active={true} />)
    expect(component.find(`[aria-label="timer"]`).text()).toContain("00:00")
  })

  it("starts with startingTime", () => {
    const component = shallow(<Timer startingTime={30} active={true} />)
    expect(component.find(`[aria-label="timer"]`).text()).toContain("00:30")
  })

  it("increases time and calls onTimeChange", async () => {
    const onTimeChangeMock = jest.fn((time) => time)
    const component = mount(
      <Timer onTimeChange={onTimeChangeMock} active={true} />
    )
    await waitFor(() => {
      component.update()
      expect(onTimeChangeMock).toHaveBeenCalledWith(1)
      expect(component.find(`[aria-label="timer"]`).text()).toContain("00:01")
    }, 2000)
  })

  it("should end with endTime and call onTimerStop with countdown", async () => {
    const onTimerStopMock = jest.fn((time) => time)
    const component = mount(
      <Timer
        endtime={1}
        startingTime={0}
        onTimerStop={onTimerStopMock}
        active={true}
        countdown={true}
      />
    )
    await waitFor(() => {
      component.update()
      expect(onTimerStopMock).toHaveBeenCalled()
    }, 4000)
  })
})
