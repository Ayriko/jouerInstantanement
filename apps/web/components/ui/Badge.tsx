'use client';

import * as motion from 'motion/react-client';

export default function Badge({ discount }: { discount: number }) {
    const bgColor = discount >= 50 ? 'bg-red-600' : 'bg-green-600';

    return (
        <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`${bgColor} text-white text-xs font-bold px-2 py-1 rounded`}
        >
            -{discount}%
        </motion.span>
    );
}
