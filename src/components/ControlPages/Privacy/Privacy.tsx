import React from "react"
import { Box } from "@mui/system"
import { ControlLink, ControlHeading1, ControlHeading2 } from "../ControlPage"

export var Privacy = function () {
  return (
    <>
      <ControlHeading1 variant="h1" color="primary">
        Privacy Policy
      </ControlHeading1>
      <Box sx={{ textAlign: "left" }}>
        <ControlHeading2 variant="h2" color="primary">
          Types of data collected
        </ControlHeading2>
        <p>
          When registering on our site, as appropriate, we collect information
          from you in order to provide and improve upon our service.
        </p>
        <p>We also may collect your:</p>
        <ul>
          <li>
            <p>First name</p>
          </li>
          <li>
            <p>Last name</p>
          </li>
          <li>
            <p>Email address</p>
          </li>
          <li>
            <p>Birth date or birth year</p>
          </li>
          <li>
            <p>Gender</p>
          </li>
        </ul>
        <p>
          Additionally, if you register using Facebook or Google, you may be
          asked for further information specific to your Facebook or Google
          account. (Typically this will include your public profile
          information.) It is Facebook and Google&apos;s responsibility that a
          list of this information be shown to you, so that you can accept or
          deny those requests at the time of registration.
        </p>
        <ControlHeading2 variant="h2" color="primary">
          Purposes of collecting data
        </ControlHeading2>
        <p>
          We collect your email address in order to send periodic emails, to
          contact you in regards to your Pollee account, and to identify your
          account. Do note that you may unsubscribe from our periodic emails at
          any time, using the link at the bottom of any email you&apos;ve
          received from us.
        </p>
        <p>
          We collect your first name, last name, gender, and birth date or year
          in order to customize your experience, and to conduct research.
        </p>
        <p>
          Any actions performed on Pollee are collected and retained as a core
          function of providing and maintaining our service and may be used
          without identifying information in scientific research.
        </p>
        <ControlHeading2 variant="h2" color="primary">
          Deletion of personal data
        </ControlHeading2>
        <p>
          Account deletion is as laid out in our
          <ControlLink to="/terms"> Terms and Conditions</ControlLink>,
          paragraph
          <strong> Termination</strong>. To have an account registration and
          data associated with it deleted, use the <strong>Delete </strong>
          option from your
          <ControlLink to="/profile"> profile</ControlLink> page or contact our
          customer service via this{" "}
          <ControlLink to="/contact">contact form</ControlLink> indicating
          <i> Please delete my account</i> as a request text.
        </p>
        <p>
          Some information associated with deleted accounts is retained in order
          to maintain the service for other users, for statistical and
          historical purposes, and for use in scientific research.
        </p>
        <ControlHeading2 variant="h2" color="primary">
          Data sharing and third-parties
        </ControlHeading2>
        <p>
          We do not disclose any information to outside parties except as per
          your request.
        </p>
        <p>
          Except in the case of a merger or acquisition, your information,
          whether public or private, will not be sold, exchanged, transferred,
          or given to any other company for any reason whatsoever, without your
          consent, other than for the express purpose of delivering the
          purchased product or service requested.
        </p>
        <p>
          This does not include trusted third parties who assist us in operating
          our website, conducting our business, or servicing you, so long as
          those parties agree to keep this information confidential. We may also
          release your information when we believe release is appropriate to
          comply with the law, enforce our site policies, or protect our or
          others' rights, property, or safety. However, non-personally
          identifiable visitor information may be provided to other parties for
          marketing, advertising, or other uses.
        </p>
        <ControlHeading2 variant="h2" color="primary">
          Data protection security controls
        </ControlHeading2>
        <p>
          We implement a variety of security measures to maintain the safety of
          your personal information when you submit or access your personal
          information.
        </p>
        <p>
          We offer the use of a secure server. All supplied sensitive/credit
          information is transmitted via Secure Socket Layer (SSL) technology
          and then encrypted into our payment gateway providers database only to
          be accessible by those authorized with special access rights to such
          systems, and are required to keep the information confidential.
        </p>
        <p>
          After a transaction, sensitive information (such as credit card
          numbers) is never stored on our servers.
        </p>
      </Box>
    </>
  )
}
