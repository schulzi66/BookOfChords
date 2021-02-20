export interface INavbarAction {
  order: number;
  icon: string;
  action: () => any;
  validator?: () => boolean;
}
