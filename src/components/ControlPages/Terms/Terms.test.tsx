import React from "react"
import { shallow } from "enzyme"
import { Terms } from "./Terms"

describe("Terms", function () {
  console.error = jest.fn()

  it("renders without crashing", () => {
    shallow(<Terms />)
  })
})
