export interface INavigation {
  _id?: string;
  label: string; // Display text (e.g., "About", "Services")
  href: string; // URL/anchor (e.g., "#about", "/about", "https://example.com")
  order: number; // Display order (1, 2, 3...)
  isActive: boolean; // Show/hide in navigation
  openInNewTab: boolean; // For external links
  isExternal: boolean; // Internal section vs external URL
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INavigationFormData {
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  openInNewTab: boolean;
  isExternal: boolean;
}
