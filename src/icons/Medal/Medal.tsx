import React, { FC } from "react"
import { BlueMedal } from "./Variations/BlueMedal"
import { GoldMedal } from "./Variations/GoldMedal"
import { GreyMedal } from "./Variations/GreyMedal"
import { PurpleMedal } from "./Variations/PurpleMedal"
import { SilverMedal } from "./Variations/SilverMedal"

export type MedalType = "gold" | "purple" | "silver" | "blue" | "grey"

export const Medal: FC<Props> = ({ type, label, width }) => {
  const props = {
    style: { width: width || 75 },
    label,
  }
  switch (type) {
    case "gold":
      return <GoldMedal {...props} />
    case "purple":
      return <PurpleMedal {...props} />
    case "silver":
      return <SilverMedal {...props} />
    case "blue":
      return <BlueMedal {...props} />
    default:
      return <GreyMedal {...props} label={label} />
  }
}

interface Props {
  type?: MedalType
  label?: string
  width?: number
}

export interface MedalProps {
  label?: string
  style?: React.CSSProperties
}
