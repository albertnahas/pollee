import React from "react"
import { shallow } from "enzyme"
import { Register } from "./Register"
import { Providers } from "../../Providers/Providers"

describe("Register", function () {
  console.error = jest.fn()

  it("renders without crashing", () => {
    shallow(
      <Providers>
        <Register />
      </Providers>
    )
  })
})
