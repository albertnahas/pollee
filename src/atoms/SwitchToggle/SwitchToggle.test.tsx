import React from "react"
import { mount, shallow } from "enzyme"
import SwitchToggle from "./SwitchToggle"
import { Providers } from "../../components/Providers/Providers"

describe("SwitchToggle widget", function () {
  console.error = jest.fn()

  it("renders without crashing", () => {
    shallow(<SwitchToggle active={true} />)
  })

  it("is active", () => {
    const component = mount(
      <Providers>
        <SwitchToggle active={true} />
      </Providers>
    )
    expect(component.find("input").props()).toHaveProperty("checked")
  })
})
