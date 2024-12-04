import React, { useRef, useState } from "react";
import { AiOutlineFile, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import { StyledFile } from "./Tree.style";
import { useTreeContext } from "./TreeContext";
import { ActionsWrapper, StyledName } from "./Tree.style.js";
import { PlaceholderInput } from "./TreePlaceholderInput";
import FILE_ICONS from "./FileIcons";

const File = ({ name, id, parent }) => {
  const [isEditing, setEditing] = useState(false);
  const { state, dispatch, isImparative, onNodeClick } = useTreeContext();
  const ext = useRef("");

  let splitted = name && name.split(".");
  ext.current = splitted && splitted[splitted.length - 1];

  return (
    <StyledFile
      onClick={(event) => {
        event.stopPropagation();
        onNodeClick({
          state,
          name,
          parent,
          type: "file",
        });
      }}
      className="tree__file"
    >
        <ActionsWrapper>
          <StyledName>
            {FILE_ICONS[ext.current] ? (
              FILE_ICONS[ext.current]
            ) : (
              <AiOutlineFile />
            )}
            &nbsp;&nbsp;{name}
          </StyledName>
        </ActionsWrapper>
    </StyledFile>
  );
};

export { File };
