import React from "react"
import { mount } from "@cypress/react"
import App from "../../src/App"
import { Providers } from "../../src/components/Providers/Providers"

describe("Main Menu", () => {
  beforeEach(() => {
    cy.login()
    mount(
      <Providers>
        <App />
      </Providers>
    )
  })

  it("Starts with correct setup for single player", () => {
    cy.get(`[aria-label="single player"]`).click()
    cy.get(`[aria-label="rounds-controller"] input[checked]`).should(
      "have.value",
      "10"
    )
    cy.get(`[aria-label="level"] input[checked]`).should("have.value", "1")
  })

  it("Starts with correct setup for multiplayer", () => {
    cy.get(`[aria-label="multiplayer"]`).click()
    cy.get(`[aria-label="players"] input`).should("have.value", "2")
    cy.get(`[aria-label="rounds-controller"] input[checked]`).should(
      "have.value",
      "10"
    )
    cy.get(`[aria-label="level"] input[checked]`).should("have.value", "1")
  })
})
