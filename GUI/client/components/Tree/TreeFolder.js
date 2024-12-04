import React, { useState, useEffect } from "react";
import {
  AiOutlineFolderAdd,
  AiOutlineFileAdd,
  AiOutlineFolder,
  AiOutlineFolderOpen,
  AiOutlineDelete,
  AiOutlineEdit
} from "react-icons/ai";
import {
  ActionsWrapper,
  Collapse,
  StyledFolder,
  StyledName,
  VerticalLine
} from "./Tree.style";
import { useTreeContext } from "./TreeContext";
import { PlaceholderInput } from "./TreePlaceholderInput";

const FolderName = ({ isOpen, name, handleClick }) => (
  <StyledName onClick={handleClick}>
    {isOpen ? <AiOutlineFolderOpen /> : <AiOutlineFolder />}
    &nbsp;&nbsp;{name}
  </StyledName>
);

const Folder = ({ id, name, level, children, parentPath }) => {
  const { state, dispatch, isImparative, onNodeClick } = useTreeContext();
  const [isEditing, setEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [childs, setChilds] = useState([]);

  // increase `level` recursively
  // defaultProps comes in on each cycle
  useEffect(() => {
    const nestedChilds = React.Children.map(children, item => {
      if (item.type === Folder) {
        return React.cloneElement(item, {
          level: level + 1,
          parentPath: `${parentPath}/${name}`
        });
      }
      return item;
    });
    setChilds(nestedChilds);
  }, [children]);

  const handleFileCreation = event => {
    event.stopPropagation();
    setIsOpen(true);
    setChilds([
      ...childs,
      <PlaceholderInput
        type="file"
        handleSubmit={name => {
          dispatch({ type: "CREATE_FILE", payload: { id, name } });
        }}
      />
    ]);
  };

  const handleFolderCreation = event => {
    event.stopPropagation();
    setIsOpen(true);
    setChilds([
      ...childs,
      <PlaceholderInput
        type="folder"
        folderLevel={level}
        handleSubmit={name => {
          dispatch({ type: "CREATE_FOLDER", payload: { id, name } });
        }}
      />
    ]);
  };

  const handleDeleteFolder = () => {
    dispatch({ type: "DELETE_FOLDER", payload: { id } });
  };
  const handleFolderRename = name => {
    setIsOpen(true);
    setEditing(true);
  };

  return (
    <StyledFolder
      onClick={event => {
        event.stopPropagation();
        onNodeClick({
          state,
          name,
          level,
          path: `${parentPath}/${name}`,
          type: "folder"
        });
      }}
      className="tree__folder"
      indent={level}
    >
      <VerticalLine>
        <ActionsWrapper>
            <FolderName
              name={name}
              isOpen={isOpen}
              handleClick={() => setIsOpen(!isOpen)}
            />
        </ActionsWrapper>
        <Collapse className="tree__folder--collapsible" isOpen={isOpen}>
          {childs}
        </Collapse>
      </VerticalLine>
    </StyledFolder>
  );
};
Folder.defaultProps = { level: 1, parentPath: "" };

export { Folder, FolderName };
