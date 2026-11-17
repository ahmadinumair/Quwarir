import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useEditorialScrollReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Subtle editorial fade + slight Y-axis translation for section headlines
      const headlines = gsap.utils.toArray<HTMLElement>(
        '[data-gsap-reveal="headline"]',
        root
      );

      headlines.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      // Architectural fade + slight Y-axis translation for section containers & panels
      const containers = gsap.utils.toArray<HTMLElement>(
        '[data-gsap-reveal="container"]',
        root
      );

      containers.forEach((el) => {
        const delayAttr = el.getAttribute("data-gsap-delay");
        const delay = delayAttr ? parseFloat(delayAttr) : 0;

        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      // Museum-grade masked wipe reveal for editorial photography frames
      const imageFrames = gsap.utils.toArray<HTMLElement>(
        '[data-gsap-reveal="image"]',
        root
      );

      imageFrames.forEach((el) => {
        const img = el.querySelector("img");
        gsap.fromTo(
          el,
          { clipPath: "inset(8% 0% 0% 0%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            clearProps: "clipPath,opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              once: true,
            },
          }
        );

        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.06 },
            {
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: el,
                start: "top 86%",
                once: true,
              },
            }
          );
        }
      });

      // Subtle scroll-linked parallax for marked architectural elements
      const parallaxItems = gsap.utils.toArray<HTMLElement>(
        "[data-gsap-parallax]",
        root
      );

      parallaxItems.forEach((el) => {
        const shiftAttr = el.getAttribute("data-gsap-parallax");
        const shift = shiftAttr ? parseFloat(shiftAttr) : -24;
        gsap.to(el, {
          y: shift,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      // Staggered editorial lists and value columns
      const staggerGroups = gsap.utils.toArray<HTMLElement>(
        "[data-gsap-stagger-group]",
        root
      );

      staggerGroups.forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>(
          "[data-gsap-stagger-item]",
          group
        );
        if (items.length === 0) return;

        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: group,
              start: "top 86%",
              once: true,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    });

    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
      mm.revert();
    };
  }, [rootRef]);
}
