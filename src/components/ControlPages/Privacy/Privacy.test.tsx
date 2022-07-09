import React from "react"
import { shallow } from "enzyme"
import { Privacy } from "./Privacy"

describe("Privacy", function () {
  console.error = jest.fn()

  it("renders without crashing", () => {
    shallow(<Privacy />)
  })
})
