import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { AuthButtons } from "./AuthButtons";

interface MobileMenuProps {
  session: any;
  isAdmin: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const MobileMenu = ({
  session,
  isAdmin,
  isOpen,
  onOpenChange,
  onNavigate,
  onSignIn,
  onSignOut,
}: MobileMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6 text-gray-300" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-gray-900/95 border-gray-700">
        <div className="flex flex-col gap-4 mt-8">
          <NavLinks
            session={session}
            isAdmin={isAdmin}
            onNavigate={onNavigate}
            className="flex flex-col gap-4"
          />
          <AuthButtons
            session={session}
            onSignIn={onSignIn}
            onSignOut={onSignOut}
            className="flex flex-col gap-4"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};