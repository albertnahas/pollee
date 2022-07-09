import React, { useEffect } from "react"
import { Box, styled } from "@mui/system"
import { ControlHeading1 } from "../ControlPage"
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
          Pollee is a voting platform that allows users to get answers on their
          questions from the smallest detail to the hardest life choices.
        </p>
        <p>
          At Pollee we know that the crowd opinion is usually trustworthy and
          people tend to give very valuable advises, we give you the chance to
          be a part of this growing community as well, so you can share your
          opinions with others.
        </p>
      </Box>
    </>
  )
}
