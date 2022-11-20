import { Menu, MenuItem } from "decky-frontend-lib";
import { useCallback, useMemo, VFC } from "react";
import { Tabs } from "./interfaces";

export const AddCollection: VFC<{
  onClose: () => void;
  saveAndUpdate: (tabs: Tabs) => void;
  tabs: Tabs;
}> = ({ onClose, saveAndUpdate, tabs }) => {
  const collections = useMemo(() => {
    const alreadyAdded = tabs.map((t) => t.id);

    let res = [];

    for (const [id, json] of window.collectionStore.m_mapCollectionStorage.mapInternal) {
      if (alreadyAdded.includes(id)) {
        continue;
      }

      const data = JSON.parse(json);
      res.push({
        id,
        displayName: data.name,
      });
    }

    return res;
  }, []);

  const handleAdd = useCallback(
    (id: string) => {
      tabs.unshift({
        id,
        show: true,
      });
      saveAndUpdate([...tabs]);
      onClose();
    },
    [onClose, saveAndUpdate, tabs]
  );

  return (
    <Menu label="Collections" cancelText="Close" onCancel={onClose}>
      {collections.map(({ id, displayName }) => (
        <MenuItem
          onSelected={() => {
            handleAdd(id);
          }}
        >
          {displayName}
        </MenuItem>
      ))}
    </Menu>
  );
};
