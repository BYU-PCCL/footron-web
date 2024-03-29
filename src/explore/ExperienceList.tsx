/** @jsxImportSource @emotion/react */
import React, { memo } from "react";
import { Experience } from "../types/experience";
import { css } from "@emotion/react";
import { Masonry } from "masonic";

const masonicStyle = css`
  margin: 16px 8px;
  width: calc(100% - 16px);

  @media (min-width: 500px) {
    margin: 16px;
    width: calc(100% - 32px);
  }
`;

const tileStyle = (backgroundColor: string) => css`
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${backgroundColor};
  justify-content: center;
  align-items: center;
  transition: transform 100ms ease-in-out;
  width: 100%;
  min-height: 100px;
  cursor: pointer;

  &:active {
    transform: scale(98%);
    -webkit-transform: scale(0.98, 0.98);
  }
`;

const thumbnailStyle = css`
  width: 100%;
  display: flex;
`;

const textStyle = (color: string) => css`
  font-family: "Montserrat", sans-serif;
  margin: 10px 16px;
  width: calc(100% - 32px);
  font-size: 18px;
  color: ${color};
`;

const ExperienceList = ({
  experiences,
  onExperienceClick,
}: {
  experiences: Experience[];
  onExperienceClick: (experience: Experience) => void;
}): JSX.Element => {
  return (
    <div css={masonicStyle}>
      <Masonry
        itemKey={(item) => item?.id}
        items={experiences}
        columnGutter={8}
        columnWidth={148}
        overscanBy={2}
        style={{ outline: "none" }}
        render={({ data }: { data: Experience }) => (
          <ExperienceTile experience={data} onClick={onExperienceClick} />
        )}
      />
    </div>
  );
};

const ExperienceTile = memo(
  ({
    experience,
    onClick,
  }: {
    experience: Experience;
    onClick: (experience: Experience) => void;
  }) => {
    const { colors, thumbnails, title } = experience;
    return (
      <div
        css={tileStyle(colors.primary["40"])}
        onClick={() => onClick(experience)}
      >
        <img css={thumbnailStyle} src={thumbnails.thumb} />
        <p css={textStyle(colors.primary["90"])}>{title}</p>
      </div>
    );
  }
);

ExperienceTile.displayName = "ExperienceTile";

export default ExperienceList;
