import { subDays } from './utils';

export const dummyEntries = [
  {
    id: 1,
    date: new Date().toISOString(),
    content: 'Today I went for a walk with my dog',
    title: 'Morning Walk'
  },
  {
    id: 2,
    date: new Date().toISOString(),
    content: "My pet fish just died. I don't know what to do",
    title: 'Sad Day'
  },
  {
    id: 3,
    date: subDays(new Date(), 5).toISOString(),
    content: "I went out to eat ramen. It wasn't fun",
    title: 'Dinner Out'
  },
  {
    id: 4,
    date: subDays(new Date(), 10).toISOString(),
    content: 'I am so excited for school to be over.',
    title: 'School Thoughts'
  },
  {
    id: 5,
    date: '2025-04-12T15:00:00Z',
    content: 'Finished reading a book.',
    title: 'Reading Achievement'
  },
  {
    id: 6,
    date: '2025-03-15T11:00:00Z',
    content: 'Spring break was nice.',
    title: 'Spring Break'
  },
  {
    id: 7,
    date: '2025-03-14T11:00:00Z',
    content: 'I feel so tired.',
    title: 'tired'
  },
  {
    id: 8,
    date: '2025-03-10T11:00:00Z',
    content: 'I ate corn and tasted stale...',
    title: 'Food Review'
  },
  {
    id: 9,
    date: '2025-03-10T11:00:00Z',
    content: 'My parents got mad because I broke...',
    title: 'Family Drama'
  },
];