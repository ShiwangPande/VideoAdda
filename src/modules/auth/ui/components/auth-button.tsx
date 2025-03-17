'use client'
import { Button } from "@/components/ui/button";
import { ClapperboardIcon, UserCircleIcon } from "lucide-react";
import { UserButton, SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
export const AuthButton = () => {


    return ( 
        <>
        <SignedIn>
            <UserButton  appearance={{
          elements: {
            userButtonAvatarBox: "w-10 h-10", // Change size (Default: w-8 h-8)
          },
        }} >
               <UserButton.MenuItems>
                {/* todo: add use profile menu */}
                     <UserButton.Link label="Studio" href="/studio" labelIcon={<ClapperboardIcon className="size-4"/>}/>
                     <UserButton.Action label="manageAccount"/>
                </UserButton.MenuItems>
            </UserButton>
        </SignedIn>
        <SignedOut>
            <SignInButton mode="modal">
                <Button variant={"outline"} className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/2 rounded-full shadow-none ">
                    <UserCircleIcon />
                    Sign in
                </Button>
            </SignInButton>
            </SignedOut>
            </>
    );
}