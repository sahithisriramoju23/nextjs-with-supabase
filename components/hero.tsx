import { NextLogo } from "./next-logo";
import { SupabaseLogo } from "./supabase-logo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";
import carouselImage from '../app/twitter-image.png';

export function Hero() {
  return (
      <Carousel opts={{ align: "center", loop: true, containScroll: false }}
        className="w-screen">
        <CarouselContent>
          <CarouselItem>
            <div className="relative aspect-video w-full overflow-hidden">
              <Image src={carouselImage} alt="carousel image" placeholder="blur" fill sizes="100vw" className="object-cover"></Image>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative aspect-video w-full overflow-hidden">
              <Image src={carouselImage} alt="carousel image" placeholder="blur" fill sizes="100vw" className="object-cover"></Image>
            </div>
          </CarouselItem>
          <CarouselItem>
              <div className="relative aspect-video w-full overflow-hidden">
              <Image src={carouselImage} alt="carousel image" placeholder="blur" fill sizes="100vw" className="object-cover"></Image>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </Carousel>

    /*<div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <a
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          rel="noreferrer"
        >
          <SupabaseLogo />
        </a>
        <span className="border-l rotate-45 h-6" />
        <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
          <NextLogo />
        </a>
      </div>
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        The fastest way to build apps with{" "}
        <a
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Supabase
        </a>{" "}
        and{" "}
        <a
          href="https://nextjs.org/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Next.js
        </a>
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>*/
  );
}
