'use client';

import { useScroll, useTransform, motion } from 'motion/react';
import { useRef } from 'react';

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  /** Array of images to be displayed in the parallax effect max 7 images */
  images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className="absolute top-0 flex h-full w-full items-center justify-center pointer-events-none"
            >
              <div 
                className={`relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl pointer-events-auto transition-all duration-300 hover:border-white/20 hover:shadow-[#00E5FF]/10 ${
                  index === 0 ? 'h-[25vh] w-[25vw]' : ''
                } ${
                  index === 1 ? '-top-[30vh] left-[5vw] h-[30vh] w-[35vw]' : ''
                } ${
                  index === 2 ? '-top-[10vh] -left-[25vw] h-[45vh] w-[20vw]' : ''
                } ${
                  index === 3 ? 'left-[27.5vw] h-[25vh] w-[25vw]' : ''
                } ${
                  index === 4 ? 'top-[27.5vh] left-[5vw] h-[25vh] w-[20vw]' : ''
                } ${
                  index === 5 ? 'top-[27.5vh] -left-[22.5vw] h-[25vh] w-[30vw]' : ''
                } ${
                  index === 6 ? 'top-[22.5vh] left-[25vw] h-[15vh] w-[15vw]' : ''
                }`}
              >
                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
