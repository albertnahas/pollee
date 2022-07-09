import React from "react"
import { mount } from "@cypress/react"
import App from "../../src/App"
import { Providers } from "../../src/components/Providers/Providers"

describe("App renders", () => {
  beforeEach(() => {
    mount(
      <Providers>
        <App />
      </Providers>
    )
  })

  it("adds document to test collection of Firestore", () => {
    cy.callFirestore("add", "test", { some: "value" }).then(() =>
      cy.callFirestore("delete", "test")
    )
  })

  it("renders landing page", () => {
    cy.logout()
    cy.get("h1").contains("Pollee")
  })

  it("sends contact us", () => {
    const testMessage = "send a contact test message..."
    cy.login()
    cy.get(`[aria-label="open drawer"]`, { timeout: 10000 }).click({
      force: true,
    })
    cy.get(`[aria-label="contact"]`).click()
    cy.get(`[name="message"]`).clear().type(testMessage)
    cy.get(`[aria-label="submit"]`).click()
    cy.get(`[aria-label="pollee"]`, { timeout: 5000 }).contains("Main Menu")
    cy.callFirestore("delete", "contact", {
      where: ["message", "==", testMessage],
    })
  })

  describe("renders control pages", () => {
    it("renders privacy policy", () => {
      cy.get(`[aria-label="open drawer"]`).click({ force: true })
      cy.get(`[aria-label="privacy"]`).click()
      cy.get(`h1`).contains("Privacy Policy")
    })
    it("renders terms and conditions", () => {
      cy.get(`[aria-label="open drawer"]`).click({ force: true })
      cy.get(`[aria-label="terms"]`).click()
      cy.get(`h1`).contains("Terms and Conditions")
    })
    it("renders about us", () => {
      cy.get(`[aria-label="open drawer"]`).click()
      cy.get(`[aria-label="about"]`).click()
      cy.get(`h1`).contains("About us")
    })
    it("renders learn", () => {
      cy.get(`[aria-label="open drawer"]`).click()
      cy.get(`[aria-label="learn"]`).click()
      cy.get(`h1`).contains("Learn")
    })
  })

  it("renders profile", () => {
    cy.get(`[aria-label="profile"]`).click()
    cy.get(`[aria-label="profile container"]`).should("have.length", 1)
  })
})
