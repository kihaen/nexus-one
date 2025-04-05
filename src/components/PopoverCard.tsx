import React, { forwardRef } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PopoverCardProps {
  title?: string;
  description?: string;
  footer?: JSX.Element;
  postId?: string;
  onClose: () => void;
  display?: string;
  coverImage: string;
}

const PopoverCard = forwardRef<HTMLDivElement, PopoverCardProps>(
  (
    {
      title,
      description,
      footer,
      postId,
      coverImage,
      onClose,
      display = "flex",
    }: PopoverCardProps,
    ref
  ) => {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (postId) {
        router.push(`/p/${postId}`);
      }
    };

    return (
      <Card
        ref={ref}
        className={`
          min-w-[300px] max-w-[500px] h-[150px] mt-4 overflow-hidden
          flex ${display === "none" ? "hidden" : "flex"} border
        `}
      >
        <div
          className="relative w-[100px] h-full min-w-[100px] cursor-pointer"
          onClick={handleClick}
        >
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover image"
              className="object-cover w-full h-full"
            />
          )}
        </div>

        <div className="flex flex-col flex-1 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 w-6 h-6 p-1 rounded-full"
            onClick={onClose}
          >
            <X className="w-3 h-3" />
          </Button>

          <CardHeader className="p-3 pb-0 space-y-0">
            <CardTitle
              className="text-sm font-medium cursor-pointer"
              onClick={handleClick}
            >
              {title || ""}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-3 pt-1">
            <CardDescription className="text-xs">
              {description || ""}
            </CardDescription>
          </CardContent>

          {footer && (
            <CardFooter className="p-3 pt-0 text-xs">{footer}</CardFooter>
          )}
        </div>
      </Card>
    );
  }
);

PopoverCard.displayName = "PopoverCard";

export default PopoverCard;
