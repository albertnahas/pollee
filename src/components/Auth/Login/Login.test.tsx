import React from "react"
import { shallow } from "enzyme"
import { Login } from "./Login"
import { Providers } from "../../Providers/Providers"

describe("Login", function () {
  console.error = jest.fn()

  it("renders without crashing", () => {
    shallow(
      <Providers>
        <Login />
      </Providers>
    )
  })
})
