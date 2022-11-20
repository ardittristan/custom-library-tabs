import { definePlugin, PanelSection, PanelSectionRow, ServerAPI, staticClasses } from "decky-frontend-lib";
import { VFC } from "react";
import { FaShip } from "react-icons/fa";

import { Tabs } from "./interfaces";
import { getSetting, setServer } from "./python";
import { patchTabs } from "../patches/tabs";
import { patch, PatchAddress } from "../patches/patchservice";
import { App } from "../patches/tabmenu";

// These match Steam's default library tabs
let desiredTabs: Tabs = [
  { id: "DeckGames", show: true },
  { id: "AllGames", show: true },
  { id: "Installed", show: true },
  { id: "Favorites", show: true },
  { id: "Collections", show: true },
  { id: "DesktopApps", show: true },
];

const Content: VFC<{ serverAPI: ServerAPI; tabs: Tabs }> = ({ serverAPI: _serverAPI, tabs: tabs }) => {
  return (
    <PanelSection title="Settings">
      <PanelSectionRow>
        <App tabs={tabs} />
      </PanelSectionRow>
    </PanelSection>
  );
};

let patchAddr: PatchAddress | undefined;

export default definePlugin((serverApi: ServerAPI) => {
  setServer(serverApi);

  getSetting("savedTabs", desiredTabs).then(async (savedTabs) => {
    if (savedTabs) {
      desiredTabs = savedTabs;
    }

    patchAddr = await patchTabs(desiredTabs);
  });

  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <Content serverAPI={serverApi} tabs={desiredTabs} />,
    icon: <FaShip />,
    onDismount() {
      document.querySelectorAll("[data-custom-library-tabs]").forEach((node) => node.remove());
      if (patchAddr) patch.removePatch(patchAddr);
    },
  };
});
