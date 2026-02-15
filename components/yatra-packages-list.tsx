import { mock_yatra_data } from "@/data/mock-yatra-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const YatraPackagesList = () => {
return (
    <div className="flex flex-row">
        {mock_yatra_data.map((item,index) => {
            return(
                 <Card key={index} className="relative mx-auto w-full max-w-sm pt-0">
                    <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                     <Image
                        src="https://avatar.vercel.sh/shadcn1"
                        alt="Event cover"
                        width={100}
                        height={100}
                        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                    />
                    <CardHeader>
                        <CardAction>
                            <Badge variant="secondary">Featured</Badge>
                        </CardAction>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>
                            {item.description}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full">
                            Book Yatra
                        </Button>
                    </CardFooter>
                </Card>
            )
        })}
   
    </div>
)
}