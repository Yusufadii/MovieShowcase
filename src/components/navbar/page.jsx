import React from 'react';
import { Input } from '../ui/input';
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, } from "../ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link';
import { Bell, ChevronDown } from 'lucide-react';

export default function Navbar() {
  return (
    <div className='flex flex-col-reverse md:flex-row  justify-between items-center mt-5 w-full max-w-[1200px] mx-auto'>
        <div className='flex flex-col md:flex-row items-center gap-3'>
            <Input type="text" placeholder="Search Movies" className='w-[300px] rounded-3xl'/>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className='text-[16px] text-[#B6B6B6] bg-[#EDEEF0] rounded-[39px] font-semibold hover:text-[#fff] hover:bg-[#141D2E] px-6 transition duration-500 ease-in-out'>
                            <Link href="/docs">Movies</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className='text-[16px] text-[#B6B6B6] bg-[#EDEEF0] rounded-[39px] font-semibold hover:text-[#fff] hover:bg-[#141D2E] px-6 transition duration-500 ease-in-out'>
                            <Link href="/docs">TV Series</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className='text-[16px] text-[#B6B6B6] bg-[#EDEEF0] rounded-[39px] font-semibold hover:text-[#fff] hover:bg-[#141D2E] px-6 transition duration-500 ease-in-out'>
                            <Link href="/docs">Top Rated</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className='text-[16px] text-[#B6B6B6] bg-[#EDEEF0] rounded-[39px] font-semibold hover:text-[#fff] hover:bg-[#141D2E] px-6 transition duration-500 ease-in-out'>
                            <Link href="/docs">Artist</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
      <div className='flex gap-3'>
        <button className='bg-[#141D2E] rounded-full p-3 hover:bg-[#002977] transition duration-500 ease-in-out'><Bell className='text-[#fff] size-5'/></button>
        <button className='bg-[#EDEEF0] rounded-full flex items-center gap-4 px-[20px] py-[7px] hover:bg-[#D3D3D3] transition duration-500 ease-in-out'>
            <div className='flex gap-2 items-center'>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className='text-[16px] font-semibold'>Yusuf Adi</p>
            </div>
            <ChevronDown/>
        </button>
      </div>
    </div>
  )
}