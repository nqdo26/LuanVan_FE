import { motion } from 'framer-motion';

function AIChatPageIntro({ text }) {
    return (
        <h1 style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    style={{ display: 'inline-block' }}
                >
                    {char}
                </motion.span>
            ))}
        </h1>
    );
}

export default AIChatPageIntro;
