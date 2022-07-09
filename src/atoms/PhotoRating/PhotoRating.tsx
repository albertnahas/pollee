import * as React from "react"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Rating, { RatingProps } from "@mui/material/Rating"
import { Star } from "@mui/icons-material"

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
})

const PhotoRating: React.FC<Props & RatingProps> = ({
  value,
  onRatingChange,
  ...props
}) => {
  return (
    <Box
      sx={{
        "& > legend": { mt: 2 },
      }}
    >
      <StyledRating
        name="customized-color"
        defaultValue={0}
        value={value || 0}
        getLabelText={(value) => `${value} Heart${value !== 1 ? "s" : ""}`}
        precision={0.5}
        // icon={<FavoriteIcon fontSize="medium" />}
        // emptyIcon={<FavoriteBorderIcon fontSize="medium" />}
        emptyIcon={<Star style={{ opacity: 1 }} fontSize="inherit" />}
        size="large"
        onChange={onRatingChange}
        {...props}
      />
    </Box>
  )
}

interface Props {
  value: number
  onRatingChange: (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number | null
  ) => void
}

export default PhotoRating
