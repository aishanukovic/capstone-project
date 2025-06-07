import { motion } from "framer-motion";

const wave1 =
  "M0,160L60,165.3C120,171,240,181,360,192C480,203,600,213,720,197.3C840,181,960,139,1080,138.7C1200,139,1320,181,1380,202.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z";

const wave2 =
  "M0,160L60,140C120,120,240,80,360,96C480,112,600,176,720,202.7C840,229,960,219,1080,208C1200,197,1320,187,1380,181.3L1440,176L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z";

type Props = {
  sectionIndex: number;
  total: number;
};

export default function ProgressBody({ sectionIndex, total }: Props) {
  const topOffset = 15;
  const bottomOffset = 15;

  const fillableHeight = 100 - topOffset - bottomOffset;
  const percentage = (sectionIndex + 1) / total;
  const adjustedHeight = bottomOffset + percentage * fillableHeight;

  return (
    <div className="absolute left-10 top-20 w-[160px] h-[600px] z-0 pointer-events-none">
      <div
        className="w-full h-full relative bg-gray-50 overflow-hidden"
        style={{
          WebkitMaskImage: "url('/body-outline.png')",
          maskImage: "url('/body-outline.png')",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          backgroundColor: "#d3d3d3",
        }}
      >
        <motion.div
          className="absolute left-0 bottom-0 w-full overflow-hidden"
          initial={{ height: `${bottomOffset}%` }}
          animate={{ height: `${adjustedHeight}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className="w-full h-full opacity-70 rounded-b-full"
            style={{ backgroundColor: "#A259FF" }}
          />

          <motion.svg
            className="absolute left-0 top-0 w-full h-10"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{
              transform: "scaleY(-1)",
              color: "#d3d3d3",
            }}
          >
            <motion.path
              fill="currentColor"
              initial={{ d: wave1 }}
              animate={{ d: wave2 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 3,
                ease: "easeInOut",
              }}
            />
          </motion.svg>
        </motion.div>
      </div>
    </div>
  );
}