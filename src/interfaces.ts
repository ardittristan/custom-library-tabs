export type Tabs = {
  id: string;
  show: boolean;
}[];

export interface Settings {
  savedTabs: Tabs;
}
