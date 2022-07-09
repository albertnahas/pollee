import React from "react"
import { mount } from "@cypress/react"
import App from "../../src/App"
import { Providers } from "../../src/components/Providers/Providers"

describe("Auth functions work", () => {
  const random = (Math.random() + 1).toString(36).substring(7)

  beforeEach(() => {
    cy.logout()
    mount(
      <Providers>
        <App />
      </Providers>
    )
  })

  it("registers new user and signout", () => {
    cy.get(`[aria-label="get started"]`).click({ force: true })
    cy.get(`[aria-label="sign up"]`).click()
    cy.get("h1").contains("Create")
    cy.get(`input[name="firstName"]`).clear().type("test")
    cy.get(`input[name="lastName"]`).clear().type("test")
    cy.get(`input[name="email"]`).clear().type(`${random}@test.com`)
    cy.get(`input[name="password"]`).clear().type("123456")
    cy.get(`input[name="age"]`).clear().type("25")
    cy.get(`[aria-label="sign up"]`).click()
    cy.get(`[aria-label="pollee"]`, { timeout: 5000 }).contains("Main Menu")
    cy.get(`[aria-label="open drawer"]`).click()
    cy.get(`[aria-label="signout"]`).click()
    cy.get("h1").contains("Pollee")
  })

  it("login user", () => {
    cy.get(`[aria-label="get started"]`).click({ force: true })
    cy.get("h1").contains("Sign in")
    cy.get(`input[name="email"]`).clear().type(`${random}@test.com`)
    cy.get(`input[name="password"]`).clear().type("123456")
    cy.get(`[aria-label="sign in"]`).click()
    cy.get(`[aria-label="pollee"]`, { timeout: 5000 }).contains("Main Menu")
  })
})
