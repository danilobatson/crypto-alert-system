import { Box, Stack, Group, Card, Skeleton as MantineSkeleton } from '@mantine/core'

export const CryptoCardSkeleton = ({ variant = 'default' }) => {
  return (
    <Card 
      withBorder 
      style={{ 
        minHeight: 200,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Stack gap="md">
        {/* Header section */}
        <Group justify="space-between" align="flex-start">
          <Group gap="md">
            <MantineSkeleton 
              height={48} 
              width={48} 
              radius="xl"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Stack gap={4}>
              <MantineSkeleton 
                height={16} 
                width={80} 
                radius="sm"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              />
              <MantineSkeleton 
                height={12} 
                width={60} 
                radius="sm"
                style={{ background: 'rgba(255, 255, 255, 0.08)' }}
              />
            </Stack>
          </Group>
          
          <Stack gap={4} align="flex-end">
            <MantineSkeleton 
              height={20} 
              width={120} 
              radius="sm"
              style={{ background: 'rgba(255, 255, 255, 0.12)' }}
            />
            <MantineSkeleton 
              height={14} 
              width={80} 
              radius="sm"
              style={{ background: 'rgba(255, 255, 255, 0.08)' }}
            />
          </Stack>
        </Group>

        {/* Stats section */}
        <Group justify="space-between">
          <Stack gap={4} style={{ flex: 1 }}>
            <MantineSkeleton 
              height={10} 
              width="60%" 
              radius="xs"
              style={{ background: 'rgba(255, 255, 255, 0.08)' }}
            />
            <MantineSkeleton 
              height={16} 
              width="80%" 
              radius="sm"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            />
          </Stack>
          
          <Stack gap={4} style={{ flex: 1 }}>
            <MantineSkeleton 
              height={10} 
              width="70%" 
              radius="xs"
              style={{ background: 'rgba(255, 255, 255, 0.08)' }}
            />
            <MantineSkeleton 
              height={16} 
              width="90%" 
              radius="sm"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            />
          </Stack>
        </Group>

        {/* Action buttons */}
        <Group justify="space-between" mt="md">
          <MantineSkeleton 
            height={32} 
            width={80} 
            radius="xl"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
          />
          <MantineSkeleton 
            height={32} 
            width={80} 
            radius="xl"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
          />
          <MantineSkeleton 
            height={32} 
            width={32} 
            radius="xl"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
          />
        </Group>

        {/* Progress bar */}
        <Box mt="xs">
          <Group justify="space-between" align="center" mb={4}>
            <MantineSkeleton 
              height={10} 
              width={80} 
              radius="xs"
              style={{ background: 'rgba(255, 255, 255, 0.08)' }}
            />
            <MantineSkeleton 
              height={10} 
              width={30} 
              radius="xs"
              style={{ background: 'rgba(255, 255, 255, 0.08)' }}
            />
          </Group>
          <MantineSkeleton 
            height={6} 
            width="100%" 
            radius="xl"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
          />
        </Box>
      </Stack>
    </Card>
  )
}

export default { CryptoCardSkeleton }
