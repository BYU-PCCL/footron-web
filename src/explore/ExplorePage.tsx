/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Experience } from "../types/experience";
import { useCurrentExperienceMutation } from "../common/services/hooks/api";
import {
  useCurrentExperience,
  useExperiences,
} from "../common/services/hooks/api";
import PageWidth from "../common/PageWidth";
import ExploreCollapsingHeader from "./ExploreCollapsingHeader";
import ExperienceList from "./ExperienceList";
import ExperienceModal from "./ExperienceModal";
import { hasControls } from "../controls/util";
import { useHistory } from "react-router-dom";
import { superheadingStyle } from "./styles";

const MemoizedExperienceList = memo(ExperienceList);

const headerTextContainerStyle = css`
  position: relative;
  overflow: hidden;
  flex-direction: column;
  padding: 32px 16px 0;
`;

const ExplorePage = (): JSX.Element => {
  const currentExperienceMutation = useCurrentExperienceMutation();
  const { data: experiencesMap } = useExperiences();
  const { data: currentExperience } = useCurrentExperience();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [experiencesWithoutCurrent, setExperiencesWithoutCurrent] = useState<
    Experience[]
  >([]);

  const [dialogExperience, setDialogExperience] = useState<
    Experience | undefined
  >();

  const onExperienceClicked = useCallback(
    (experience: Experience) => {
      setDialogExperience(experience);
    },
    [experiences, setDialogExperience]
  );

  useEffect(() => {
    let experiencesWithout = [...experiences];
    if (currentExperience) {
      experiencesWithout = experiencesWithout.filter(
        (experience) => experience.id !== currentExperience.id
      );
    }
    setExperiencesWithoutCurrent(experiencesWithout);
  }, [experiences, currentExperience]);

  const history = useHistory();

  const onExperienceLaunched = useCallback(
    (experience: Experience) => {
      currentExperienceMutation.mutate(experience.id);
      onDialogClosed();
      if (hasControls(experience.id)) {
        history.push(`/controls/${experience.id}`);
      }
    },
    [experiences, setDialogExperience]
  );

  const onDialogClosed = () => {
    setDialogExperience(undefined);
  };

  useEffect(() => {
    if (!experiencesMap) {
      return;
    }
    setExperiences(Object.values(experiencesMap));
  }, [experiencesMap]);

  return (
    <PageWidth>
      <ExperienceModal
        experience={dialogExperience}
        onClose={onDialogClosed}
        onLaunch={onExperienceLaunched}
      />
      <ExploreCollapsingHeader experience={currentExperience} />
      <div css={headerTextContainerStyle}>
        <h2 css={superheadingStyle}>Try Something Else</h2>
      </div>
      {experiencesWithoutCurrent.length > 0 && (
        <MemoizedExperienceList
          experiences={experiencesWithoutCurrent}
          onExperienceClick={onExperienceClicked}
        />
      )}
    </PageWidth>
  );
};
export default ExplorePage;
