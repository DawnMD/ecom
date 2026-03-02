import { Car, Map, Shield } from "lucide-react";

export const ShippingBar = () => {
  return (
    <div className="bg-foreground text-background p-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Map size={16} />
          <span>Ship to IND</span>
        </div>
        <div className="items-center gap-2 hidden md:flex">
          <div className="flex items-center gap-2 ">
            <Map size={16} />
            <span>Trusted Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <Car size={16} />
            <span>Easy Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} />
            <span>Secure Shopping</span>
          </div>
        </div>
      </div>
    </div>
  );
};
