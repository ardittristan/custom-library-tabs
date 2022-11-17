declare global {
  interface Window {
    collectionStore: {
      GetCollection: (id: string) => { displayName: string; allApps: any[] } | undefined;
      m_mapCollectionStorage: {
        mapinternal: Map<string, string>;
      };
    };
    webpackChunksteamui: (number[] | ((r: any) => void) | {})[][];
    webpackJsonp: (number[] | ((r: any) => void) | {})[][];
  }
}

export {};
