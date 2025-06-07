import './ReviewsCarousel.css';

const reviews = [
  { text: 'Incredible experience. I feel so much more in tune with my body!', name: 'Sarah M.' },
  { text: 'The AI gave me recommendations that my doctor hadn’t even considered.', name: 'James L.' },
  { text: 'Super easy to use and very informative. Highly recommend!', name: 'Tanya R.' },
  { text: 'I love being able to upload my health reports and get personalized insights.', name: 'Kevin H.' },
  { text: 'Feels like a real naturopath is guiding me every step of the way.', name: 'Alicia T.' },
  { text: 'I read the articles every week — they’re so helpful!', name: 'Priya S.' },
  { text: 'The symptom checker is freakishly accurate. Impressed!', name: 'Jordan K.' },
  { text: 'Beautiful design and user-friendly experience.', name: 'Melissa B.' },
  { text: 'I finally feel heard. The AI’s suggestions were surprisingly thoughtful and personalized.', name: 'Leah W.' },
  { text: 'Uploading my blood work was seamless, and the analysis was incredibly insightful.', name: 'Marcus D.' },
  { text: 'I’ve already recommended this to all my friends. It’s like having a naturopath in your pocket!', name: 'Emily J.' },
  { text: 'The weekly articles help me understand my health in ways no doctor ever explained.', name: 'Nora K.' },
  { text: 'I love the gentle, non-judgmental tone of the recommendations. It feels so human.', name: 'Samir B.' },
  { text: 'Being able to track my symptoms over time has made me feel so much more in control.', name: 'Vanessa R.' },
  { text: 'This is the future of holistic wellness. Tech + empathy = magic.', name: 'Isaac M.' },
  { text: 'Even my skeptical partner is impressed with how accurate the AI’s suggestions are.', name: 'Olivia N.' },
  { text: 'The personalized plan adapted as my lifestyle changed. I’ve never seen that before!', name: 'Jason P.' },
  { text: 'It’s affordable, beautifully designed, and genuinely useful. 10/10.', name: 'Rachel F.' },
  { text: 'It’s great that I can get naturopathic advice from the comfort of my own home, well done!', name: 'Fran P.' },
];

const ReviewsCarousel = () => {
  const renderRow = (reverse: boolean, rowIndex: number) => (
    <div className={`carousel-track ${reverse ? 'reverse' : ''}`} style={{ animationDuration: `${70 - rowIndex * 10}s` }}>
      {[...reviews, ...reviews].map((review, i) => (
        <div className="review-card" key={`${rowIndex}-${i}`}>
          <p className="review-text">“{review.text}”</p>
          <div className="review-footer">
            <span className="review-name">{review.name}</span>
            <span className="review-stars">★★★★★</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="reviews-carousel">
      <h2 className="carousel-title">What people are saying</h2>
      <div className="carousel-row">{renderRow(false, 0)}</div>
      <div className="carousel-row">{renderRow(true, 1)}</div>
      <div className="carousel-row">{renderRow(false, 2)}</div>
    </div>
  );
};

export default ReviewsCarousel;