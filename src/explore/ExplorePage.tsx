/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useFolders } from "../common/services/hooks/api";
import { useCurrentExperience } from "../common/services/hooks/api";
import PageWidth from "../common/PageWidth";
import ExploreCollapsingHeader from "./ExploreCollapsingHeader";
import ExperienceFolder from "./ExperienceFolder";
import { useNavigate } from "react-router-dom";
import { superheadingStyle } from "./styles";
import { Folder } from "../types/folder";

const MemoizedFolderList = memo(ExperienceFolder);

const headerTextContainerStyle = css`
  position: relative;
  overflow: hidden;
  flex-direction: column;
  padding: 32px 16px 0;
`;

const ExplorePage = (): JSX.Element => {
  const { data: foldersMap } = useFolders();
  const { data: currentExperience } = useCurrentExperience();
  const [folders, setFolders] = useState<Folder[]>([]);
  const navigate = useNavigate();

  const onFolderClicked = useCallback(
    (folder: Folder) => {
      navigate(`/explore/${folder.id}`);
    },
    [navigate, folders]
  );

  useEffect(() => {
    if (!foldersMap) {
      return;
    }
    setFolders(Object.values(foldersMap));
  }, [foldersMap]);

  const experienceVisible = currentExperience && !currentExperience?.unlisted;

  return (
    <PageWidth>
      <ExploreCollapsingHeader experience={currentExperience} />
      <div css={headerTextContainerStyle}>
        <h2 css={superheadingStyle}>
          {experienceVisible ? "Try Something Else" : "Explore"}
        </h2>
      </div>
      {folders.length > 0 && (
        <MemoizedFolderList folders={folders} onFolderClick={onFolderClicked} />
      )}
    </PageWidth>
  );
};
export default ExplorePage;
