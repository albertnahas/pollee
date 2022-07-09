import React from "react"
import { shallow } from "enzyme"
import { About } from "./About"

describe("About", function () {
  console.error = jest.fn()

  it("renders without crashing", () => {
    shallow(<About />)
  })
})
