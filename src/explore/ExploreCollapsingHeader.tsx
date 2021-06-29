/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import NowPlaying from "./NowPlaying";
import Header from "../common/Header";
import { Experience } from "../types/experience";

const ExploreCollapsingHeader = ({
  collapsed,
  experience,
}: {
  collapsed: boolean;
  experience: Experience;
}): JSX.Element => {
  return (
    <div>
      <Header collapsed={collapsed} />
      <NowPlaying fixed={collapsed} experience={experience} />
    </div>
  );
};

export default ExploreCollapsingHeader;