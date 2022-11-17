import {
  ButtonItem,
  definePlugin,
  DialogButton,
  Menu,
  MenuItem,
  PanelSection,
  PanelSectionRow,
  Router,
  ServerAPI,
  showContextMenu,
  staticClasses,
} from "decky-frontend-lib";
import { ReactElement, VFC } from "react";
import { FaShip } from "react-icons/fa";

import logo from "../assets/logo.png";
import { Tabs } from "./interfaces";
import { getSetting, setServer } from "./python";
import { patchTabs } from "../patches/tabs";
import { patch, PatchAddress } from "../patches/patchservice";

// These match Steam's default library tabs
let desiredTabs: Tabs = [
  { id: "DeckGames", show: true },
  { id: "AllGames", show: true },
  { id: "Installed", show: true },
  { id: "Favorites", show: true },
  { id: "Collections", show: true },
  { id: "DesktopApps", show: true },
];

// interface AddMethodArgs {
//   left: number;
//   right: number;
// }

const Content: VFC<{ serverAPI: ServerAPI; tabs: Tabs }> = ({ serverAPI: _serverAPI, tabs: _tabs }) => {
  // const [result, setResult] = useState<number | undefined>();

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };

  return (
    <PanelSection title="Panel Section">
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={(e) =>
            showContextMenu(
              <Menu label="Menu" cancelText="CAAAANCEL" onCancel={() => {}}>
                <MenuItem onSelected={() => {}}>Item #1</MenuItem>
                <MenuItem onSelected={() => {}}>Item #2</MenuItem>
                <MenuItem onSelected={() => {}}>Item #3</MenuItem>
              </Menu>,
              e.currentTarget ?? window
            )
          }
        >
          Server says yolo
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} />
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            Router.CloseSideMenus();
            Router.Navigate("/decky-plugin-test");
          }}
        >
          Router
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

const DeckyPluginRouterTest: VFC = () => {
  return (
    <div style={{ marginTop: "50px", color: "white" }}>
      Hello World!
      <DialogButton onClick={() => Router.NavigateToStore()}>Go to Store</DialogButton>
    </div>
  );
};

let patchAddr: PatchAddress | undefined;

export default definePlugin((serverApi: ServerAPI) => {
  setServer(serverApi);

  serverApi.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
    exact: true,
  });

  console.log("a");
  console.log(serverApi);

  getSetting("savedTabs", desiredTabs).then(async (savedTabs) => {
    if (savedTabs) {
      desiredTabs = savedTabs;
    }

    patchAddr = await patchTabs(desiredTabs);
  });

  const libraryPatch = serverApi.routerHook.addPatch("/library/app/:appid", (props: { path: string; children: ReactElement }) => {
    console.log(props);
    return props;
  });

  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <Content serverAPI={serverApi} tabs={desiredTabs} />,
    icon: <FaShip />,
    onDismount() {
      serverApi.routerHook.removeRoute("/decky-plugin-test");
      serverApi.routerHook.removePatch("/library/app/:appid", libraryPatch);
      document.querySelectorAll("[data-custom-library-tabs]").forEach((node) => node.remove());
      if (patchAddr) patch.removePatch(patchAddr);
    },
  };
});
