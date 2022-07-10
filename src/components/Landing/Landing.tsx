import { FC } from "react"
import { Box, Button, Grid, Typography } from "@mui/material"
import { useTheme } from "@mui/system"
import { Logo } from "../../icons/logo"

export var Landing: FC<Props> = function (props) {
  const theme = useTheme()
  return (
    <>
      <Box>
        <Grid container>
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: { md: 8, xs: 4 },
              background: theme.palette.primary.main,
            }}
          >
            <img src="./assets/imgs/shape.svg" alt="girl" />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "top",
              alignItems: "center",
              flexDirection: "column",
              minHeight: "50vh",
              px: { xs: 6, md: 10 },
              py: 4,
            }}
          >
            <Logo sx={{ fontSize: "8em" }} color="primary" />
            <Typography
              sx={{
                fontWeight: "400",
                fontSize: { md: "4em", xs: "3em" },
              }}
              color="primary"
              variant="h1"
              aria-label="IQBenchmark"
            >
              Pollee
            </Typography>
            <Box>
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontSize: "2em", py: 2 }}
              >
                Need help? We've got your back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ask the community's opinion on anything that matters to you. No
                matter if it's a choice of your next Instagram post or buying
                the house of your dreams. Get instant feedback, and give your
                opinion to help others in return.
              </Typography>
            </Box>
            <Button
              color="primary"
              fullWidth
              size="large"
              onClick={props.login}
              sx={{
                width: 200,
                mt: 3,
              }}
              aria-label="get started"
              variant="contained"
            >
              Get Started
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

interface Props {
  login: () => void
}
