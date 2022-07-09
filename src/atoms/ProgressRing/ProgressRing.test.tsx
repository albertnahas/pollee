import React from "react"
import { shallow } from "enzyme"
import { ProgressRing } from "./ProgressRing"

describe("Progress Ring widget", function () {
  it("renders without crashing", () => {
    shallow(<ProgressRing value={0} />)
  })

  it("shows label", () => {
    const component = shallow(<ProgressRing value={10} label={true} />)
    expect(component.find(`[aria-label="ring value"]`).text()).toContain("10")
  })
})
