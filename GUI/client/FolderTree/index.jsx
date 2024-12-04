import { useEffect, useMemo, useState } from "react";

import { BeatLoader } from "react-spinners";

import Tree from "../components/Tree/Tree";

const FolderTree = () => {
  const [folderTree, setFolderTree] = useState();

  useEffect(() => {
    fetch("/tree").then(async (res) => {
      const data = await res.json();
      setFolderTree(data);
    });
  }, []);

  useEffect(() => {
    const onRefetch = () => {
      fetch("/tree").then(async (res) => {
        const data = await res.json();
        setFolderTree(data);
      });
    };

    window.addEventListener("refetchTree", onRefetch);

    return () => {
      window.removeEventListener("refetchTree", onRefetch);
    };
  }, []);

  return (
    <div>
      {folderTree ? (
        <Tree data={folderTree} />
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <BeatLoader color="#36d7b7" />
        </div>
      )}
    </div>
  );
};

export default FolderTree;
