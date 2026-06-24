declare module "lucide-react" {
  import * as React from "react";

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;

  export const Accessibility: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Ban: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Bell: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const CheckSquare: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Download: LucideIcon;
  export const Eye: LucideIcon;
  export const Filter: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Loader2: LucideIcon;
  export const Lock: LucideIcon;
  export const LogOut: LucideIcon;
  export const Mail: LucideIcon;
  export const MapPin: LucideIcon;
  export const Menu: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const MoreVertical: LucideIcon;
  export const Package: LucideIcon;
  export const Phone: LucideIcon;
  export const Plus: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Save: LucideIcon;
  export const Search: LucideIcon;
  export const Send: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const Square: LucideIcon;
  export const Star: LucideIcon;
  export const Trash2: LucideIcon;
  export const Truck: LucideIcon;
  export const Upload: LucideIcon;
  export const User: LucideIcon;
  export const UserCircle: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Users: LucideIcon;
  export const X: LucideIcon;
}
