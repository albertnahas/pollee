import React, { useEffect } from "react"
import { Box, styled } from "@mui/system"
import { ControlLink, ControlHeading1 } from "../ControlPage"
import { useAnalytics } from "../../../hooks/useAnalytics"

export var SubmitLink = styled("a")(
  ({ theme }) => `
  text-decoration: none;
  color: ${theme.palette.primary.main};
  cursor: pointer;
`
)

export var About = function () {
  const { logEvent } = useAnalytics()
  useEffect(() => {
    logEvent("about_page_viewed")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ControlHeading1 variant="h1" color="primary">
        About us
      </ControlHeading1>
      <Box sx={{ textAlign: "left" }}>
        <p>
          Pollee is a language guessing game that offers audio samples of more
          than 300 languages. You listen to a short audio clip and are asked to
          identify what language was being spoken.
        </p>
        <p>
          At Pollee we know that languages are the key to understanding other
          cultures as well as your own. "How many languages you speak, how many
          times you are a human". While we genuinely believe it's a true
          statement, we decided to put our efforts to bring the world’s
          languages, dialects and accents to a wider audience in an
          entertaining, engaging way.
        </p>
        <p>
          Many people would agree that it feels just amazing if you can speak
          many languages or even if you are able to say a couple of words to the
          locals in a foreign country. While it all sounds exciting, it's a real
          challenge to learn new language. You can also forget a language if you
          do not actively use it. We can say that it's not possible to know all
          languages, but being able to tell the difference between them is a
          true skill. And Pollee is here for you to help you upgrade this skill.
        </p>
        <p>What features are there in Pollee?</p>
        <ul>
          <li>
            <p>
              You can check short information on every language available, both
              in-game and on a dedicated{" "}
              <ControlLink to="/learn">Learn</ControlLink> page.
            </p>
          </li>
          <li>
            <p>
              In your profile, you can track your high scores and accuracy of
              guessing.
            </p>
          </li>
          <li>
            <p>
              The game offers you multiple difficulty levels that allow anyone
              to play the game and learn the sounds of the different languages.
            </p>
          </li>
          <li>
            <p>
              You can also play with your friends to see who's best at language
              guessing, or challenge random players from all over the world.
            </p>
          </li>
        </ul>
        <p>
          If you enjoy Pollee, please consider supporting us by making a
          donation. Every single dollar will help Pollee to reach its full
          potential. All donations will be used for developing new game features
          and expanding the educational potential of the app.
        </p>
        <p>
          You can contribute your language(s) to the Pollee collection. Clear
          recordings of you (or a friend, relative, etc.) speaking the language
          would help us to maintain and enrich our audio samples database. If
          you'd like to participate, please{" "}
          <SubmitLink
            href="https://docs.google.com/forms/d/e/1FAIpQLSct4WgpCtrGAHoN3LEcqpczHZPIkq75P7jXSpgMM9DolrUzyw/viewform"
            target="_blank"
            rel="noreferrer"
          >
            Submit your language
          </SubmitLink>
          . You may add as many samples as you'd like.
        </p>
      </Box>
    </>
  )
}
