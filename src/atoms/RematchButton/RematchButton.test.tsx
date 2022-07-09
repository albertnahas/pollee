import React from "react"
import { mount, shallow } from "enzyme"
import { RematchButton } from "./RematchButton"

describe("Rematch Button", function () {
  console.error = jest.fn()

  it("renders without crashing", () => {
    const onClickMock = jest.fn()
    shallow(<RematchButton onClick={onClickMock} />)
  })

  it("disable the button when disabled is true", () => {
    const onClickMock = jest.fn()
    const component = shallow(
      <RematchButton onClick={onClickMock} disabled={true} />
    )
    expect(
      component.find(`[aria-label="rematch button"]`).props()
    ).toHaveProperty("disabled")
  })
  it("text change when pulsing is true", () => {
    const onClickMock = jest.fn()
    const component = shallow(
      <RematchButton pulsing={true} onClick={onClickMock} />
    )
    expect(component.find(`[aria-label="rematch button"]`).text()).toEqual(
      "Accept rematch"
    )
  })
  it("calls on click", async () => {
    const onClickMock = jest.fn()
    const component = mount(<RematchButton onClick={onClickMock} />)
    component.find(`button`).simulate("click")
    component.update()
    expect(onClickMock).toBeCalled()
  })
})
