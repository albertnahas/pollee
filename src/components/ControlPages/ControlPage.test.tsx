import React from "react"
import { shallow } from "enzyme"
import { ControlPage } from "./ControlPage"

describe("Control Page", function () {
  console.error = jest.fn()

  it("renders without crashing", () => {
    shallow(<ControlPage />)
  })
})
