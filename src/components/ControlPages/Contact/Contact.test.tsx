import React from "react"
import { shallow } from "enzyme"
import { Contact } from "./Contact"
import { Providers } from "../../Providers/Providers"

describe("Contact", function () {
  console.error = jest.fn()

  it("renders without crashing", () => {
    shallow(
      <Providers>
        <Contact />
      </Providers>
    )
  })
})
