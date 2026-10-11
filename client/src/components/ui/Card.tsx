import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils.js';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-purple-950/20',
        className
      )}
      {...props}
    >
      {/* Specular top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};

export const TiltCard: React.FC<CardProps & { glareColor?: string }> = ({
  className,
  children,
  glareColor = 'rgba(139, 92, 246, 0.15)',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'glass-panel rounded-2xl p-6 relative overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-2xl hover:shadow-purple-900/30',
        className
      )}
      {...(props as any)}
    >
      {/* Dynamic Specular Lighting Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at 50% 50%, ${glareColor}, transparent 80%)`,
        }}
      />
      <div style={{ transform: 'translateZ(30px)' }}>{children}</div>
    </motion.div>
  );
};

export const GradientBorderCard: React.FC<CardProps & { gradient?: string }> = ({
  className,
  children,
  gradient = 'from-purple-500 via-cyan-400 to-pink-500',
  ...props
}) => {
  return (
    <div className={cn('relative p-[1px] rounded-2xl overflow-hidden group', className)} {...props}>
      {/* Animated Gradient Glow Border */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity duration-500',
          gradient
        )}
      />
      <div className="relative bg-bg-1/90 backdrop-blur-xl rounded-[15px] p-6 h-full text-white">
        {children}
      </div>
    </div>
  );
};
