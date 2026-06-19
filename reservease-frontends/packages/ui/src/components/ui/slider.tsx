import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center py-3", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2.5 w-full grow rounded-full bg-secondary shadow-inner">
      {/* White end caps for visual drag affordance */}
      <div className="absolute left-0 top-0 h-full w-3 rounded-l-full bg-secondary" />
      <div className="absolute right-0 top-0 h-full w-3 rounded-r-full bg-background/80 border-r border-border/30" />
      <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="relative block h-7 w-7 rounded-full border-2 border-primary bg-white shadow-[0_2px_12px_rgba(0,0,0,0.2),0_0_0_3px_hsl(var(--primary)/0.15)] ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-50">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-primary" />
      </div>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
