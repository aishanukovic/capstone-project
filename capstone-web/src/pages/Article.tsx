import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SleepArticle from '../components/articles/sleep';
import NutritionArticle from '../components/articles/nutrition';
import GutBrainArticle from '../components/articles/gutBrain';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const articleData: Record<string, any> = {
  sleep: {
    title: 'How Sleep Impacts Your Hormones',
    date: 'May 29, 2025',
    content: <SleepArticle />,
    author: {
      name: 'Dr. Amara Wells, ND',
      image: '/sleepdr.jpg',
    },
    thumbnail: '/sleep.jpg',
  },
  nutrition: {
    title: 'Personalized Nutrition 101',
    date: 'May 22, 2025',
    content: <NutritionArticle />,
    author: {
      name: 'Dr. Kiran Mehta, ND',
      image: '/nutritiondr.jpg',
    },
    thumbnail: '/apple.jpg',
  },
  'gut-brain': {
    title: 'Mental Health & the Gut-Brain Axis',
    date: 'May 15, 2025',
    content: <GutBrainArticle />,
    author: {
      name: 'Dr. Naomi Chen, ND',
      image: '/braindr.jpg',
    },
    thumbnail: '/brain.jpg',
  },
};

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = articleData[id ?? ''];

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center text-gray-500 text-xl">
          Article not found.
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      <Navbar />
      <main className="flex-grow px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{article.title}</h1>
          <p className="text-sm text-gray-500 mb-6">Posted on {article.date}</p>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="text-gray-700 text-lg whitespace-pre-line">
              {article.content}
            </div>
          </div>

          <div className="flex items-center gap-4 border-t pt-6 mt-8">
            <img
              src={article.author.image}
              alt={article.author.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold text-gray-800">{article.author.name}</p>
              <p className="text-md text-gray-500">Licensed Naturopathic Doctor</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;