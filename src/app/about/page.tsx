import { Section } from '@/components/layout';
import { Button, Card, Text } from '@/components/ui';
import { aboutContent } from '@/config/content.config';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Section spacing='xl' background='gradient' align='center'>
        <div className='mx-auto max-w-3xl text-center'>
          <Text variant='h1' className='mb-6 text-white'>
            {aboutContent.hero.title}
          </Text>
          <Text variant='lead' className='text-neutral-300'>
            {aboutContent.hero.subtitle}
          </Text>
        </div>
      </Section>

      {/* Story Section */}
      <Section spacing='lg' contained>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          <div>
            <Text variant='h2' className='mb-6'>
              {aboutContent.story.title}
            </Text>
            {aboutContent.story.paragraphs.map((paragraph, i) => (
              <Text key={i} variant='body' className='mb-4 text-neutral-600 dark:text-neutral-400'>
                {paragraph}
              </Text>
            ))}
            <div className='mt-6 flex gap-8'>
              {aboutContent.story.stats.map((stat, i) => (
                <div key={i}>
                  <Text variant='h4' className='text-brand-primary'>
                    {stat.value}
                  </Text>
                  <Text variant='small'>{stat.label}</Text>
                </div>
              ))}
            </div>
          </div>

          <Card variant='default' padding='lg' className='flex h-80 items-center justify-center'>
            <Text variant='body' className='text-center text-neutral-500'>
              [Company Image Placeholder]
            </Text>
          </Card>
        </div>
      </Section>

      {/* Values Section */}
      <Section spacing='lg' background='neutral'>
        <div className='mb-12 text-center'>
          <Text variant='h2' className='mb-4'>
            {aboutContent.values.title}
          </Text>
          <Text variant='lead' className='text-neutral-600 dark:text-neutral-400'>
            {aboutContent.values.subtitle}
          </Text>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {aboutContent.values.items.map((value, i) => (
            <Card key={i} variant='default' padding='lg' className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary'>
                <div className='h-8 w-8 rounded-full bg-white'></div>
              </div>
              <Text variant='h5' className='mb-3'>
                {value.title}
              </Text>
              <Text variant='body' className='text-neutral-600 dark:text-neutral-400'>
                {value.description}
              </Text>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section spacing='lg' align='center'>
        <div className='text-center'>
          <Text variant='h2' className='mb-4'>
            {aboutContent.cta.title}
          </Text>
          <Text variant='lead' className='mb-8 text-neutral-600 dark:text-neutral-400'>
            {aboutContent.cta.subtitle}
          </Text>
          <Button size='lg'>{aboutContent.cta.button}</Button>
        </div>
      </Section>
    </>
  );
}
