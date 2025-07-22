import React from 'react';
import { Card, Stack, Group, Skeleton, Box } from '@mantine/core';

const CryptoCardSkeleton = ({ variant = 'detailed' }) => {
  return (
    <Card
      withBorder
      p="lg"
      radius="xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: variant === 'detailed' ? '280px' : '200px'
      }}
    >
      {/* Animated shimmer overlay */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          animation: 'shimmer 2s infinite ease-in-out',
          zIndex: 1
        }}
      />
      
      <Stack gap="md" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header with icon and name */}
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <Skeleton height={32} width={32} radius="50%" />
            <Box>
              <Skeleton height={16} width={80} mb="xs" />
              <Skeleton height={12} width={50} />
            </Box>
          </Group>
          <Skeleton height={20} width={60} radius="xl" />
        </Group>

        {/* Price section */}
        <Box>
          <Skeleton height={28} width={120} mb="xs" />
          <Skeleton height={14} width={90} />
        </Box>

        {/* Stats grid */}
        <Group grow>
          <Box style={{ textAlign: 'center' }}>
            <Skeleton height={12} width="80%" mx="auto" mb="xs" />
            <Skeleton height={16} width="60%" mx="auto" />
          </Box>
          <Box style={{ textAlign: 'center' }}>
            <Skeleton height={12} width="80%" mx="auto" mb="xs" />
            <Skeleton height={16} width="60%" mx="auto" />
          </Box>
        </Group>

        {/* Action buttons */}
        <Group grow>
          <Skeleton height={36} radius="xl" />
          <Skeleton height={36} radius="xl" />
        </Group>
      </Stack>

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </Card>
  );
};

export default CryptoCardSkeleton;
