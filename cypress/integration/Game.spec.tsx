import React from "react"
import { mount, unmount } from "@cypress/react"
import App from "../../src/App"
import { Providers } from "../../src/components/Providers/Providers"
import { defaultChallengeSetup } from "../../src/molecules/ChallengeSetupDialog/ChallengeSetupDialog"

beforeEach(() => {
  cy.login()
  mount(
    <React.StrictMode>
      <Providers>
        <App />
      </Providers>
    </React.StrictMode>
  )
})
afterEach(() => {
  cy.logout()
  unmount()
})

describe("Game starts for one player", () => {
  it("Starts single player challenge", () => {
    cy.get(`[aria-label="single player"]`).click()
    cy.get(`[aria-label="rounds-controller"] input[value="custom"]`).click()
    cy.get(`[aria-label="rounds"]`).clear().type("2")
    cy.get(`[aria-label="submit setup"]`).click()
    // renders audio
    cy.get(`[aria-label="audio container"]`).should("have.length", 1)
    cy.get(`[class="timer"]`).should("contain.text", "00:00")
    // answer 2 rounds
    cy.get(`[aria-label="choices"] button`).first().click()
    cy.get(`[aria-label="result"]`).should("have.length", 1)
    cy.get(`button[aria-label="next"]`).click()
    cy.get(`[aria-label="choices"] button`).first().click()
    cy.get(`[aria-label="done message"]`).contains("Done!")
    // close feedback
    cy.get(`button[aria-label="dialog close"]`).click()
    // leave
    cy.get(`button[aria-label="leave dialog"]`).click()
    cy.get("h1").contains("Main Menu")
  })
})

describe("Side drawer returns to Main Menu", () => {
  it("Starts multi player challenge", () => {
    cy.get(`[aria-label="open drawer"]`).click()
    cy.get(`[aria-label="Home"]`).click()
    cy.get("h1").contains("Main Menu")
  })
})

describe("Game starts for multi player - private mode", () => {
  const TEST_UID = Cypress.env("TEST_UID")
  let challengeId = ""

  it("Starts multi player challenge", () => {
    cy.get(`[aria-label="multiplayer"]`).click()
    cy.get(`[aria-label="rounds-controller"] input[value="custom"]`).click()
    cy.get(`[aria-label="rounds"]`).clear().type("2")
    cy.get(`[aria-label="submit setup"]`).click()
    cy.get(`[aria-label="Challenge Link"]`).should("have.length", 1)
    cy.get(`[aria-label="Challenge Link"]`)
      .find("span")
      .invoke("text")
      .then((text) => {
        expect(text.split("/").length).equal(5)
        challengeId = text.split("/")[4]
        cy.callFirestore("get", `challenges/${challengeId}`).then((r) => {
          cy.log("get returned: ", r)
          cy.wrap(r).its("players").should("equal", 2)

          cy.get(`[aria-label="start"]`).click()
          cy.get(`[aria-label="waiting for players"]`).should("have.length", 1)
          cy.log("get challengeId: ", challengeId)
          cy.wait(5000)
          cy.callFirestore(
            "get",
            `challenges/${challengeId}/players/${TEST_UID}`
          ).then((r) => {
            cy.log("get returned: ", r)
            cy.wrap(r).its("turn").should("equal", 1)
          })

          cy.callFirestore("add", `challenges/${challengeId}/players`, {
            displayName: "test 2",
            turn: 2,
            timedScore: 0,
            accuracy: 0,
          })
          cy.get(`[aria-label="player chip"]`, { timeout: 10000 }).should(
            "have.length",
            2
          )
          // answer 2 rounds
          cy.get(`[aria-label="choices"] button`).first().click()
          cy.get(`[aria-label="result"]`).should("have.length", 1)
          cy.get(`button[aria-label="next"]`).click()
          cy.get(`[aria-label="choices"] button`).first().click()
          cy.get(`[aria-label="done message"]`).contains("Done!")
          cy.get(`[aria-label="winner"]`).should("have.length", 1)
          // close feedback
          cy.get(`button[aria-label="dialog close"]`).click()
          // leave
          cy.get(`button[aria-label="leave dialog"]`).click()
          cy.wait(1000)
          cy.callFirestore("delete", `challenges/${challengeId}/players`).then(
            () => {
              cy.callFirestore("delete", `challenges/${challengeId}`)
            }
          )
          cy.callFirestore("delete", `requests`, {
            where: ["challengeId", "==", challengeId],
          })
        })
      })
  })
})

describe("Game starts for multi player - live mode", () => {
  it("Starts multi player challenge", () => {
    cy.get(`[aria-label="multiplayer"]`).click()
    cy.get(`[aria-label="rounds-controller"] input[value="custom"]`).click()
    cy.get(`[aria-label="rounds"]`).clear().type("2")
    cy.get(`[aria-label="live"]`).click()
    cy.get(`[aria-label="submit setup"]`).click()

    cy.get(`[aria-label="pairing"]`).should("have.length", 1)
    const requestId = Date.now().toString()

    cy.callFirestore(
      "set",
      `requests/${requestId}`,
      {
        ...defaultChallengeSetup,
        level: 1,
        live: true,
        rounds: 2,
        players: 2,
        rematchId: null,
        waiting: true,
      },
      { withMeta: true }
    )

    cy.get(`[aria-label="waiting for players"]`, { timeout: 10000 }).should(
      "have.length",
      1
    )

    cy.callFirestore("get", `requests/${requestId}`).then((r) => {
      cy.log("get returned: ", r)

      const challengeId = r.challengeId
      cy.wrap(r).its("players").should("equal", 2)

      cy.callFirestore("add", `challenges/${challengeId}/players`, {
        displayName: "test 2",
        turn: 2,
        timedScore: 0,
        accuracy: 0,
      }).then(() => {
        cy.get(`[aria-label="player chip"]`, { timeout: 5000 }).should(
          "have.length",
          2
        )
        // answer 2 rounds
        cy.get(`[aria-label="choices"] button`).first().click()
        cy.get(`[aria-label="result"]`).should("have.length", 1)
        cy.get(`button[aria-label="next"]`).click()
        cy.get(`[aria-label="choices"] button`).first().click()
        cy.get(`[aria-label="done message"]`).contains("Done!")
        cy.get(`[aria-label="winner"]`).should("have.length", 1)
        // close feedback
        cy.get(`button[aria-label="dialog close"]`).click()
        // leave
        cy.get(`button[aria-label="leave dialog"]`).click()
        cy.wait(1000)
        cy.callFirestore("delete", `challenges/${challengeId}/players`).then(
          () => {
            cy.callFirestore("delete", `challenges/${challengeId}`)
          }
        )
        cy.callFirestore("delete", `requests`, {
          where: ["challengeId", "==", challengeId],
        })
      })
    })
  })
})
